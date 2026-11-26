//Reestructuración.
let bienvenida_tab = true;
let posiblesIndicadores=[];//Variable global para guardar los indicadores.
let indicadoresMensuales=[];//Variable global para guardar los indicadores.
let indicadoresTrimestrales=[];//Variable global para guardar los indicadores.
let indicadoresBianuales=[];//Variable global para guardar los indicadores.
let indicadoresTrianuales=[];//Variable global para guardar los indicadores.
let indicadoresQuinquenales=[];//Variable global para guardar los indicadores.
let indicadoresAnuales=[];//Variable global para guardar los indicadores.
let indicadorSeleccionado=null;//Indicador mostrado en el tablero, con formato "Tema: Indicador".


//Pasos. 
//1. Consumir el archivo de temporalidad.csv para alimentar los indicadores generales
const PromesaLeerPosiblesIndicadores=new Promise((res,rej)=>{
    fetch("./datos/temporalidad.csv").then(response=>response.text()).then(csvData=>{
        const results=Papa.parse(csvData,{
            header:false,
            skipEmptyLines:true
        })
        posiblesIndicadores = results.data.slice(1); 
        window.posiblesIndicadores = posiblesIndicadores;
        console.log(posiblesIndicadores);
        console.log("Datos actualizados el 22/05/2026")
        actualizarConteoTemas();
        rellenarIndicadores();
    }).catch(error => {
        console.error("Error fetching CSV:", error);
    });
})
const PromesaLeerMensuales = new Promise((res, rej) => {
    fetch("./datos/mensual.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});

const PromesaLeerTrimestrales = new Promise((res, rej) => {
    fetch("./datos/trimestral.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});

const PromesaLeerBianuales = new Promise((res, rej) => {
    fetch("./datos/bianual.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});

const PromesaLeerTrianuales = new Promise((res, rej) => {
    fetch("./datos/trianual.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});

const PromesaLeerQuinquenales = new Promise((res, rej) => {
    fetch("./datos/quinquenal.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});
const PromesaLeerAnuales = new Promise((res, rej) => {
    fetch("./datos/anual.csv")
        .then(response => response.text())
        .then(csvData => {
            const results = Papa.parse(csvData, {
                header: false,
                skipEmptyLines: true
            });
            res(results.data);
        });
});

PromesaLeerMensuales.then(datos => {
    indicadoresMensuales = datos;
    //console.log(datos);
});

PromesaLeerTrimestrales.then(datos => {
    indicadoresTrimestrales = datos;
    //console.log(datos);
});

PromesaLeerBianuales.then(datos => {
    indicadoresBianuales = datos;
    //console.log(datos);
});

PromesaLeerTrianuales.then(datos => {
    indicadoresTrianuales = datos;
    //console.log(datos);
});

PromesaLeerQuinquenales.then(datos => {
    indicadoresQuinquenales = datos;
    //console.log(datos);
});
PromesaLeerAnuales.then(datos => {
    indicadoresAnuales = datos;
    //console.log(datos);
});

//Filtros del listado: al marcar/desmarcar un tema o escribir en el buscador se vuelve a armar la lista.
$("#temas_tablero_indicadores input[type='checkbox']").change(function () {
  //El tema marcado se resalta con un borde en su tarjeta (no se muestra la casilla).
  $(this).closest(".tema-card").toggleClass("tema-card--activa", this.checked);
  rellenarIndicadores();
});
$("#buscador_indicadores").on("input", function () {
  rellenarIndicadores();
});
//Al dar clic en un indicador del listado se carga en el tablero.
$("#lista_indicadores").on("click", ".indicador-item", function () {
  seleccionarIndicador(this.dataset.valor);
});

function seleccionarIndicador(indicador) {
  indicadorSeleccionado = indicador;
  //Resaltar en el listado el indicador elegido.
  $("#lista_indicadores .indicador-item").each(function () {
    const activo = this.dataset.valor === indicador;
    $(this).toggleClass("indicador-item--activo", activo).attr("aria-current", activo ? "true" : null);
  });
  map.closePopup();
  //console.log(revisarTemporalidadIndicador(indicador))
  tiempo_del_indic_sel=revisarTemporalidadIndicador(indicador)
  descripcion_del_indic_sel=revisarDescripcionIndicador(indicador)
  unidadMedida_del_indic_sel=revisarUnidadMedidaIndicador(indicador)
  datosIndicadorTema=generarDatos_DadoIndicadorTema(tema='Todo',indicador)
  //DatosIndicadorTema tiene header + datos nacionales del indicador.
  //console.log(datosIndicadorTema)
  //Ocultar imagen de bienvenida.
  if (bienvenida_tab) {
    document.getElementsByClassName(
      "bienvenida_tab_tablero_indicadores"
    )[0].className = "tabcontent_hist_tablero_indicadores";
    bienvenida_tab = false;
    if (window.actualizarEstadoTour) {
      window.actualizarEstadoTour();
    }
  }
  //Mostrar la seccion del tablero.
  document.getElementById("section_tablero_indicadores").style.visibility =
    "visible";
  document.getElementById("defaultOpen").click(); //simulamos que estamos en la historica para que se creen ambas
  //cuando cambia el valor del indicador:
  //Actualizar la descripción del indicador
  document.getElementById("descripcion_indicador").innerHTML = descripcion_del_indic_sel || '';
  document.getElementById("descripcion_indicador").innerHTML += (unidadMedida_del_indic_sel && unidadMedida_del_indic_sel.trim() !== '') ? `<br><b>Unidad de Medida oficial:</b> ${unidadMedida_del_indic_sel}` : '';
  document.getElementById("fuente").innerHTML = "Fuente: " + (datosIndicadorTema[1][3]?.length > 50 ? 
    `<a href="${datosIndicadorTema[1][3]}" target="_blank">${datosIndicadorTema[1][3].substring(0,50)}...</a>` : 
    datosIndicadorTema[1][3] || '');
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).style.visibility = "visible";
  document.getElementById(
    "descripcion_indicador_title_tablero_indicadores"
  ).innerHTML='<p style="all:unset">'+indicador+'</p>';//Agregamos el nombre del indicador a la descripción.
  ///////////////////////
  /// Cambios de Lalo ///
  ///////////////////////
  Header=datosIndicadorTema[0]//Header de la base filtrada.
  datosIndicadorTema=datosIndicadorTema.slice(1)
  //Encontrar los datos no nulos (intervalo)
  intervalosDatos=encontrarIntervaloDatos(datosIndicadorTema)
  //console.log(intervalosDatos)
  let primera_columna=intervalosDatos.primera_columna
  let ultima_columna=intervalosDatos.ultima_columna
  //console.log("Primera columna válida:", primera_columna, "Última columna válida:", ultima_columna);
  //console.log("Encabezado first:", Header[primera_columna], "Encabezado last:", Header[ultima_columna]);
  
  //Rellenar select de años/meses en el mapa
  const selectAnioMes = document.getElementById("anio_mes");
  selectAnioMes.removeEventListener("change", updateChartAndMap);
  selectAnioMes.innerHTML = "";
  for (let i = primera_columna; i <= ultima_columna; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = Header[i].replace(/^"|"|\r/g, "").split("_").reverse().map((parte, idx) => idx === 0 ? parte.padStart(2, "0") : parte).join("/");
    selectAnioMes.appendChild(option);
  }
  document.getElementById("anio_mes").value = ultima_columna; //Seleccionamos el último mes por default

  //Cuando cambia la seleccion del mes/año en el mapa:
  selectAnioMes.addEventListener("change", updateChartAndMap);
  document.getElementById("anio_mes").dispatchEvent(new Event("change"));//El año/mes default

  /////////////////////////////////////////////////////
    //INICIA EL CAMBIO by Enrique//
  ////////////////////////////////////////////////////
  const hidalgoData = datosIndicadorTema.find(line => line[1] === "Hidalgo");
  const timeData = hidalgoData.slice(primera_columna, ultima_columna + 1)
    .map((value, index) => ({
      x: index,
      y: parseFloat(value.replace(/^"|"|\r|,$/g, "")),
      label: Header[primera_columna + index]
    }))
    .filter(point => !isNaN(point.y));

  const x = timeData.map(p => p.x);
  const y = timeData.map(p => p.y);
  //console.log("regresion")
  //console.log(x, y);
  const lr = linearRegression(y, x);
  //console.log(lr);
  if (typeof chart !== "undefined") {
    chart.destroy();
  }

  // Create new chart
  const nextIndex = x[x.length-1]+(x[x.length-1]-x[x.length-2]);
  const nextValue = lr.slope * nextIndex + lr.intercept;
  timeData.push({
    x: nextIndex,
    y: null,
    label: 'Próximo periodo'
  });

  const xn = timeData.map(p => p.x);
  //console.log(xn)
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
  }
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeData.map(d => d.label),
      datasets: [
        {
          label: indicador,
          data: timeData.map(d => d.y),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.7)", 
          borderWidth: 3,
        },
        {
          label: "Tendencia (Regresión Lineal)",
          data: xn.map(i => lr.slope * i + lr.intercept),
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
          zoom: {
            wheel: {enabled: true},
            mode: 'x',
          }
        }
      }
    },
    plugins: [pendientePlugin]
  });

  // Reset zoom on double click
  document.getElementById('historico').addEventListener('dblclick', () => {
    chart.resetZoom();
  });

}

