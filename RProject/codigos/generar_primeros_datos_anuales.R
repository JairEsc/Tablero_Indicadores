"Datos/anual/" |> list.files(full.names = T) |> 
  lapply(\(z){z |> openxlsx::read.xlsx(check.names = F)})->anual_lista
anual_union=do.call(plyr::rbind.fill,anual_lista)

anual_lista[[3]]->zz
anual_lista[[3]]=
  anual_lista[[3]] |> 
  dplyr::rename('2022'=`2022.0`,'2023'=`2023.0`,Tema=tema,
                                    Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
  dplyr::mutate(dplyr::across(.cols = `2022`:`2023`,.fns = as.numeric))



#1.- Tal cual
#2.- no incluir hasta que se limpie en drive
#3.- convertir a numerico y cambiar nombres
#4.- convertir a numerico y cambiar nombres
#5.- convertir a numerico y cambiar nombres
#...
#13.- null a NA y pasar a numeric
#13.- convertir a numerico y cambiar nombres
#15.- no incluir hasta que se limpie en drive
#16.- no incluir hasta que se limpie en drive
#17.- tal cual
#18.- tal cual. Solo renombrar
#19.- null a NA y pasar a numeric y renombrar
#20.- tal cual. Solo renombrar
#...- tal cual. Solo renombrar
#30.- null a NA y pasar a numeric
#...
anual_union=do.call(plyr::rbind.fill,anual_lista[c(1,3:14,17:33)])
anual_union_limpia=anual_union |> 
  dplyr::mutate(
    Indicador=ifelse(
    !is.na(indicador),indicador,Indicador
  ),
  Entidad=ifelse(
    !is.na(entidad),entidad,ifelse(!is.na(Entidad.Federativa),
                                   Entidad.Federativa,ifelse(!is.na(Entidad.federativa),
                                                             Entidad.federativa,Entidad))
  ),
  link.de.consulta=ifelse(!is.na(liga.de.consulta),liga.de.consulta,
                          ifelse(!is.na(Liga.de.consulta),Liga.de.consulta,link.de.consulta)),
  `2022`=ifelse(!is.na(`2022.0`),as.numeric(stringr::str_squish(`2022.0`)),`2022`),
  `2023`=ifelse(!is.na(`2023.0`),as.numeric(stringr::str_squish(`2023.0`)),`2023`),
  `2024`=ifelse(!is.na(`2024.0`),as.numeric(stringr::str_squish(`2024.0`)),`2024`),
  `2025`=ifelse(!is.na(`2025.0`),as.numeric(stringr::str_squish(`2025.0`)),`2025`),
  `2025`=ifelse(!is.na(`2025_2oT*`),as.numeric(stringr::str_squish(`2025_2oT*`)),`2025`),
  )
anual_union_limpia=anual_union_limpia |> 
  dplyr::select(Tema,Entidad,Indicador,link.de.consulta,`2017.0`,`2018.0`,`2019.0`,
                `2020.0`,`2021.0`,`2022`,`2023`,`2024`,`2025`) |> 
  dplyr::rename("2017"=`2017.0`,
                "2018"=`2018.0`,
                "2019"=`2019.0`,
                "2020"=`2020.0`,
                "2021"=`2021.0`)
anual_union_limpia$Indicador |> unique() |> sort()
anual_union_limpia$Entidad |> unique() |> sort()
anual_union_limpia$Entidad[anual_union_limpia$Entidad =="Estado de México"]='México'



anual_union_limpia|> write.csv("../datos/anual.csv",row.names = F,fileEncoding = "UTF-8")
