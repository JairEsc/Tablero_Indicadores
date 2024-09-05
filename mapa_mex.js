var bounds = L.latLngBounds(
    L.latLng(32.71865357039013, -86.71040527988355), // Coordenada suroeste
    L.latLng(14.532098369766466, -118.3651143522829)  // Coordenada noreste
  );
var map = L.map('map_tablero_indicadores',{
    maxBounds: bounds,        // Establecer los límites máximos
    maxBoundsViscosity: 0.8
}).fitBounds(bounds);
function getColor(d) {
    return d==1? "#a50026":
    d==2? "#b50f26":
    d==3? "#c51f27":
    d==4? "#d52e27":
    d==5? "#df422f":
    d==6? "#e95538":
    d==7? "#f26941":
    d==8? "#f67e4b":
    d==9? "#f99354":
    d==10? "#fca85e":
    d==11? "#fdb96a":
    d==12? "#fec978":
    d==13? "#feda86":
    d==14? "#fee695":
    d==15? "#fff0a6":
    d==16? "#fffab7":
    d==17? "#f9fcb7":
    d==18? "#edf7a6":
    d==19? "#e0f295":
    d==20? "#d2ec87":
    d==21? "#c2e57c":
    d==22? "#b2de71":
    d==23? "#a0d669":
    d==24? "#8bcd67":
    d==25? "#77c465":
    d==26? "#61bb62":
    d==27? "#49af5c":
    d==28? "#30a356":
    d==29? "#19964f":
    d==30? "#118747":
    d==31? "#08773f":
    d==32? "#006837":'#bfbfbf'
}
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 4,
	maxZoom: 15,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);


function style_ent(feature) {
    return {
        fillColor: getColor(feature.properties.CVEGEO),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
}
poligonos_map = L.geoJson(mexico, {
    style: style_ent,
    onEachFeature: onEachFeature,
}).addTo(map)
map.fitBounds(poligonos_map.getBounds());
var ultimo_seleccionado='Hidalgo'

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
    B.myVariable =e.target.feature.properties.NOMGEO;
}

function resetHighlight(e) {
    B.myVariable ='Hidalgo';
    poligonos_map.resetStyle();
    info.update();
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info_tablero_indicadores'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = 
    '<h4>' +  (props ?
        props.NOMGEO ? props.NOMGEO+'</h4>'+"<p style='font:8px;float:right'>"+"Dato: "+Math.round(props.Valor*100)/100+"</p>"
        : props.NOMGEO+'</h4>': ' ');
};

info.addTo(map);

var B = {};//Aquí se define una variable global

Object.defineProperty(B, 'myVariable', {
    set: function(value) {
        this._myVariable = value;
        this.onChange(value);
    },
    get: function() {
        return this._myVariable;
    }
});

function updateStyle() {
    console.log("Mapa actualizado");
    poligonos_map.setStyle(style_ent);
    poligonos_map.resetStyle();

}
window.addEventListener('jsonDataUpdated', function(e) {
    updateStyle();
});
  
function resaltarPoligonoPorCVE(cve) {
    poligonos_map.eachLayer(function(layer) {
        if (layer.feature && layer.feature.properties.CVEGEO === cve) {
            layer.setStyle({
                weight: 5,
                color: '#666',
                fillOpacity: 0.7
            });
            layer.bringToFront();
            info.update(layer.feature.properties);
        } else {
            poligonos_map.resetStyle(layer);
        }
    });
}
var controlSearch = new L.Control.Search({
    position:'bottomleft',		
    layer: poligonos_map,
    initial: false,
    zoom: 7,
    marker: false,
    propertyName: 'NOMGEO',
});

map.addControl( controlSearch );