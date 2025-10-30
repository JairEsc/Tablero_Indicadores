"../Datos/Nacional.csv" |> read.csv()->nacional_antiguo
nacional_antiguo=nacional_antiguo |> dplyr::filter(Tema!='Seguridad') |> 
  dplyr::filter(Indicador!='Trabajadores Asegurados Permanentes por el IMSS')
nacional_antiguo=nacional_antiguo |> 
  dplyr::filter(!is.na(Hidalgo))
nacional_antiguo$Indicador[nacional_antiguo$Hidalgo |> is.na()]
nacional_antiguo=nacional_antiguo |> tidyr::pivot_longer(cols = Aguascalientes:Zacatecas,names_to = "Entidad")
nacional_antiguo$Entidad=gsub("\\."," ",nacional_antiguo$Entidad)
nacional_antiguo=nacional_antiguo |> 
  dplyr::select(Tema,Entidad,Indicador,Año,value)
nacional_antiguo$Año |> unique()
nacional_antiguo$Año[nacional_antiguo$Año=='2023-2024']="2023"
nacional_antiguo$Año[nacional_antiguo$Año=='19.49']="2020"
nacional_antiguo$Año=nacional_antiguo$Año |> as.numeric()

nacional_antiguo=nacional_antiguo |> tidyr::pivot_wider(names_from = Año,values_from = value)
nacional_antiguo=nacional_antiguo |> 
  dplyr::select(Tema,Entidad,Indicador,`2019`,`2020`,`2021`,`2022`,`2023`,`2024`)

nacional_antiguo=nacional_antiguo |> dplyr::mutate(link.de.consulta=NA) |> 
  dplyr::relocate(link.de.consulta,.after = Indicador)
nacional_antiguo=nacional_antiguo |> 
  dplyr::filter(Indicador!='Oferta de Alojamiento en la Entidad (cuartos)') |> 
  dplyr::filter(Indicador!='Llegada de Turistas Totales a la Entidad') |> 
  dplyr::filter(Indicador!='Llegada de Turistas a la Entidad por Tipo de Turismo (nacionales)') |> 
  dplyr::filter(Indicador!='Llegada de Turistas a la Entidad por Tipo de Turismo (extranjeros)')

nacional_antiguo[,5:10]=nacional_antiguo[,5:10] |>lapply(\(z){
  z=gsub("\\,","",z)
  z=as.numeric(z)
  return(z)
}) 
nacional_antiguo$Entidad |> unique()
nacional_antiguo$Entidad[nacional_antiguo$Entidad=='Veracruz']='Veracruz de Ignacio de la Llave'
nacional_antiguo$Entidad[nacional_antiguo$Entidad=='Coahuila']='Coahuila de Zaragoza'
nacional_antiguo$Entidad[nacional_antiguo$Entidad=='Michoacán']='Michoacán de Ocampo'
nacional_antiguo|> write.csv("../Datos/Anual.csv",row.names = F,fileEncoding = "UTF-8")
