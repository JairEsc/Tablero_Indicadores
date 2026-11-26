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
//Quita acentos y pasa a minúsculas para que la búsqueda encuentre "educacion" en "Educación".
normalizarTexto=function(texto){
  return (texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
//Escribe en cada tarjeta de tema cuántos indicadores tiene.
actualizarConteoTemas=function(){
  document.querySelectorAll("#temas_tablero_indicadores .tema-card").forEach(card => {
    const tema = card.querySelector("input").value;
    const total = new Set(posiblesIndicadores.filter(line => line[0] === tema).map(line => line[1])).size;
    card.querySelector(".tema-card__conteo").textContent = total + (total === 1 ? " indicador" : " indicadores");
  });
}
//Arma el listado de indicadores según los temas marcados y el texto del buscador.
rellenarIndicadores=function(){
  const lista = document.getElementById("lista_indicadores");
  const resumen = document.getElementById("resumen_indicadores");
  if (!posiblesIndicadores.length) {
    return; //Todavía no carga temporalidad.csv; se queda el mensaje "Cargando indicadores...".
  }
  const checks = Array.from(document.querySelectorAll("#temas_tablero_indicadores input[type='checkbox']"));
  const temasMarcados = checks.filter(check => check.checked).map(check => check.value);
  //Sin temas marcados se muestran todos.
  const temasVisibles = temasMarcados.length ? temasMarcados : checks.map(check => check.value);
  const textoBuscado = document.getElementById("buscador_indicadores").value.trim();
  const busqueda = normalizarTexto(textoBuscado);

  lista.innerHTML = "";
  let total = 0;
  temasVisibles.forEach(tema => {
    const vistos = new Set();
    const indicadores = posiblesIndicadores.filter(line => {
      if (line[0] !== tema || vistos.has(line[1]) || !normalizarTexto(line[1]).includes(busqueda)) {
        return false;
      }
      vistos.add(line[1]);
      return true;
    });
    if (!indicadores.length) {
      return;
    }
    total += indicadores.length;

    const grupo = document.createElement("section");
    grupo.className = "grupo-indicadores";
    const titulo = document.createElement("h3");
    titulo.className = "grupo-indicadores__titulo";
    titulo.textContent = tema;
    const conteo = document.createElement("span");
    conteo.textContent = indicadores.length;
    titulo.appendChild(conteo);
    grupo.appendChild(titulo);

    const ul = document.createElement("ul");
    indicadores.forEach(line => {
      const valor = line[0] + ": " + line[1]; //Mismo formato que usan revisarTemporalidadIndicador, etc.
      const li = document.createElement("li");
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "indicador-item";
      boton.dataset.valor = valor;
      boton.textContent = line[1];
      if (valor === indicadorSeleccionado) {
        boton.classList.add("indicador-item--activo");
        boton.setAttribute("aria-current", "true");
      }
      li.appendChild(boton);
      ul.appendChild(li);
    });
    grupo.appendChild(ul);
    lista.appendChild(grupo);
  });

  if (total === 0) {
    const vacio = document.createElement("p");
    vacio.className = "lista-indicadores__vacio";
    vacio.textContent = "No hay indicadores que coincidan con «" + textoBuscado + "».";
    lista.appendChild(vacio);
  }
  let textoResumen = total + (total === 1 ? " indicador" : " indicadores");
  if (temasMarcados.length) {
    textoResumen += " en " + temasMarcados.join(", ");
  }
  if (busqueda) {
    textoResumen += (total === 1 ? " que coincide con «" : " que coinciden con «") + textoBuscado + "»";
  }
  resumen.textContent = textoResumen;
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
revisarDescripcionIndicador=function(indicador){
    const filaIndicador = posiblesIndicadores.find(line => (line[0]+': '+line[1]) === indicador);
    if(filaIndicador){
      //console.log(filaIndicador)
      return filaIndicador[5]; // descripcion
    }else{
      return null; //Indicador no encontrado
    }
}
revisarUnidadMedidaIndicador=function(indicador){
    const filaIndicador = posiblesIndicadores.find(line => (line[0]+': '+line[1]) === indicador);
    if(filaIndicador){
      //console.log(filaIndicador)
      return filaIndicador[7]; // unidad de medida
    }else{
      return null; //Indicador no encontrado
    }
}
revisarEscalamientoIndicador=function(indicador){
    const filaIndicador = posiblesIndicadores.find(line => (line[1]) === indicador);
    if(filaIndicador){
      //console.log(filaIndicador)
      return filaIndicador[3]; // en_razon
    }else{
      return null; //Indicador no encontrado
    }
}
revisarInterpretacionIndicador=function(indicador){
    const filaIndicador = posiblesIndicadores.find(line => (line[1]) === indicador);
    if(filaIndicador){
      //console.log(filaIndicador)
      return filaIndicador[4]; // temporalidad
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
      base=indicadoresTrimestrales;
      break;
    case "Anual":
      base=indicadoresAnuales;
      break;
    case "Bianual":
      base=indicadoresBianuales;
      break;
    case "Trianual":
      base=indicadoresTrianuales; 
      break;
    case "Quinquenal":
      base=indicadoresQuinquenales;
      break;
  }
  //console.log(base)
  //base contiene la informacion de todos los indicadores.
  //console.log(base)
  base_filtrada=base.filter(line=>{return((line[0]+': '+line[2])==indicador || line[0]==='Tema')})
  //console.log(base)
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
    console.log(indicadorSeleccionado)
    let temp_seNecesitaEscalar=revisarEscalamientoIndicador(indicadorSeleccionado.split(":")[1].slice(1))
    //console.log(temp_seNecesitaEscalar)
    document.getElementById("anio_mes").style.display = "block";
    if(temp_seNecesitaEscalar!='No'){
      document.getElementById("aviso_escalamiento").innerHTML = `Datos escalados en razón de la población (por cada ${temp_seNecesitaEscalar.split("_")[1]} habitantes)`
      document.getElementById("aviso_escalamiento").style.display = "block";
    }
  } else {
    document.getElementById("anio_mes").style.display = "none";
    document.getElementById("aviso_escalamiento").style.display = "none";
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
    "rgba(75, 192, 192, 0.7)" // or whatever default color you want
  );
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf(newValue)] =
    "rgb(75, 102, 192)";
  chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf('Hidalgo')] =
    "rgba(75, 102, 192,1)";
    
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
    map.closePopup();
    // 'this' será el elemento 'anio_mes' al ser llamado como handler de evento.
    const columna_seleccionada = this.value;

    // Get original states and data from datosIndicadorTema
    let OriginalEstados = datosIndicadorTema[0].map((_, colIndex) => 
      datosIndicadorTema.map(row => row[colIndex]))[1]
      .map((x) => x.replace(/^"|"|\r$/g, ""));

    var datosEstados = datosIndicadorTema[0].map((_, colIndex) => 
      datosIndicadorTema.map(row => row[colIndex].replace(/^"|"|\r/g, "")))[columna_seleccionada];

    //Combindados
    const seNecesitaEscalar=revisarEscalamientoIndicador(datosIndicadorTema[0][2])
    document.getElementsByClassName('tooltiptext_tablero_indicadores')[0].innerHTML=
      seNecesitaEscalar=='No' ?'El orden en que se muestran los estados, así como sus colores, corresponden al valor del indicador':
      'El orden en que se muestran los estados y los colores representan una interpretación relativa (a la población) del desempeño';
    const seNecesitaInvertir=revisarInterpretacionIndicador(datosIndicadorTema[0][2])
    //console.log(seNecesitaEscalar)
    //console.log(datosEstados)
    const combined_Estados = datosEstados
      .map((dato_est, index) => {
        const estado = OriginalEstados[index];
        const valorNumerico = dato_est == "NA" ? null : parseFloat(dato_est.replace(/,$/g, ""));
        const poblacion = mexico.features[index]?.properties?.['2020_Total'];
        const transformed = valorNumerico == null || valorNumerico === "NA" || !poblacion
          ? null
          : (seNecesitaEscalar == 'No'
            ? valorNumerico
            : (parseFloat(seNecesitaEscalar.split('_')[1]) * valorNumerico) / poblacion);

        return {
          dato: estado,
          value: valorNumerico,
          transformed,
        };
      })
      .filter((item) => item && item.dato !== undefined);

    const combined_Estados_ordenados = [...combined_Estados];
    combined_Estados_ordenados.sort((a, b) => {
      const aValor = a?.transformed ?? Number.NEGATIVE_INFINITY;
      const bValor = b?.transformed ?? Number.NEGATIVE_INFINITY;
      return bValor - aValor;
    });

    SortedEstados = combined_Estados_ordenados.map((item) => item.dato.toString());

    // Calculate rankings with ties
    let currentRank = 1;
    let previousValue = null;
    const valueToRank = new Map();

    combined_Estados_ordenados.forEach((item, index) => {
      if (item.transformed === null) {
        valueToRank.set(item.dato, "NA");
      } else if (item.transformed !== previousValue) {
        currentRank = index + 1;
        valueToRank.set(item.dato, currentRank);
        previousValue = item.transformed;
      } else {
        valueToRank.set(item.dato, currentRank);
      }
    });

    indexedEstados = OriginalEstados.map(item => 
      valueToRank.get(item)
    );

    mexico.features.forEach((feature) => {
      const index_en_original = OriginalEstados.indexOf(feature.properties.NOMGEO);
      const estadoInfo = combined_Estados[index_en_original];
      //console.log(feature.properties.NOMGEO)
      //console.log(index_en_original)
      feature.properties.Valor = datosEstados[index_en_original];
      feature.properties.Valor_Transf = estadoInfo?.transformed ?? null;

      const rank = valueToRank.get(feature.properties.NOMGEO);
      feature.properties.Ranking = 
        rank === "NA" 
          ? "NA" 
          : (seNecesitaInvertir == 'Menos es mejor' 
            ? rank.toString().padStart(2, "0") 
            : (33 - rank).toString().padStart(2, "0"));
      feature.properties.Sentido = seNecesitaInvertir == 'Menos es mejor' ? 'Menos es mejor' : 'Más es mejor';
      feature.properties.Superficie_km2 = seNecesitaEscalar == 'No' ? 0 : parseInt(seNecesitaEscalar.split("_")[1]);
    });

    datosEstados = combined_Estados_ordenados.map((item) => item.transformed);

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
                    backgroundColor:SortedEstados.map(()=>"rgba(75, 192, 192, 0.7)"),
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
    chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] = "rgba(75, 192, 192, 0.7)"; 
    
    updateJsonData();
    $("#indicador option[value='default']").remove();
}