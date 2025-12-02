###############
### Mensual ###
###############

temp = "mensual"
unir_mensual = function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      print("El archivo que se abrio fue:")
      print(z)
      print("Donde sus columnas son:")
      print(names(archivo_abierto))
      cat("\n")
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  cat("lista de archivos", "\n")
  print(names(lista_archivos))
  cat("\n")
  lista_archivos = lista_archivos |> 
    lapply(\(z) {
      colnames(z) = stringr::str_to_lower(colnames(z)) |>  gsub(pattern = "  ", replacement = " ") |> stringr::str_squish()
      print(names(z))
      z = dplyr::mutate(z, dplyr::across(everything(), as.character)) |> 
        dplyr::relocate(tema, entidad, indicador)
      names(z)[4:(which(names(z) == "link.de.consulta")-1)] = paste0("2015_", seq_along(names(z)[4:(which(names(z) == "link.de.consulta")-1)]))
      print(names(z))
      cat("\n")
      cat("\n")
      return(z)
    })
  
  
  union= dplyr::bind_rows(lista_archivos)
  union = union |> 
    dplyr::mutate(
      dplyr::across(
        .cols = `2015_1`:`2015_9`,
        .fns = ~ .x |>
          gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>
          stringr::str_squish() |> as.numeric()
      )
    ) |> 
    dplyr::select(-x14) |> 
    dplyr::mutate(entidad = entidad |>  gsub(pattern = "  ", replacement = " ") |> stringr::str_squish(),
                  entidad = dplyr::if_else(condition = entidad == "Veracruz de Ignacio de la llave", true = "Veracruz de Ignacio de la Llave", false = entidad)) |> 
    dplyr::rename(Tema = tema,
                  Entidad = entidad,
                  Indicador =indicador) |> 
    dplyr::relocate(link.de.consulta, .after = Indicador)
  
  
  print(union |>  head())
  
  return(union)
}

mensual = unir_mensual(temp)


mensual |>  write.csv("Output/Mensual.csv", row.names = F, fileEncoding = "UTF-8")

##################
### Trimestral ###
##################
unir_trimestral=function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto))){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z))
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  lista_archivos=lista_archivos |> lapply(\(z){colnames(z)=stringr::str_to_lower(colnames(z))
  return(z)})
  
  print(names(lista_archivos)) 
  union=do.call(plyr::rbind.fill,lista_archivos)
  union=union |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) |> 
    dplyr::mutate(Entidad = dplyr::case_when(
      Entidad == "Veracruz" ~ "Veracruz de Ignacio de la Llave",
      Entidad == "Veracruz de la Llave" ~ "Veracruz de Ignacio de la Llave",
      Entidad == "Veracruz de Ignacipo de la Llave" ~ "Veracruz de Ignacio de la Llave",
      Entidad == "Coahuila" ~ "Coahuila de Zaragoza",
      Entidad == "Michoacán" ~ "Michoacán de Ocampo",
      Entidad == "Yucatan" ~ "Yucatán",
      Entidad == "Qurétaro" ~ "Querétaro",
      TRUE ~ Entidad
    ))
  return(union)
}

temp = "trimestral"
trimestral = unir_trimestral(temp)

zzz=(trimestral |> colnames())[5:12] |> 
  sapply(\(z){
    zz=strsplit(z,"\\.")
    
    return(zz)
  },simplify = T,USE.NAMES = F) |> 
  lapply(\(t){
    paste0(t[[2]],"_",t[[1]])
  }) |> unlist()
colnames(trimestral)[5:12]=zzz


