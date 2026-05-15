//Reestructuración.
let bienvenida_tab = true;
let posiblesIndicadores=[];//Variable global para guardar los indicadores.
let indicadoresMensuales=[];//Variable global para guardar los indicadores.
let indicadoresTrimestrales=[];//Variable global para guardar los indicadores.
let indicadoresBianuales=[];//Variable global para guardar los indicadores.
let indicadoresTrianuales=[];//Variable global para guardar los indicadores.
let indicadoresQuinquenales=[];//Variable global para guardar los indicadores.
let indicadoresAnuales=[];//Variable global para guardar los indicadores.


//Pasos. 
//1. Consumir el archivo de temporalidad.csv para alimentar los indicadores generales
const PromesaLeerPosiblesIndicadores=new Promise((res,rej)=>{
    fetch("./datos/temporalidad.csv").then(response=>response.text()).then(csvData=>{
        const results=Papa.parse(csvData,{
            header:false,
            skipEmptyLines:true
        })
        posiblesIndicadores = results.data.slice(1); 
        console.log(posiblesIndicadores);
        console.log("Datos actualizados el 15/05/2026")
        rellenarIndicadores(posiblesIndicadores);
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

$("#tema_tablero_indicadores").change(function () {

  document.getElementById('indicador_tablero_indicadoresSearch').value=''
  //De manera dinámica, cada vez que se cambia el valor de "tema", hace lo siguiente:
  //$("#option option[value='default']").remove();
  //Elegimos el tema:
  //console.log($(this).val())
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
  map.closePopup();
  const temaSeleccionado = $("#tema_tablero_indicadores").val();
  const indicadorSeleccionado = $(this).val();
  //console.log($(this).val())
  //console.log(revisarTemporalidadIndicador($(this).val()))
  tiempo_del_indic_sel=revisarTemporalidadIndicador($(this).val())
  descripcion_del_indic_sel=revisarDescripcionIndicador($(this).val())
  unidadMedida_del_indic_sel=revisarUnidadMedidaIndicador($(this).val())
  datosIndicadorTema=generarDatos_DadoIndicadorTema(tema='Todo',$(this).val())
  //DatosIndicadorTema tiene header + datos nacionales del indicador.
  //console.log(datosIndicadorTema)
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
  ).innerHTML='<p style="all:unset">'+$(this).val()+'</p>';//Agregamos el nombre del indicador a la descripción.
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
          label: $(this).val(),
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

});

