//Reestructuración.
let bienvenida_tab = true;
let posiblesIndicadores=[];//Variable global para guardar los indicadores.
let indicadoresMensuales=[];//Variable global para guardar los indicadores.
let indicadoresTrimestrales=[];//Variable global para guardar los indicadores.
let indicadoresAnuales=[];//Variable global para guardar los indicadores.
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
document.getElementById('historico').addEventListener('dblclick', () => {
  chart.resetZoom();
});

B.onChange = function (newValue) {
  //console.log(newValue);
  var sortedEstados = chart_nac.data.labels;
  
  chart_nac.data.datasets[0].backgroundColor = sortedEstados.map(() => 
    "rgba(220, 220, 220, 0.2)" // or whatever default color you want
  );
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf(newValue)] =
    "rgba(75, 192, 192, 1)";
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf('Hidalgo')] =
    "rgba(75, 192, 192, 1)";
    
  chart_nac.update();
};
//Pasos. 
//1. Consumir el archivo de temporalidad.csv para alimentar los indicadores generales

PromesaLeerPosiblesIndicadores= new Promise ((res,rej)=>{
    fetch("Datos/Que_tiempo2.csv").then(respuesta=>{
      //console.log(respuesta)
      respuesta.text().then(datos=>{res(datos.split("\r\n").slice(1).map(line => line.split(",").map(item =>item.trim().replace(/^"|"$/g, ""))))})
    })
})
rellenarIndicadores=function(datos,tema='Todo'){
  const select = document.getElementById("indicador_tablero_indicadores");
  $("#indicador_tablero_indicadores").empty();
  var uniqueIndicators = new Set();
  datos.forEach((line, index) => {
    var indicadorValue = line[0]+': '+line[1];
    //Se va a seleccionar
    if (!uniqueIndicators.has(indicadorValue)) {
      const option = document.createElement("option");
      option.value = indicadorValue;
      if(tema=='Todo'){
        option.text  = indicadorValue;}
      else{
        option.text  = line[1];
      }
      select.appendChild(option);
      uniqueIndicators.add(indicadorValue);
    }
  });
}
PromesaLeerPosiblesIndicadores.then(//Alimentamos el select de indicadores generales
  datos=>{
    posiblesIndicadores=datos
  console.log(datos)
  rellenarIndicadores(datos)
})

PromesaLeerMensuales= new Promise ((res,rej)=>{
    fetch("Datos/Mensual.csv").then(respuesta=>{
      respuesta.text().then(datos=>{res(datos.split("\r\n").slice(0).map(line => line.split(",").map(item =>item.trim().replace(/^"|"$/g, ""))))})
    })
})
PromesaLeerTrimestrales= new Promise ((res,rej)=>{
    fetch("Datos/Trimestral.csv").then(respuesta=>{
      respuesta.text().then(datos=>{res(datos.split("\r\n").slice(0).map(line => line.split(",").map(item =>item.trim().replace(/^"|"$/g, ""))))})
    })
})
PromesaLeerAnuales= new Promise ((res,rej)=>{
    fetch("Datos/Anual.csv").then(respuesta=>{
      respuesta.text().then(datos=>{res(datos.split("\r\n").slice(0).map(line => line.split(",").map(item =>item.trim().replace(/^"|"$/g, ""))))})
    })
})

