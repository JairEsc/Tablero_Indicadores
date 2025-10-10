datos = read.csv("Datos/Municipal-Delitos-2015-2025_ago2025.csv", fileEncoding = "latin1")

ejemplo = read.csv("Datos/Semestral.csv")

datos = datos |> 
  dplyr::rename(Indicador = Tipo.de.delito)

datos = datos |> 
  dplyr::select(Año, Entidad, Indicador, Enero:Diciembre)

datos = datos |> 
  dplyr::mutate(
    S1 = rowSums(dplyr::select(.data = datos, Enero:Junio), na.rm = T),
    S2 = rowSums(dplyr::select(.data = datos, Julio:Diciembre), na.rm = T)
  ) |> 
  dplyr::select(Año, Entidad, Indicador, S1, S2) |> 
  dplyr::group_by(Año, Entidad, Indicador) |> 
  dplyr::summarise(S1 = sum(S1, na.rm = T), S2 = sum(S2, na.rm = T)) |> 
  dplyr::ungroup()


datos = datos |> 
  tidyr:: pivot_wider(
    names_from = Año,
    values_from = c(S1, S2),
    names_glue = "{Año}_{.value}"
  ) |> 
  dplyr::arrange(Indicador, Entidad)


columnas_orden = names(datos)
columnas_orden = columnas_orden[!columnas_orden %in% c("Entidad", "Indicador")]
columnas_orden = columnas_orden[order(stringr::word(columnas_orden, 1, sep = "_"), stringr::word(columnas_orden, 2, sep = "_"))]

datos = datos[, c("Entidad", "Indicador", columnas_orden)]

datos = datos |> 
  dplyr::mutate(Tema = "Seguridad",
                `link de consulta` = "Datos abiertos de incidencia delictiva. Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública") |> 
  dplyr::relocate(Tema ,.before = Entidad) |> 
  dplyr::relocate(`link de consulta`, .after = Indicador)


economia = ejemplo |> 
  dplyr::filter(Tema != "Seguridad")

names(economia) = names(datos)


datos = dplyr::bind_rows(datos, economia)

datos = datos |> 
  dplyr::arrange(Indicador, Entidad)


write.csv(datos, "../Datos/Semestral.csv", fileEncoding = "UTF-8", row.names = F)
