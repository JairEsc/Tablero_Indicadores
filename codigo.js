
//Leemos el archivo que contiene la problemática y el periodo en el 
// que está registrado y lo guardamos en tablaTiempos, suponemos que está bien hecho
// y en sus variables son: Tema, Indicador, Temporalidad
let tablaTiempos = [];

async function cargarTablaTiempos() {
  const response = await fetch("Datos/Que_tiempo2.csv");
  const data = await response.text();
  const lines = data.split("\n").filter(line => line.trim() !== "");
  const rows = lines.slice(1).map(line => line.split(","));
  tablaTiempos = rows.map(row => ({
    tema: row[0].trim().replace(/^"|"$/g, ""),
    indicador: row[1].trim().replace(/^"|"$/g, ""),
    tiempo: row[2].trim().replace(/^"|"$/g, "")
  }));
  return tablaTiempos;
}

function limpiarTexto(txt) {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/["'\r]/g, "")
            .trim();
}
async function cargarArchivoPorTemaEIndicador(temaSeleccionado, indicadorSeleccionado) {
  const registro = tablaTiempos.find(entry =>
    entry.tema === temaSeleccionado && entry.indicador === indicadorSeleccionado
  );

  if (!registro) {
    alert("No se encontró el archivo correspondiente para esta combinación.");
    return;
  }

  const tiempo = registro.tiempo;
  const archivoCSV = `Datos/${tiempo}.csv`;

  const response = await fetch(archivoCSV);
  const csv = await response.text();

  const lines = csv.split("\n");
  Header = lines[0].split(",");
  base = lines.slice(1).map(line => line.split(","));

  console.log("Archivo cargado:", archivoCSV);
  if(temaSeleccionado=="Todo"){
    temaSeleccionado2=indicadorSeleccionado.split(": ")[0];
    indicadorSeleccionado2=indicadorSeleccionado.split(": ")[1];
  }else{
    temaSeleccionado2=temaSeleccionado;
    indicadorSeleccionado2=indicadorSeleccionado;
  }
  console.log(temaSeleccionado2);
  console.log(indicadorSeleccionado2);
nac = base.filter(line =>
  limpiarTexto(line[0]) === limpiarTexto(temaSeleccionado2) &&
  limpiarTexto(line[2]) === limpiarTexto(indicadorSeleccionado2)
);
}
// Para llenar todo en base a Todo
let RRR=[];
async function cargarArchivoParaTodo() {
  const archivoCSV = `Datos/Que_tiempo2.csv`;

  const response = await fetch(archivoCSV);
  const csv = await response.text();

  const lines = csv.split("\n");
  Header = lines[0].split(",");
  base = lines.slice(1).map(line => line.split(","));

  console.log("Archivo cargado:", archivoCSV);
  RRR = base.filter(line =>
    limpiarTexto(line[0]) == "Todo"
  );
  return RRR;
}

async function todito() {
  RRR = await cargarArchivoParaTodo();
  console.log(RRR);
  fetchData(RRR,5);
}
todito();
// Fin del Todo

//Después de quitar Todo
let MA=[];
async function cargarArchivoParaMA() {
  const archivoCSV = `Datos/Que_tiempo2.csv`;

  const response = await fetch(archivoCSV);
  const csv = await response.text();

  const lines = csv.split("\n");
  Header = lines[0].split(",");
  base = lines.slice(1).map(line => line.split(","));

  console.log("Archivo cargado:", archivoCSV);
  MA = base.filter(line =>
    limpiarTexto(line[0]) == "Medio Ambiente"
  );
  return MA;
}
async function ActualizarParaMA() {
  MA = await cargarArchivoParaMA();
  console.log(MA);
  fetchData(MA,5);
}
//

/////////////////////////////////////////////////////////
//INICIO ORIGINAL
/////////////////////////////////////////////////////////

function openChart(evt, tagName) {
  //funcion para activar una de las gráficas según la elección.
  var i, tabcontent, tablinks;
  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName(
    "tabcontent_tablero_indicadores"
  );
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    tablinks[i].className += " pulse-button_tablero_indicadores";
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tagName).style.display = "flex";
  evt.currentTarget.className = "tablinks ";
  evt.currentTarget.className += " active";

  if (tagName === "nacional_chart") {
    document.getElementById("anio_mes").style.display = "block";
  } else {
    document.getElementById("anio_mes").style.display = "none";
  }

  window.dispatchEvent(new Event("resize"));
  //console.log("Estamos imprimiendo tagName: ", tagName);

}
function linearRegression(y, x) {
  //Hace regresión lineal dados y,x
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;
  for (var i = 0; i < y.length; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
    sum_yy += y[i] * y[i];
  }
  lr["slope"] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  lr["intercept"] = (sum_y - lr.slope * sum_x) / n;
  return lr;
}
function fetchData(data, valor) {//Para este sería suficiente un .csv con header (Tema, Indicador)
  //Dado un conjunto de datos y una elección de tema, rellena las posibles opciones del indicador.
  const select = document.getElementById("indicador_tablero_indicadores");
  $("#indicador_tablero_indicadores").empty();
  var uniqueIndicators = new Set();
  // const option = document.createElement("option");
  // option.value = "default";
  // option.text = "Seleccione uno";
  // select.appendChild(option);
  // uniqueIndicators.add("Seleccione uno");
  data.slice(0).forEach((line, index) => {
    var indicadorValue = line[1].trim().replace(/^"|"$/g, "");
    //Se va a seleccionar
    if (!uniqueIndicators.has(indicadorValue)) {
      const option = document.createElement("option");
      option.value = indicadorValue;
      option.text = indicadorValue;
      select.appendChild(option);
      uniqueIndicators.add(indicadorValue);
    }
  });
}
document.getElementById("defaultOpen").click(); //El histórico es la gráfica por default.
//Posibles Temas
let Medio_Ambiente = [];
let Gobierno = [];
let Social = [];
let Economico = [];
let Seguridad = [];
let Genero = [];
let Todo = [];
let base;
let Header;