trimestral = trimestral |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2024_1t`:`2025_4t`,
      .fns = ~ .x |> gsub(pattern = "\\%", replacement = "") |>  gsub(pattern = "\\$", replacement = "") |> 
        gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>
        stringr::str_squish() |> as.numeric()
    )
  )


trimestral |>  write.csv("Output/Trimestral.csv", row.names = F, fileEncoding = "UTF-8")


#############
### Anual ###
#############

unir_p_temp=function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      print("El archivo que se abrio fue:")
      print(z)
      print("Donde sus columnas son:")
      print(names(archivo_abierto))
      cat("\n")
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  cat("lista de archivos", "\n")
  print(names(lista_archivos))
  cat("\n")
  lista_archivos = lista_archivos |> 
    lapply(\(z) {
      colnames(z) = stringr::str_to_lower(colnames(z)) |>  gsub(pattern = "  ", replacement = " ") |> stringr::str_squish()
      print(colnames(z))
      z = dplyr::mutate(z, dplyr::across(everything(), as.character))
      return(z)
    })
  union= dplyr::bind_rows(lista_archivos)
  print(union |>  names())
  
  union=union |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad.federativa) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) 
  return(union)
}

temp = "anual"

anual = unir_p_temp(temp)


anual = anual |> 
  dplyr::select(-x9, -x10, -x11) |> 
  dplyr::filter(Tema != "Fuente: Instituto Mexicano de la Propiedad Industrial IMPI. En cifras general, 1993 al 2T 2025.") |> 
  dplyr::mutate(Entidad = dplyr::if_else(condition = is.na(Entidad), true = entidad, false = Entidad),
                Tema = dplyr::if_else(condition = Tema == "Economico", true = "Económico", false = Tema)) |> 
  dplyr::select(-entidad)


anual = anual |> 
  dplyr::mutate(link.de.consulta = dplyr::if_else(condition = is.na(link.de.consulta), true = liga.de.consulta, false = link.de.consulta)) |> 
  dplyr::mutate(link.de.consulta = dplyr::if_else(condition = is.na(link.de.consulta), true = link, false = link.de.consulta)) |> 
  dplyr::select(-liga.de.consulta, -link)

anual = anual |> 
  dplyr::select(Tema:link.de.consulta, `2017.0`, `2018.0`, `2019.0`, `2020.0`, `2021.0`, `2022`, `2022.0`, `2023`, `2023.0`,
                `2024`, `2024.0`, `2025`, `2025.0`, `2025_2ot*`)


anual = anual |> 
  dplyr::mutate(`2022` = dplyr::if_else(condition = is.na(`2022`), true = `2022.0`, false = `2022`))|> 
  dplyr::select(-`2022.0`)

anual = anual |> 
  dplyr::mutate(`2023` = dplyr::if_else(condition = is.na(`2023`), true = `2023.0`, false = `2023`)) |> 
  dplyr::select(-`2023.0`)

anual = anual |> 
  dplyr::mutate(`2024` = dplyr::if_else(condition = is.na(`2024`), true = `2024.0`, false = `2024`)) |> 
  dplyr::select(-`2024.0`)


anual = anual |> 
  dplyr::mutate(`2025` = dplyr::if_else(condition = is.na(`2025`), true = `2025.0`, false = `2025`)) |> 
  dplyr::select(-`2025.0`) |> 
  dplyr::mutate(`2025` = dplyr::if_else(condition = is.na(`2025`), true = `2025_2ot*`, false = `2025`)) |> 
  dplyr::select(-`2025_2ot*`)


anual = anual |> 
  dplyr::rename("2017" = `2017.0`,
                "2018" = `2018.0`,
                "2019" = `2019.0`,
                "2020" = `2020.0`,
                "2021" = `2021.0`) |> 
  dplyr::mutate(`2017` = `2017` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2018` = `2018` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2019` = `2019` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2020` = `2020` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2021` = `2021` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2022` = `2022` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2023` = `2023` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2024` = `2024` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2025` = `2025` |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric())


anual_mayor1 = anual |> 
  dplyr::mutate(no_na = rowSums(!is.na(dplyr::across(.cols = c(`2017`:`2025`)))))

anual_mayor1 = anual_mayor1 |> 
  dplyr::filter(no_na > 1) |> 
  dplyr::select(-no_na)

h = anual_mayor1 |>  dplyr::count(Entidad,sort = T)
ind = anual_mayor1 |>  dplyr::count(Indicador, sort = T)


anual_mayor1 = anual_mayor1 |> 
  dplyr::filter(Indicador != "Capacidad instalada en las PTARs  (Litros por segundo)")

anual_mayor1 |> write.csv("Output/anual.csv", row.names = F, fileEncoding = "UTF-8")














###############
### Bianual ###
###############

unir_p_temp=function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      nf = nrow(archivo_abierto) 
      print(nf)
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto))){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  lista_archivos=lista_archivos |> lapply(\(z){colnames(z)=stringr::str_to_lower(colnames(z))
  return(z)})
  
  union= dplyr::bind_rows(lista_archivos)
  union=union |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) 
  return(union)
}

temp = "Bianual"

bianual = unir_p_temp(temp)
bianual = bianual |>  dplyr::mutate(
  Entidad = dplyr::if_else(condition = is.na(Entidad), true = entidad.federativa, false = Entidad)
)

bianual = bianual |> 
  dplyr::select(Tema:link.de.consulta, `2016.0`, `2018.0`, `2020.0`, `2021.0`, `2022.0`, `2023.0`, `2024.0`, `2025.0`) |> 
  dplyr::mutate(Entidad = Entidad |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())

names(bianual)[5:ncol(bianual)] = paste(as.integer(names(bianual)[5:ncol(bianual)]) |>  as.character()) 


bianual = bianual |> 
  dplyr::mutate(`2016` = `2016` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2018` = `2018` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2020` = `2020` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2021` = `2021` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2022` = `2022` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2023` = `2023` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2024` = `2024` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2025` = `2025` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric())

