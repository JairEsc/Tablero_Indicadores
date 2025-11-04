var bounds = L.latLngBounds(
    L.latLng(35.0, -122.0), 
    L.latLng(12.0, -83.0)   
);
var map = L.map('map_tablero_indicadores',{
    maxBounds: bounds,        // Establecer los límites máximos
    maxBoundsViscosity: 0.5
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
        fillColor: getColor(feature.properties.Ranking),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
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
        fillOpacity: 0.9,
    
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
    B.myVariable =e.target.feature.properties.NOMGEO;
}
function clickFeature(e) {
    var props = e.target.feature.properties;
    var popupContent = `
        <div style="font-family: Arial, sans-serif; padding: 10px; min-width: 200px;">
            <h3 style="color: #2c3e50; margin-bottom: 10px; border-bottom: 2px solid #3498db;">
                ${props.NOMGEO}
            </h3>
            <div style="font-size: 14px; line-height: 1.4;">
                <p style="margin: 5px 0;">
                    <strong style="color: #2c3e50;">Dato:</strong> 
                    <span style="color: #34495e;">${props.Valor || 'N/A'}</span>
                </p>
                <p style="margin: 5px 0;">
                    <strong style="color: #2c3e50;">Valor transformado:</strong> 
                    <span style="color: #34495e;">${props.Valor_Transf }</span>
                </p>
                <p style="margin: 5px 0;">
                    <strong style="color: #2c3e50;">Ranking:</strong> 
                    <span style="color: #34495e;">${props.Sentido=='Menos es mejor'? (props.Ranking || 'N/A') : (33-props.Ranking)}</span>
                </p>
                <p style="margin: 5px 0;">
                    <strong style="color: #2c3e50;">Sentido:</strong> 
                    <span style="color: #34495e;">${props.Sentido || 'N/A'}</span>
                </p>
            </div>
        </div>
    `;
    
    e.target.bindPopup(popupContent).openPopup();
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
        click: clickFeature,
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
    this._div.innerHTML = props ? 
        `<h4>${props.NOMGEO}</h4>
         <div style="font-size: 12px; margin-top: 5px; display:inline-grid">
            <p><strong>Dato:</strong> ${props.Valor || 'N/A'}</p><br>
            <p style='font-size: xx-small'>click para más información</p>
            </div>`
            // <p><strong>Valor transformado:</strong> ${props.Valor_Transf }</p><br>
            // <p><strong>Ranking:</strong> ${props.Ranking || 'N/A'}</p><br>
            // <p><strong>Sentido:</strong> ${props.Sentido || 'N/A'}</p><br>
        : '<h4>Seleccione un estado</h4>';
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
        if (layer.feature && layer.feature.properties.NOMGEO === cve) {
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
    position:'topleft',		
    layer: poligonos_map,
    initial: false,
    zoom: 7,
    marker: false,
    propertyName: 'NOMGEO',
});

map.addControl( controlSearch );