PromesaLeerMensuales.then(datos=>{
  indicadoresMensuales=datos
})
PromesaLeerTrimestrales.then(datos=>{
  indicadoresTrimestrales=datos
})
PromesaLeerAnuales.then(datos=>{
  indicadoresAnuales=datos
})
//2. Supongamos que elige indicador sin especificar tema
revisarTemporalidadIndicador=function(indicador){
    const filaIndicador = posiblesIndicadores.find(line => (line[0]+': '+line[1]) === indicador);
    if(filaIndicador){
      //console.log(filaIndicador)
      return filaIndicador[2]; // temporalidad
    }else{
      return null; //Indicador no encontrado
    }
}
generarDatos_DadoIndicadorTema=function(tema="Todo",indicador){
  let base;
  //Se deben generar dos listas. Histórico y Nacional. 
  const temporalidadIndicadorSeleccionado=revisarTemporalidadIndicador(indicador)
  switch(temporalidadIndicadorSeleccionado){
    case "Mensual":
      base=indicadoresMensuales;
      break;
    case "Trimestral":
      base= indicadoresTrimestrales;
      break;
    case "Anual":
      base= indicadoresAnuales;
      break;
  }
  console.log(base)
  //base contiene la informacion de todos los indicadores.
  base_filtrada=base.filter(line=>{return((line[0]+': '+line[2])==indicador || line[0]==='Tema')})
  //base_filtrada solamente la del indicador.
  console.log(base_filtrada)
  if(tema==="Todo"){
    console.log("Estamos en Todo")
  }
  return(base_filtrada)
}
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

$("#tema_tablero_indicadores").change(function () {

  document.getElementById('indicador_tablero_indicadoresSearch').value=''
  //De manera dinámica, cada vez que se cambia el valor de "tema", hace lo siguiente:
  //$("#option option[value='default']").remove();
  //Elegimos el tema:
  console.log($(this).val())
  posiblesIndicadores_filtrados=posiblesIndicadores.filter(
    line=>{
      return (line[0]===$(this).val() || $(this).val()=='Todo')
    }
  )
  document.getElementById("tema_tablero_indicadores").hidden = false;
  document.getElementById("tema_tablero_indicadores").options[0].text = "Buscar entre todos los indicadores";
  //document.getElementById("ForTema").style.display = "none";
  document.getElementById("instruccion_buscar_por_indicador").style.display = "none";
  //document.querySelector('.search_title').textContent = 'Busca un Tema y luego un Indicador';

  rellenarIndicadores(posiblesIndicadores_filtrados,tema=$(this).val())

});




