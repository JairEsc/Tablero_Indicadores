Tablero de Indicadores 

### JS + Leaflet.js 

-176 indicadores nacionales
-600 registros de datos históricos para Hidalgo y las demás entidades federativas

Disponible en: http://sigeh.hidalgo.gob.mx/pags/tablero_indicadores/


## Nota
Para el mantenimiento de este tablero, se realiza la actualización de indicadores según su temporalidad descrita en Temporalidad.csv a nivel nacional (por entidad federativa)

Se realizó una selección de indicadores comparables entre entidades federativas. Para ellos, se considera una medida de relativización, por ejemplo, con respecto a la población. 
Un ejemplo trivial de estos indicadores comparables son los de Seguridad Pública (Incidencia delictiva). Se proponen la transformación "Tasa de incidencia por cada mil habitantes" para cada indicador de incidencia delictiva, de manera que para cada entidad federativa, se calcula esta transformación con la cual se construyen las gráficas de barras y el mapa tipo choropleth. Esta transformación se especifica en el popup de cada entidad, accesible al dar click sobre el mapa. La gráfica Histórica (Hidalgo) se construye con los valores originales, tal cual se reportan en la fuente citada.


### Sobre su actualización. 

Ejercicio de actualización. 
 1.- Visita el drive de tablero de indicadores, propiedad de Charly. Descarga todos los archivos en un comprimido (se exploró la posibilidad de generar un tocken de google para hacer la cnexión a drive desde Rstudio y descargar todos los archivos. Sí se pudo pero es mucha talacha)
 2.- Descomprimir y reemplazar archivos antiguos (en ruta: Rproject/Datos/). La estructura debe ser idéntica pero de eso se encarga Charly.
 3.-En el proyecto de R, usando el código "Mensual_Trimestral_Anual_Bianual_Quinquenal_General", se pueden unir las tablas por temporalidad y darles el formato.
 4.- Elegir la temporalidad a actualizar. E.g. Charly modifica la carpeta de trimestral, entonces utilizamos el bloque de código de trimestral. 
 4.1.- A grandes rasgos, se define una función que itera sobre los archivos en la carpeta "trimestral", une por renglones las tablas homologando los nombres de las columnas y las renombra en el formato "Año_trimestre". Luego escribe un archivo .csv ahora en la ruta "../datos/". Estos son los que consume Javascript.
 5.- Checa index.html en live server y verifica que los indicadores modificados se muestren correctamente.



