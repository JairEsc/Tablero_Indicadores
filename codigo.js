function openChart(evt, tagName) {
  //funcion para activar una de las gráficas según la elección.
  var i, tabcontent, tablinks;
  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent_tablero_indicadores");
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
function fetchData(data, valor) {
  //Dado un conjunto de datos y una elección de tema, rellena las posibles opciones del indicador.
  const select = document.getElementById("indicador_tablero_indicadores");
  $("#indicador_tablero_indicadores").empty();
  var uniqueIndicators = new Set();
  const option = document.createElement("option");
  option.value = "default";
  option.text = "Seleccione uno";
  select.appendChild(option);
  uniqueIndicators.add("Seleccione uno");
  data.slice(1).forEach((line, index) => {
    var indicadorValue = line[1].trim();
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
let Medio_Ambiente_Nac = [];
let Gobierno_Nac = [];
let Social_Nac = [];
let Economico_Nac = [];
let Seguridad_Nac = [];
let Genero_Nac = [];
let base;
let base_Nac;
document.addEventListener("DOMContentLoaded", function () {
  //Inicia el procesamiento una vez que está cargada la página.
  fetch("Datos/Hidalgo_historico.csv")
    .then((response) => response.text())
    .then((data) => {
      // Dividir las líneas del archivo CSV
      var lines = data.split("\n");
      lines.slice(1).forEach((line) => {
        let values = line.split(",");
        let tema = values[0].trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
        // Asignar la línea a su correspondiente objeto según el "Tema"
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
  fetch("Datos/Nacional.csv")
    .then((response) => response.text())
    .then((data) => {
      var lines = data.split("\n");
      Medio_Ambiente_Nac.push(lines[0].split(","));
      Gobierno_Nac.push(lines[0].split(","));
      Economico_Nac.push(lines[0].split(","));
      Social_Nac.push(lines[0].split(","));
      Seguridad_Nac.push(lines[0].split(","));
      Genero_Nac.push(lines[0].split(","));
      // Recorrer cada línea (ignorando la primera que contiene los encabezados)
      lines.slice(1).forEach((line) => {
        let tema = line.split(",")[0];
        let values = [];
        let current = "";
        let inQuotes = false;

        for (let char of line) {
          if (char === '"') {
            inQuotes = !inQuotes; // Cambia el estado si estás dentro de comillas
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim()); // Empuja el último valor
        //console.log(values)
        // Asignar la línea a su correspondiente objeto según el "Tema"
        switch (tema.replace(/^"|"$/g, "")) {
          case "Medio Ambiente":
            Medio_Ambiente_Nac.push(values);
            break;
          case "Gobierno":
            Gobierno_Nac.push(values);
            break;
          case "Social":
            Social_Nac.push(values);
            break;
          case "Económico":
            Economico_Nac.push(values);
            break;
          case "Seguridad":
            Seguridad_Nac.push(values);
            break;
          case "Género":
            Genero_Nac.push(values);
            break;
        }
      });
    });
});

$("#tema_tablero_indicadores").change(function () {
  //De manera dinámica, cada vez que se cambia el valor de "tema", hace lo siguiente:
  $("#option option[value='default']").remove();
  //Elegimos el tema:
  switch ($(this).val()) {
    case "Medio Ambiente":
      base = Medio_Ambiente;
      base_Nac = Medio_Ambiente_Nac;
      break;
    case "Gobierno":
      base = Gobierno;
      base_Nac = Gobierno_Nac;
      break;
    case "Social":
      base = Social;
      base_Nac = Social_Nac;
      break;
    case "Económico":
      base = Economico;
      base_Nac = Economico_Nac;
      break;
    case "Seguridad":
      base = Seguridad;
      base_Nac = Seguridad_Nac;
      break;
    case "Género":
      base = Genero;
      base_Nac = Genero_Nac;
      break;
  }

  // Ahora puedes usar el objeto base
  fetchData(base_Nac, $(this).val().toString()); //En principio debe ser equivalente usar historica o nacional para rellenar las opciones
});
let bienvenida_tab=true

$("#indicador_tablero_indicadores").change(function () {
  if(bienvenida_tab){
    document.getElementsByClassName("bienvenida_tab_tablero_indicadores")[0].className="tabcontent_hist_tablero_indicadores"
    bienvenida_tab=false
  }
  document.getElementById("section_tablero_indicadores").style.visibility = "visible";
  document.getElementById("defaultOpen").click(); //simulamos que estamos en la historica para que se creen ambas
  //cuando cambia el valor del indicador:

  function updateJsonData() {
    // Disparar un evento personalizado cuando se actualiza el JSON
    const event = new CustomEvent("jsonDataUpdated", {});
    window.dispatchEvent(event);
  }

  //después, hará lo siguiente:
  nac = [];
  //console.log($(this).val())
  base_Nac.map((line, index) => {
    //filtro al indicador nacional
    //Todavía hay bugs cuando los nombres en historico y Nacional no coinciden. E.g.
    // Aves (produccion toneladas) != Aves Produccion (toneladas)
    if (
      line[1].replace(/^"|"|'$/g, "").toString() ===
        $(this)
          .val()
          .normalize()
          .replace(/^"|"|'$/g, "") ||
      line[0].replace(/^"|"|'$/g, "") === "Tema"
    ) {
      nac.push(line);
    } //Parece que esta parte funciona bien si las cadenas son iguales
  });
  if (nac[1].slice(4).every((val) => val === "NA")) {
    document.getElementById("tab_map").style.visibility = "hidden";
    document.getElementById("info_hoverable").style.visibility = "hidden";
  } else {
    document.getElementById("tab_map").style.visibility = "visible";
    document.getElementById("info_hoverable").style.visibility = "visible";
  }
  
  document.getElementById("descripcion_indicador").innerHTML = nac[1][2];
  document.getElementById("descripcion_indicador_title_tablero_indicadores").style.visibility = "visible"





  //También temporalidad
  
  

  
  
  
  var OriginalEstados = nac[0].slice(4).map((x) => x.replace(/^"|"|\r$/g, "")); //sus nombres originales// Va a cambiar el slice con la definitiva, porque trae descripcion
  var datosEstados = nac[1].slice(4).map((x)=> parseFloat(x.replace(/^"|"|\r|,$/g, ""))); //datos originales
  ///Falta hacer algo con los NA. Después, podría
  const combined_Estados = datosEstados.map((dato_est, index) => ({
    //ordenados por valor de indicador
    dato: OriginalEstados[index], // Nombre estado
    value: dato_est == "NA" ? null : dato_est, // y su valor
  })); //orden segun su valor
  const combined_Estados_ordenados = [...combined_Estados];
  combined_Estados_ordenados.sort((a, b) => b.value - a.value);
  SortedEstados = combined_Estados_ordenados.map((item) =>
    item.dato.toString()
  );
  indexedEstados = OriginalEstados.map(
    (item) => SortedEstados.indexOf(item.toString()) + 1
  ); //indices de los estados según su posición respecto al indicador
  mexico.features.forEach((feature, index) => {
    //Actualiza el ranking de los estados
    //Vamos a hacer un default para cuando no haya datos.
    feature.properties.Valor =datosEstados[index]
    feature.properties.CVEGEO =
      combined_Estados_ordenados[
        SortedEstados.indexOf(feature.properties.NOMGEO)
      ].value === null
        ? "NA"
        : 33 - indexedEstados[index].toString().padStart(2, "0"); //CVEGEO es su posición a novel nacional
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
            nac[1][3].replace(/^"|"|\r|'$/g, ""),
          data: datosEstados,
          backgroundColor: nac[1].slice(3).fill("rgba(75, 192, 192, 0.2)"),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      onHover: function(event, elements) {
        if (elements.length) {
          resaltarPoligonoPorCVE(32-elements[0].index); // Muestra el objeto de la barra en la consola
        }
    },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] =
    "rgba(75, 192, 192, 1)"; //Ilumino a Hidalgo
  /*}*/
  updateJsonData();

  $("#indicador option[value='default']").remove();
  years = [];
  datos = [];
  base.forEach((line, index) => {
    if (
      line[1].trim().replace(/^"|"|'$/g, "") ==
      $(this)
        .val()
        .replace(/^"|"|'$/g, "")
    ) {
      console.log(line[4].length)
      if(line[4].length>1){
        document.getElementById("fuente").innerHTML = 
        line[4].trim().replace(/^"|"|'$/g, "").slice(0,6)==='Fuente'?
        line[4].trim().replace(/^"|"|'$/g, ""):
        'Fuente: '+line[4].trim().replace(/^"|"|'$/g, "")
      }
      years.push(line[2].trim().replace(/^"|"|'$/g, ""));
      datos.push(parseFloat(line[3].trim().replace(/^"|"|'$/g, "")));
    }
  });
  if (years.length <= 1) {
    document.getElementById("tab_map").click();
    document.getElementById("defaultOpen").style.visibility = "hidden";
  } else {
    document.getElementById("defaultOpen").click();
    document.getElementById("defaultOpen").style.visibility = "visible";
  }
  if(years.length<=1){
    console.log("No hay datos")
  }
  else{
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