bianual |> write.csv("Output/bianual.csv",fileEncoding = "utf-8",row.names = F)















##################
### Quinquenal ###
##################

unir_p_temp=function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      nf = nrow(archivo_abierto) 
      print(nf)
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto))){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  lista_archivos = lista_archivos |> 
    lapply(\(z) {
      colnames(z) = stringr::str_to_lower(colnames(z))
      z = dplyr::mutate(z, dplyr::across(everything(), as.character))
      return(z)
    })
  
  union= dplyr::bind_rows(lista_archivos)
  union=union |> 
    dplyr::rename(entidad = entidad.federativa) |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) 
  return(union)
}




temp = "Quinquenal"
quinquenal = unir_p_temp(temp)
quinquenal = quinquenal |> 
  dplyr::mutate(
    link.de.consulta = dplyr::if_else(condition = is.na(link.de.consulta), true = x7, false = link.de.consulta)
  ) 
quinquenal = quinquenal |> 
  dplyr::select(-x7)

names(quinquenal)[5:ncol(quinquenal)] = paste(as.integer(names(quinquenal)[5:ncol(quinquenal)]) |>  as.character()) 

quinquenal = quinquenal |> 
  dplyr::mutate(Entidad = Entidad |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())


quinquenal = quinquenal |>  dplyr::mutate(
  Entidad = dplyr::case_when(
    Entidad == "Veracuz de Ignacio de la Llave" ~"Veracruz de Ignacio de la Llave",
    T ~ Entidad
  )
)
quinquenal$Entidad |>  unique()

quinquenal = quinquenal |> 
  dplyr::mutate(`2010` = `2010` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2015` = `2015` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2020` = `2020` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric())

quinquenal = quinquenal |> 
  dplyr::filter(!is.na(`2010`))

quinquenal|> write.csv("Output/quinquenal.csv",fileEncoding = "utf-8",row.names = F)


















#################
### Triaanual ###
#################

unir_p_temp=function(temp){
  list.files(paste0("Datos/",temp),full.names = T,pattern = ".xlsx$") |> 
    lapply(\(z){
      archivo_abierto=openxlsx::read.xlsx(z)
      nf = nrow(archivo_abierto) 
      print(nf)
      if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())){
        archivo_abierto=archivo_abierto|> dplyr::mutate(
          Indicador=gsub(paste0("Datos/",temp,"/"),"",gsub(".xlsx","",z) |> gsub(pattern = "  ", replacement = " ") |> stringr::str_squish())
        )
      }
      return(archivo_abierto)}
    )->lista_archivos
  names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/",temp),full.names = F,pattern = ".xlsx$"))
  lista_archivos = lista_archivos |> 
    lapply(\(z) {
      colnames(z) = stringr::str_to_lower(colnames(z)) |>  gsub(pattern = "  ", replacement = " ") |> stringr::str_squish()
      z = dplyr::mutate(z, dplyr::across(everything(), as.character))
      return(z)
    })
  
  union= dplyr::bind_rows(lista_archivos)
  union=union |> 
    dplyr::rename(liga.de.consulta = link) |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) 
  return(union)
}

