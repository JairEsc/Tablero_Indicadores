// Prueba simple de humo para el tablero.
// Sirve para recorrer varios indicadores y detectar errores de carga o de interacción.
// Uso: abre la app en el navegador, luego ejecuta esta función desde la consola:
// runIndicadorSmokeTest({ maxTests: 20 })

function esperar(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runIndicadorSmokeTest({ maxTests = 200, mostrarCadaPaso = false } = {}) {
  const selectIndicador = document.getElementById("indicador_tablero_indicadoresSearch");
  const selectAnioMes = document.getElementById("anio_mes");
  const selectTema = document.getElementById("tema_tablero_indicadores");

  if (!selectIndicador || !selectAnioMes) {
    console.error("No se encontraron los elementos del tablero. Abre la vista del tablero primero.");
    return;
  }

  // El selector solo contiene los indicadores del tema elegido; con "Todo" se pueden recorrer todos.
  if (selectTema && selectTema.value !== "Todo") {
    selectTema.value = "Todo";
    $(selectTema).trigger("change");
  }

  let indicadores = [];
  for (let intento = 0; intento < 10; intento += 1) {
    indicadores = (window.posiblesIndicadores || [])
      .filter((line) => Array.isArray(line) && line[0] && line[1])
      .map((line) => `${line[0]}: ${line[1]}`);

    if (indicadores.length === 0) {
      const opciones = Array.from(selectIndicador.options)
        .map((opt) => opt.value)
        .filter((valor) => valor && !valor.includes("Cargando"));
      indicadores = opciones;
    }

    if (indicadores.length > 0) {
      break;
    }

    await esperar(1000);
  }

  const total = Math.min(indicadores.length, maxTests);
  const errores = [];

  if (total === 0) {
    console.warn("No se encontraron indicadores todavía. Espera a que terminen de cargarse los CSV y vuelve a ejecutar la prueba.");
    return;
  }

  console.log(`Iniciando prueba con ${total} indicadores...`);

  for (let i = 0; i < total; i += 1) {
    const texto = indicadores[i];

    const manejarError = (event) => {
      const mensaje = event?.error?.message || event?.message || event?.reason || "Error desconocido";
      errores.push({ indicador: texto, error: mensaje });
      console.error(`✖ ${i + 1}/${total}: ${texto}`);
      console.error(mensaje);
      if (typeof event?.preventDefault === "function") {
        event.preventDefault();
      }
    };

    window.addEventListener("error", manejarError);
    window.addEventListener("unhandledrejection", manejarError);

    try {
      selectIndicador.value = texto;
      $(selectIndicador).trigger("change");
      await esperar(1000);

      if (selectAnioMes.options.length > 0) {
        for (let j = 0; j < selectAnioMes.options.length; j += 1) {
          selectAnioMes.value = selectAnioMes.options[j].value;
          $(selectAnioMes).trigger("change");
          await esperar(1000);
        }
      }

      if (mostrarCadaPaso) {
        console.log(`✔ ${i + 1}/${total}: ${texto}`);
      }
    } catch (error) {
      errores.push({ indicador: texto, error: error.message });
      console.error(`✖ ${i + 1}/${total}: ${texto}`);
      console.error(error);
    } finally {
      window.removeEventListener("error", manejarError);
      window.removeEventListener("unhandledrejection", manejarError);
    }
  }

  if (errores.length === 0) {
    console.log("Prueba completada sin errores.");
  } else {
    console.warn(`Prueba completada con ${errores.length} errores.`);
    console.table(errores.map((item) => ({ indicador: item.indicador, error: item.error })));
  }
}

window.runIndicadorSmokeTest = runIndicadorSmokeTest;