console.log(tablaTiempos); //Aún no tiene nada

Promise.all([
  fetch("Datos/Que_tiempo2.csv").then((response) => response.text()),
  cargarTablaTiempos()
]).then(([historicoData]) => {
  //Simplemente particionamos por tema. 
  var lines = historicoData.split("\n");
  Header=lines[0].split(",")
  lines.slice(1).forEach((line) => {
    let values = line.split(",");
    let tema = values[0].trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    switch (tema) {
      case "Medio Ambiente":
        Medio_Ambiente.push(values);
        break;
      case "Gobierno":
        Gobierno.push(values);
        break;
      case "Social":
        Social.push(values);
        break;
      case "Económico":
        Economico.push(values);
        break;
      case "Seguridad":
        Seguridad.push(values);
        break;
      case "Género":
        Genero.push(values);
        break;
      case "Todo":
        Todo.push(values);
        break;
    }
  });
});



$("#tema_tablero_indicadores").change(function () {

  document.getElementById('indicador_tablero_indicadoresSearch').value=''
  //De manera dinámica, cada vez que se cambia el valor de "tema", hace lo siguiente:
  $("#option option[value='default']").remove();
  //Elegimos el tema:
  switch ($(this).val()) {
    case "Medio Ambiente":
      base = Medio_Ambiente;
      break;
    case "Gobierno":
      base = Gobierno;
      break;
    case "Social":
      base = Social;
      break;
    case "Económico":
      base = Economico;
      break;
    case "Seguridad":
      base = Seguridad;
      break;
    case "Género":
      base = Genero;
      break;
    case "Todo":
      base= Todo
      break;
  }
  // Ahora puedes usar el objeto base
  fetchData(base, $(this).val().toString()); //
});




