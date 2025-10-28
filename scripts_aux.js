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