temp = "trianuales"

trianual = unir_p_temp(temp)
trianual = trianual |> 
  dplyr::mutate(Indicador = dplyr::if_else(condition = is.na(Indicador), true = Tema, false = Indicador),
                Tema = dplyr::if_else(condition = Tema != "Social", true = "Social", false = Tema))


trianual = trianual |> 
  dplyr::mutate(`2019` = `2019` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric(),
                `2022` = `2022` |>  gsub(pattern = ",", replacement = "") |> gsub(pattern = "  ", replacement = " ") |>  stringr::str_squish() |>  as.numeric())

trianual|> write.csv("Output/trianual.csv",fileEncoding = "utf-8",row.names = F)






















####################
### Temporalidad ###
####################

temporalidad = readxl::read_excel("Output/indicadores_nacionales_razones_lalo_V2.xlsx")
temporalidad = temporalidad |>  dplyr::mutate(ID = paste0(Tema, "_",Indicador))


anual = read.csv("Output/anual.csv")


datos = temporalidad |> dplyr::select(Tema, Indicador) |>  dplyr::bind_rows(anual |>  dplyr::select(Tema, Indicador)) |> unique() |> 
  dplyr::mutate(ID = paste0(Tema, "_", Indicador)) |> 
  dplyr::left_join(y = temporalidad |>  dplyr::select(-Tema, -Indicador), by = c("ID" = "ID"))


datos = datos |> 
  dplyr::select(-...7)

openxlsx::write.xlsx(x = datos, file = "Output/indicadores_nacionales_razones_lalo_V4.xlsx",  rowNames = F)


descripciones = readxl::read_excel("Datos/Descipciones Indicadores Nacionales.xlsx")
descripciones = descripciones |> 
  dplyr::rename("Unidad de Medida Charly" = `Unidad de Medida`,
                "Periodicidad_Charly" = Periodicidad) |> 
  dplyr::mutate(Descripción = Descripción |>  gsub(pattern = "  ", replacement =  " ") |> stringr::str_squish(),
                Indicador = Indicador |>  gsub(pattern = "  ", replacement =  " ") |> stringr::str_squish())

datos = datos |>  
  dplyr::mutate(Indicador = Indicador |>  gsub(pattern = "  ", replacement =  " ") |> stringr::str_squish()) |> 
  dplyr::left_join(y = descripciones, by = c("Indicador" = "Indicador"))


datos = datos |> 
  dplyr::select(Tema, Indicador, Descripción, `Unidad de medida`, `En razón de algo`, Sentido, temporalidad, Fuente, `Unidad de Medida Charly`)

datos = datos |> 
  dplyr::arrange(Tema, Indicador)

datos = datos |> 
  dplyr::mutate(`Unidad de medida` = dplyr::if_else(condition = is.na(`Unidad de medida`), true = `Unidad de Medida Charly`, false = `Unidad de medida`))

datos$`Unidad de medida` |>  unique()

datos = datos |> 
  dplyr::mutate(`Unidad de medida` = dplyr::case_when(
    `Unidad de medida` == "Número de puestos de trabajajo" ~ "Número de puestos de trabajo",
    `Unidad de medida` == "Numero de personas" ~ "Número de personas",
    `Unidad de medida` == "porcentaje" ~ "Porcentaje",
    `Unidad de medida` == "número de plantas" ~ "Número de plantas",
    `Unidad de medida` == "millones de metros cúbicos" ~ "Millones de metros cúbicos",
    T ~ `Unidad de medida`,
  ))


openxlsx::write.xlsx(x = datos, file = "Output/indicadores_nacionales_razones_lalo_V4.xlsx",  rowNames = F)