$("#indicador_tablero_indicadoresSearch").focus(function() {
        // reiniciamos el valor del input a vacío.
        $(this).val(' ');
});
$("#indicador_tablero_indicadoresSearch").change(async function () {
  const temaSeleccionado = $("#tema_tablero_indicadores").val();
  const indicadorSeleccionado = $(this).val();

  await cargarArchivoPorTemaEIndicador(temaSeleccionado, indicadorSeleccionado);

  document.activeElement.blur();
  if (bienvenida_tab) {
    document.getElementsByClassName(
      "bienvenida_tab_tablero_indicadores"
    )[0].className = "tabcontent_hist_tablero_indicadores";
    bienvenida_tab = false;
  }
  document.getElementById("section_tablero_indicadores").style.visibility =
    "visible";
  document.getElementById("defaultOpen").click(); //simulamos que estamos en la historica para que se creen ambas
  //cuando cambia el valor del indicador:

  function updateJsonData() {//Se puede utilizar una variable global en lugar del window.
    // Disparar un evento personalizado cuando se actualiza el JSON
    const event = new CustomEvent("jsonDataUpdated", {});
    window.dispatchEvent(event);
  }
  console.log("Estamos imprimiendo el nac: ", nac);
  if (nac[1].slice(4).every((val) => val === "NA")) {//Todos los estados tienen NA.
    document.getElementById("tab_map").style.visibility = "hidden";
    document.getElementById("info_hoverable").style.visibility = "hidden";
  } else {
    document.getElementById("tab_map").style.visibility = "visible";
    document.getElementById("info_hoverable").style.visibility = "visible";
  }

  document.getElementById("descripcion_indicador").innerHTML = nac[1][2];
  document.getElementById("fuente").innerHTML = "Fuente:" + nac[1][3];
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).style.visibility = "visible";
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).innerHTML='Descripción del Indicador:  <p style="all:unset">'+$(this).val()+'</p>';//Agregamos el nombre del indicador a la descripción.


  ///////////////////////
  /// Cambios de Lalo ///
  ///////////////////////
  let ultima_columna;
  const numero_columnas = nac[0].length;

  for (let i = numero_columnas - 1; i >= 0; i--) { 
    const currentColumn = nac.map(row => row[i]);

    // Verificar si la columna NO es toda 'NA' ni 0
    if (!currentColumn.every(x => x === 'NA' || x === 'NA\r') && !currentColumn.every(x => x == 0 || x == '0\r')) {
      ultima_columna = i;
      break;
    }
  }

  let primera_columna;
  for (let i = 4; i < nac[0].length; i++) {
    const currentColumn = nac.map((row) => row[i]);

    if (!currentColumn.every((x) => x === "NA" || x === "NA\r") && !currentColumn.every((x) => x == 0 || x == "0\r")) {
      primera_columna = i;
      break; 
    }
  }

  console.log("Primera columna válida:", primera_columna, "Última columna válida:", ultima_columna);
  console.log("Encabezado first:", Header[primera_columna], "Encabezado last:", Header[ultima_columna]);


  const select = document.getElementById("anio_mes");
  select.innerHTML = "";


  for (let i = primera_columna; i <= ultima_columna; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = Header[i].replace(/^"|"|\r/g, "").split("_").reverse().map((parte, idx) => idx === 0 ? parte.padStart(2, "0") : parte).join("/");
    select.appendChild(option);
  }

  document.getElementById("anio_mes").value = ultima_columna; //Seleccionamos el último mes por default

  document.getElementById("anio_mes").addEventListener("change", function() {
    columna_seleccionada = this.value; //También temporalidad
    console.log("Columna seleccionada:", columna_seleccionada);
    let OriginalEstados = nac[0].map((_, colIndex) => nac.map(row => row[colIndex]))[1].map((x) => x.replace(/^"|"|\r$/g, ""))

    var datosEstados = nac[0].map((_, colIndex) => nac.map(row => row[colIndex].replace(/^"|"|\r/g, "")))[columna_seleccionada]//Tomamos el primero
    const combined_Estados = datosEstados.map((dato_est, index) => ({
      dato: OriginalEstados[index], // Nombre estado
      value: dato_est == "NA" ? null : dato_est, // y su valor
    })); 

    const combined_Estados_ordenados = [...combined_Estados];
    combined_Estados_ordenados.sort((a, b) => b.value - a.value);
    
    SortedEstados = combined_Estados_ordenados.map((item) =>
      item.dato.toString()
    );

    indexedEstados = OriginalEstados.map(
      (item) => SortedEstados.indexOf(item.toString()) + 1
    ); 
    console.log("indexed", indexedEstados)
    console.log("datos", combined_Estados_ordenados)
    mexico.features.forEach((feature, index) => {
      feature.properties.Valor = datosEstados[index];
      feature.properties.CVEGEO =
        combined_Estados_ordenados[
          SortedEstados.indexOf(feature.properties.NOMGEO)
        ].value === null
          ? "NA"
          : 33 - indexedEstados[index].toString().padStart(2, "0"); //CVEGEO es su posición a nivel nacional
    });

    datosEstados = combined_Estados_ordenados.map((item) => item.value);

    if (typeof chart_nac != "undefined") {
      chart_nac.destroy();
    }

    const ctx_nac = document.getElementById("nacional").getContext("2d"); //inicio a crear la gráfica
    chart_nac = new Chart(ctx_nac, {
      type: "bar",
      data: {
        labels: SortedEstados,
        datasets: [
          {
            label: nac[1][2].replace(/^"|"|\r|'$/g, ""),
            data: datosEstados,
            backgroundColor: nac[1].slice(3).fill("rgba(75, 192, 192, 0.2)"),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onHover: function (event, elements) {
          if (elements.length) {
            resaltarPoligonoPorCVE(combined_Estados_ordenados[elements[0].index].dato);
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 10, // small font size
              },
              display: true,
              autoSkip: false
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10, // small font size
              },
            },
          },
        },
      },
    });
    chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] =
      "rgba(75, 192, 192, 1)"; //Ilumino a Hidalgo
    /*}*/
    updateJsonData();
    $("#indicador option[value='default']").remove();
  })
  document.getElementById("anio_mes").dispatchEvent(new Event("change"));

