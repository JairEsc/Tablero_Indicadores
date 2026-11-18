// Initialize Intro.js Tour on the default canvas
document.addEventListener('DOMContentLoaded', function() {
  // Create a tour instance
  const tour = introJs();
  
  // Configure the tour
  tour.setOptions({
    steps: [
      {
        element: document.querySelector('.tabcontent_hist_tablero_indicadores canvas#historico'),
        intro: 'Bienvenido al Tablero de Indicadores. Esta es la gráfica principal que muestra el histórico de datos para Hidalgo.',
        position: 'bottom',
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight'
      },
      {
        element: document.querySelector('#indicador_tablero_indicadoresSearch'),
        intro: 'Usa este campo para buscar y seleccionar un indicador diferente.',
        position: 'bottom'
      },
      {
        element: document.querySelector('#tema_tablero_indicadores'),
        intro: 'Filtra los indicadores por tema para facilitar tu búsqueda.',
        position: 'bottom'
      }
    ],
    showBullets: true,
    showProgress: true,
    showStepNumbers: true,
    exitOnEsc: true,
    exitOnOverlayClick: true,
    nextLabel: 'Siguiente',
    prevLabel: 'Anterior',
    skipLabel: '×',
    doneLabel: 'Entendido'
  });
  
  window.dashboardTour = tour;
});
