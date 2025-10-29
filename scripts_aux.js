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
  //console.log(base)
  //base contiene la informacion de todos los indicadores.
  base_filtrada=base.filter(line=>{return((line[0]+': '+line[2])==indicador || line[0]==='Tema')})
  //base_filtrada solamente la del indicador.
  //console.log(base_filtrada)
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

encontrarIntervaloDatos=function(dat){
  let ultima_columna;
  const numero_columnas = dat[0].length;
  for (let i = numero_columnas - 1; i >= 0; i--) { 
    const currentColumn = dat.map(row => row[i]);
    // Verificar si la columna NO es toda 'NA' ni 0
    if (!currentColumn.every(x => x === 'NA' || x === 'NA\r') && !currentColumn.every(x => x == 0 || x == '0\r')) {
      ultima_columna = i;
      break;
    }
  }
  let primera_columna;
  for (let i = 4; i < dat[0].length; i++) {
    const currentColumn = dat.map((row) => row[i]);
    if (!currentColumn.every((x) => x === "NA" || x === "NA\r") && !currentColumn.every((x) => x == 0 || x == "0\r")) {
      primera_columna = i;
      break; 
    }
  }
  return { primera_columna, ultima_columna };
}

function updateJsonData() {
    // Disparar un evento personalizado cuando se actualiza el JSON
    const event = new CustomEvent("jsonDataUpdated", {});
    window.dispatchEvent(event);
}

function updateChartAndMap() {
    // 'this' será el elemento 'anio_mes' al ser llamado como handler de evento.
    const columna_seleccionada = this.value; //También temporalidad
    
    // Transponer y tomar la columna con los nombres de los estados.
    // Usamos datosIndicadorTema (variable global actualizada)
    let OriginalEstados = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex]))[1].map((x) => x.replace(/^"|"|\r$/g, ""))
    
    // Transponer y tomar la columna con los valores de los estados (columna seleccionada).
    var datosEstados = datosIndicadorTema[0].map((_, colIndex) => datosIndicadorTema.map(row => row[colIndex].replace(/^"|"|\r/g, "")))[columna_seleccionada]
    
    const combined_Estados = datosEstados.map((dato_est, index) => ({
        dato: OriginalEstados[index], // Nombre estado
        // Convertimos a null si es "NA", y a número si no lo es (usando parseFloat).
        value: dato_est == "NA" ? null : parseFloat(dato_est.replace(/,$/g, "")), 
    })); 

    // Copia y ordenación (se mantiene la copia para no modificar combined_Estados si fuera usado de nuevo)
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
    
    // Actualizar datos del mapa (mexico.features)
    mexico.features.forEach((feature, index) => {
        // Encontrar el estado correspondiente en el array combinado (ya que combined_Estados está en el orden original del GeoJSON)
        // Buscamos el objeto estado por su nombre NOMGEO
        const estadoData = combined_Estados_ordenados.find(item => item.dato === feature.properties.NOMGEO);
        const index_en_original = OriginalEstados.indexOf(feature.properties.NOMGEO);

        feature.properties.Valor = datosEstados[index_en_original];

        // Calcular CVEGEO basado en la posición ordenada.
        feature.properties.CVEGEO =
            estadoData.value === null
                ? "NA"
                : 33 - indexedEstados[index_en_original].toString().padStart(2, "0"); // CVEGEO es su posición a nivel nacional
    });

    // Reordenar los datos de estados según el array ordenado para la gráfica
    datosEstados = combined_Estados_ordenados.map((item) => item.value);

    // Destruir gráfica anterior
    if (typeof chart_nac != "undefined") {
        chart_nac.destroy();
    }

    // Crear la nueva gráfica de barras
    const ctx_nac = document.getElementById("nacional").getContext("2d"); 
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
    // Iluminar a Hidalgo
    chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] = "rgba(75, 192, 192, 1)"; 
    
    updateJsonData();
    $("#indicador option[value='default']").remove();
}