/////////////////////////////////////////////////////
  //INICIA EL CAMBIO by Enrique//
////////////////////////////////////////////////////
let firstCol;
  for (let i = 4; i < nac[0].length; i++) {
    const currentColumn = nac[0].map((_, colIndex) => nac.map(row => row[colIndex]))[i];

    firstCol=i

    if (!currentColumn.every(x => x === 'NA' || x==='NA\r')&& !currentColumn.every(x=>x==0 || x=='0\r')) {
      break; // Exit the loop early
    }
    //console.log(firstCol)
    // If it *is* entirely 'NA', decrement the resultIndex
    
  }
let New_lastCol;
  for (let i = 0; i < nac[0].length; i++) {
    const currentColumn = nac[0].map((_, colIndex) => nac.map(row => row[colIndex])).reverse()[i];
    New_lastCol=i
    if (!currentColumn.every(x => x === 'NA' || x==='NA\r')&& !currentColumn.every(x=>x==0 || x=='0\r')) {
      break;
    }
  }

  const Pre_Headers = Header.slice(firstCol, nac[0].length - New_lastCol + 1);

//Para seleccionar Hidalguito
const nac_Hidalgo = nac.find(line => limpiarTexto(line[1]) === "Hidalgo");

if (!nac_Hidalgo) {
  console.warn("Aguas! Hidalgo no está en este nac");
}

const Pre_Datos = nac_Hidalgo.slice(firstCol, nac[0].length - New_lastCol);

