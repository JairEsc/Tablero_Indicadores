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

  window.dispatchEvent(new Event("resize"));
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
  data.slice(1).forEach((line, index) => {
    var indicadorValue = line[2].trim().replace(/^"|"$/g, "");
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
let base;
let Header;
Promise.all([
  fetch("Datos/layout_prueba.csv").then((response) => response.text()),
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
  }
  // Ahora puedes usar el objeto base
  fetchData(base, $(this).val().toString()); //
});

$("#indicador_tablero_indicadoresSearch").focus(function() {
        // reiniciamos el valor del input a vacío.
        $(this).val(' ');
});
$("#indicador_tablero_indicadoresSearch").change(function () {
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

  //después, hará lo siguiente:
  nac = [];
  //console.log($(this).val())
  base.map((line, index) => {//esta base es el filtro de la nacinal dado el tema elegido.
    //filtro al indicador nacional
    //Todavía hay bugs cuando los nombres en historico y Nacional no coinciden. E.g.
    // Aves (produccion toneladas) != Aves Produccion (toneladas)// Se preprocesaron para que no ocurra
    if (
      line[2].replace(/^"|"|'$/g, "").toString() ===
        $(this)
          .val()
          .normalize()
          .replace(/^"|"|'$/g, "") 
    ) {
      nac.push(line);//nac es el filtro de base_Nac dado el indicador elegido.
    } //Parece que esta parte funciona bien si las cadenas son iguales
  });
  console.log(nac);
  if (nac[1].slice(4).every((val) => val === "NA")) {//Todos los estados tienen NA.
    document.getElementById("tab_map").style.visibility = "hidden";
    document.getElementById("info_hoverable").style.visibility = "hidden";
  } else {
    document.getElementById("tab_map").style.visibility = "visible";
    document.getElementById("info_hoverable").style.visibility = "visible";
  }

  document.getElementById("descripcion_indicador").innerHTML = nac[1][2];
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).style.visibility = "visible";
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).innerHTML='Descripción del Indicador:  <p style="all:unset">'+$(this).val()+'</p>';//Agregamos el nombre del indicador a la descripción.

  //También temporalidad
  var OriginalEstados = nac[0].map((_, colIndex) => nac.map(row => row[colIndex]))[1].map((x) => x.replace(/^"|"|\r$/g, ""))//nac[0].slice(3).map((x) => x.replace(/^"|"|\r$/g, "")); //sus nombres originales
  //Para saber cuál es la pultima columna con datos no NA: 
  let lastCol;
  for (let i = 0; i < nac[0].length; i++) {
    const currentColumn = nac[0].map((_, colIndex) => nac.map(row => row[colIndex])).reverse()[i];
    //console.log(currentColumn)
    lastCol=i
    // Check if the current column is NOT entirely 'NA'
    if (!currentColumn.every(x => x === 'NA' || x==='NA\r')&& !currentColumn.every(x=>x==0 || x=='0\r')) {
      // If it's not all 'NA', we've found our column.
      // Since we're iterating from right to left (due to .reverse()),
      // this is the first non-completely-'NA' column we encounter.
      break; // Exit the loop early
    }
    //console.log(lastCol)
    // If it *is* entirely 'NA', decrement the resultIndex
    
  }
  // console.log("Mes seleccionado: ", nac[0].length-1-lastCol-1)
  // console.log(Header[nac[0].length-1-lastCol-1])
  var datosEstados = nac[0].map((_, colIndex) => nac.map(row => row[colIndex]))[nac[0].length-1-lastCol]//Tomamos el primero
    //.slice(3)
    .map((x) => parseFloat(x.replace(/^"|"|\r|,$/g, ""))); //datos originales
  ///Falta hacer algo con los NA. Después, podría
  // console.log(OriginalEstados);
  // console.log(datosEstados);
  const combined_Estados = datosEstados.map((dato_est, index) => ({
    //ordenados por valor de indicador
    dato: OriginalEstados[index], // Nombre estado
    value: dato_est == "NA" ? null : dato_est, // y su valor
  })); //orden segun su valor
  //
  const combined_Estados_ordenados = [...combined_Estados];
  combined_Estados_ordenados.sort((a, b) => b.value - a.value);
  
  SortedEstados = combined_Estados_ordenados.map((item) =>
    item.dato.toString()
  );
  indexedEstados = OriginalEstados.map(
    (item) => SortedEstados.indexOf(item.toString()) + 1
  ); //indices de los estados según su posición respecto al indicador
  //console.log(indexedEstados)
  mexico.features.forEach((feature, index) => {
    //Actualiza el ranking de los estados
    //Vamos a hacer un default para cuando no haya datos.
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
          label:
            $(this)
              .val()
              .replace(/^"|"|\r|'$/g, "") +
            " - " +
            nac[1][2].replace(/^"|"|\r|'$/g, ""),
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
          resaltarPoligonoPorCVE(32 - elements[0].index);
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
  years = Header.slice(4);
  datos = base[12].slice(4).map((x)=>parseFloat(x.replace(/^"|"|\r|,$/g, ""))); ////PENDIENTE. Decidir desde donde tomar los datos. Podrían ser vaciíos los primeros años

  if (years.length <= 1) {
    document.getElementById("tab_map").click();
    document.getElementById("defaultOpen").style.visibility = "hidden";
  } else {
    document.getElementById("defaultOpen").click();
    document.getElementById("defaultOpen").style.visibility = "visible";
  }
  if (years.length <= 1) {
    console.log("No hay datos");
  } else {
    const combined = years
      .map((year, index) => ({
        year: parseInt(JSON.parse(year), 10),
        value: datos[index],
      }))
      .sort((a, b) => a.year - b.year);
    const sortedYears = combined.map((item) => item.year.toString());
    const sortedDatos = combined.map((item) => item.value);
    //combined es un json, pero .year podria tener huecos.

    var x_original = combined.map((item) => item.year).sort();
    const lr = linearRegression(sortedDatos, x_original);
    const x_0 = lr["intercept"];
    const p = lr["slope"];
    x_original.push(x_original[x_original.length - 1] + 1);
    const x_completo = Array(
      x_original[x_original.length - 1] - x_original[0] + 1
    )
      .fill()
      .map((element, index) => index + x_original[0]);
    function completeYearRange(data) {
      const startYear = Math.min(...data.map((item) => item.year));
      const endYear = Math.max(...data.map((item) => item.year));

      const completeData = [];

      for (let year = startYear; year <= endYear; year++) {
        const foundItem = data.find((item) => item.year === year);

        if (foundItem) {
          completeData.push(foundItem);
        } else {
          completeData.push({ year: year, value: null });
        }
      }

      return completeData;
    }
    const x_sin_huecos = completeYearRange(combined);
    const sortedYears2 = x_sin_huecos.map((item) => item.year.toString());
    const sortedDatos2 = x_sin_huecos.map((item) => item.value);
    if (typeof chart != "undefined") {
      chart.destroy();
    }
    // Crear una nueva gráfica
    const ctx = document.getElementById("historico").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: x_completo,
        datasets: [
          {
            label: $(this).val(),
            data: sortedDatos2,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            labels: sortedYears2,
            spanGaps: true,
          },
          {
            label: "Regresión",
            data: x_completo.map(function (y) {
              return x_0 + y * p;
            }),
            labels: x_completo,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          chartArea: {
            backgroundColor: "rgba(240, 240, 240, 1)", // Cambia este color a lo que desees
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
      /*plugins: [{
                    id: 'custom_canvas_background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = '#d4c2a3'; // Cambia a tu color de fondo deseado
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    }
                }]*/
    });
  }
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

let bienvenida_tab = true;