$("#indicador_tablero_indicadoresSearch").focus(function() {
        // reiniciamos el valor del input a vacío.
        $(this).val(' ');
});
$("#indicador_tablero_indicadoresSearch").change(async function () {
  const temaSeleccionado = $("#tema_tablero_indicadores").val();
  const indicadorSeleccionado = $(this).val();
  console.log($(this).val())
  console.log(revisarTemporalidadIndicador($(this).val()))
  tiempo_del_indic_sel=revisarTemporalidadIndicador($(this).val())
  datosIndicadorTema=generarDatos_DadoIndicadorTema(tema='Todo',$(this).val())
  //DatosIndicadorTema tiene header + datos nacionales del indicador.
  console.log(datosIndicadorTema)
  //Ocultar imagen de bienvenida.
  if (bienvenida_tab) {
    document.getElementsByClassName(
      "bienvenida_tab_tablero_indicadores"
    )[0].className = "tabcontent_hist_tablero_indicadores";
    bienvenida_tab = false;
  }
  //Mostrar la seccion del tablero.
  document.getElementById("section_tablero_indicadores").style.visibility =
    "visible";
  document.getElementById("defaultOpen").click(); //simulamos que estamos en la historica para que se creen ambas
  //cuando cambia el valor del indicador:

  function updateJsonData() {//Se puede utilizar una variable global en lugar del window.
    // Disparar un evento personalizado cuando se actualiza el JSON
    const event = new CustomEvent("jsonDataUpdated", {});
    window.dispatchEvent(event);
  }
  console.log("Estamos imprimiendo el nac: ", datosIndicadorTema);
  //Actualizar la descripción del indicador
  document.getElementById("descripcion_indicador").innerHTML = datosIndicadorTema[1][2]+' (Temporalidad : '+tiempo_del_indic_sel+')';
  document.getElementById("fuente").innerHTML = "Fuente:" + datosIndicadorTema[1][3];
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).style.visibility = "visible";
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).innerHTML='Descripción del Indicador:  <p style="all:unset">'+$(this).val()+'</p>';//Agregamos el nombre del indicador a la descripción.
  ///////////////////////
  /// Cambios de Lalo ///
  ///////////////////////
  Header=datosIndicadorTema[0]//Header de la base filtrada.
  datosIndicadorTema=datosIndicadorTema.slice(1)
  let ultima_columna;
  const numero_columnas = datosIndicadorTema[0].length;
  for (let i = numero_columnas - 1; i >= 0; i--) { 
    const currentColumn = datosIndicadorTema.map(row => row[i]);
    // Verificar si la columna NO es toda 'NA' ni 0
    if (!currentColumn.every(x => x === 'NA' || x === 'NA\r') && !currentColumn.every(x => x == 0 || x == '0\r')) {
      ultima_columna = i;
      break;
    }
  }
  let primera_columna;
  for (let i = 4; i < datosIndicadorTema[0].length; i++) {
    const currentColumn = datosIndicadorTema.map((row) => row[i]);
    if (!currentColumn.every((x) => x === "NA" || x === "NA\r") && !currentColumn.every((x) => x == 0 || x == "0\r")) {
      primera_columna = i;
      break; 
    }
  }
  console.log("Primera columna válida:", primera_columna, "Última columna válida:", ultima_columna);
  console.log("Encabezado first:", Header[primera_columna], "Encabezado last:", Header[ultima_columna]);
  
  //Rellenar select de años/meses en el mapa
  const select = document.getElementById("anio_mes");
  select.innerHTML = "";
  for (let i = primera_columna; i <= ultima_columna; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = Header[i].replace(/^"|"|\r/g, "").split("_").reverse().map((parte, idx) => idx === 0 ? parte.padStart(2, "0") : parte).join("/");
    select.appendChild(option);
  }
  document.getElementById("anio_mes").value = ultima_columna; //Seleccionamos el último mes por default

  //Cuando cambia la seleccion del mes/año en el mapa:
  document.getElementById("anio_mes").addEventListener("change", function() {
    columna_seleccionada = this.value; //También temporalidad
    console.log("Columna seleccionada:", columna_seleccionada);
    let OriginalEstados = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex]))[1].map((x) => x.replace(/^"|"|\r$/g, ""))
    //OriginalEstados=OriginalEstados.slice(1)//Quitamos header
    var datosEstados = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex].replace(/^"|"|\r/g, "")))[columna_seleccionada]//Tomamos el primero
    //datosEstados=datosEstados.slice(1)//Quitamosheader
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
            label: datosIndicadorTema[1][2].replace(/^"|"|\r|'$/g, ""),
            data: datosEstados,
            backgroundColor:SortedEstados.map(()=>"rgba(75, 192, 192, 0.2)"),
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
  for (let i = 4; i < datosIndicadorTema[0].length; i++) {
    const currentColumn = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex]))[i];

    firstCol=i

    if (!currentColumn.every(x => x === 'NA' || x==='NA\r')&& !currentColumn.every(x=>x==0 || x=='0\r')) {
      break; // Exit the loop early
    }
    //console.log(firstCol)
    // If it *is* entirely 'NA', decrement the resultIndex
    
  }
  let New_lastCol;
  for (let i = 0; i < datosIndicadorTema[0].length; i++) {
    const currentColumn = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex])).reverse()[i];
    New_lastCol=i
    if (!currentColumn.every(x => x === 'NA' || x==='NA\r')&& !currentColumn.every(x=>x==0 || x=='0\r')) {
      break;
    }
  }

  const Pre_Headers = Header.slice(firstCol, datosIndicadorTema[0].length - New_lastCol + 1);

  //Para seleccionar Hidalguito
  const nac_Hidalgo = datosIndicadorTema.find(line => line[1] === "Hidalgo");

  if (!nac_Hidalgo) {
  console.warn("Aguas! Hidalgo no está en este nac");
  }

  const Pre_Datos = nac_Hidalgo.slice(firstCol, datosIndicadorTema[0].length - New_lastCol);

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