if (Pre_Datos.length <= 1) {
    document.getElementById("tab_map").click();
    document.getElementById("defaultOpen").style.visibility = "hidden";
  } else {
    document.getElementById("defaultOpen").click();
    document.getElementById("defaultOpen").style.visibility = "visible";
  }
  if (Pre_Datos.length <= 1) {
    console.log("No hay datos");
  } else {
//He aquí uno de los mayores cambios, para poder crear los label con "Año"_"Mes"
const combined = Pre_Headers.map((fecha, index) => {
  const Año_Mes = fecha.replace(/^"|"|\r/g, "").split("_");
  const año = Año_Mes[0];
  const mes = Año_Mes[1];

//Aquí me encuentro con un problema, al graficar hay varios puntos que no aparecen, no porque no aparezcan en el eje x
//pues eso es por el zoom y que no caben, lo que yo tengo es que a pesar de tener registros de algun mes, al hacer la 
//gráfica no aparecen los puntos y por ende la grafica no los contempla y supongo que la regresión eventualmente menos.

  const val = parseFloat(Pre_Datos[index]?.replace(/^"|"|\r|,$/g, ""));
  return {
    label: `${año}_${mes}`,
    year: año,
    month: mes,
    value: isNaN(val) ? null : val
  };
});


//Ordenanding por año y luego por mes
//Enrique:Una función toda fea pero fue la que se me ocurrio para solucionar mi error
function comparadorT(a,b){
  if(a.replace(/\D/g, '')===""){
    return a.localeCompare(b); //La idea de esto es principalmente por si están en el formato 2015_I, 2015_II,...,2015_XI,...
  }
  else{
    if(parseInt(a.replace(/\D/g, '')) < parseInt(b.replace(/\D/g, ''))){
      return -1;
    }
    if(parseInt(a.replace(/\D/g, '')) > parseInt(b.replace(/\D/g, ''))){
      return 1;
    }
    if(parseInt(a.replace(/\D/g, '')) == parseInt(b.replace(/\D/g, ''))){
      return 0;
    }
  }
}

const sortedCombined = combined.sort((a, b) =>
  a.year === b.year ? comparadorT(a.month,b.month): comparadorT(a.year,b.year)
);



const labels = sortedCombined.map(item => item.label);
const datos = sortedCombined.map(item => item.value);

const validPoints = datos
  .map((value, index) => ({ x: index, y: value }))
  .filter(point => point.y !== null && !isNaN(point.y));

const x = validPoints.map(p => p.x);
const y = validPoints.map(p => p.y);

const lr = linearRegression(y, x);


if (typeof chart != "undefined") {
  chart.destroy();
}

// Crear nueva gráfica
const ctx = document.getElementById("historico").getContext("2d");

const pendientePlugin = {
  id: "pendientePlugin",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      scales: { x, y },
    } = chart;
    ultimo_label = chart.data.labels[chart.data.labels.length - 1];
    const indexFinal = chart.data.labels.indexOf(ultimo_label);

    // Posición de Ultimo label en X
    const xValue = chart.data.labels[indexFinal];
    const xPos = x.getPixelForValue(xValue);
    const yPos = y.bottom - 10;

    ctx.save();
    // Dibujar línea vertical punteada
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(xPos, y.top);
    ctx.lineTo(xPos, y.bottom);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mensaje
    ctx.setLineDash([]); // Quitar punteado
    ctx.fillStyle = "red";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const yMiddle = (y.top + y.bottom) / 2;
    ctx.translate(xPos - 15, yMiddle);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Pendiente", 0, 0);

    ctx.restore();
  },
};
//

//
chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: $(this).val(),
        data: datos,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        spanGaps: true,
      },
      {
        label: "Tendencia (Regresión Lineal)",
        data: Array(labels.length).fill(null).map((_, i) =>
          x.includes(i) ? lr.slope * i + lr.intercept : null
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        spanGaps: true,
        hidden: true,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        limits: {
          x : {min:	'original', max:	'original'},
          y : {min:	'original', max:	'original', minRange:1}
        },
        zoom: {
          wheel: {enabled: true},
          drag: {enabled: true, maintainAspectRatio: true},
          pinch: {enabled: true},
          mode: 'x',
          scaleMode: 'x'
        }
      }
    }
  },
  plugins: [pendientePlugin]
});
}
//Aqui está donde se quita el zoom con doble click
document.getElementById('historico').addEventListener('dblclick', () => {
  chart.resetZoom();
});

});
B.onChange = function (newValue) {
  //Utiliza una variable "global" que se usa en el script del mapa de méxico.
  chart_nac.data.datasets[0].backgroundColor.fill("rgba(75, 192, 192, 0.2)");
  var sortedEstados = chart_nac.data.labels;
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf("Hidalgo")] =
    "rgba(75, 192, 192, 1)";
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf(newValue)] =
    "rgba(75, 192, 192, 1)";
  chart_nac.update();
};

document.getElementById('ForTema').addEventListener('click', () => {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  document.getElementById("tema_tablero_indicadores").hidden = false;
  document.getElementById("tema_tablero_indicadores").remove(0);
  ActualizarParaMA();
});
let bienvenida_tab = true;