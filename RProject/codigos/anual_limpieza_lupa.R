anual = read.csv("Output/anual.csv")

temp = "anual"
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

# [1] "Accidentes de Transito"                                                        # Solo numerico                      
# [2] "Agropecuario"                                                                  # Comas por puntos y pasar a numerico              
# [3] "Barómetro de Informacion Presupuestal Estatal BIPE"                            # Comas por puntos y pasar a numerico
# [4] "Cifra Negra"                                                 
# [5] "Cobertura Media Superior"                                    
# [6] "Cobertura Preescolar"                                        
# [7] "Cobertura Primaria"                                          
# [8] "Cobertura Secundaria"                                        
# [9] "Delitos denunciados"                                         
# [10] "Deuda Publica como porcentaje del PIB"                       
# [11] "Eficiencia Terminal Primaria"                                
# [12] "Eficiencia Terminal Secundaria"                              
# [13] "Genero"                                                      
# [14] "Indice de Competitividad Estatal ICE"                        
# [15] "Indice de Paz"                                               
# [16] "Medio Ambiente"                                              
# [17] "Mortalidad Defunciones registradas en Accidentes de Transito"
# [18] "Mortalidad Defunciones Registradas"                          
# [19] "Patentes"                                                    
# [20] "Percepcion sobre Seguridad Publica Inseguro"                 
# [21] "Percepcion sobre Seguridad Publica Seguro"                   
# [22] "Percepcion sobre tema de Inseguridad"                        
# [23] "PIB Entidad Federativa"                                      
# [24] "Tasa de Abandono Escolar Media Superior"                     
# [25] "Tasa de Abandono Escolar Primaria"                           
# [26] "Tasa de Abandono Escolar Superior"                           
# [27] "Tasa de Homicidios"                                          
# [28] "Tasa de Incidencia Delictiva (100 mil hab)"                  
# [29] "Tasa de Prevalencia Delictiva"                               
# [30] "Transporte"                                                  
# [31] "Turismo Oferta Alojamiento"                                  
# [32] "Turismo Porcentaje de Ocupación"                             
# [33] "Turismo"                               


##################
### Del 1 al 5 ###
##################

lista_archivos[["Accidentes de Transito"]] = lista_archivos[["Accidentes de Transito"]] |> 
  dplyr::mutate(
    dplyr::across(.cols = `2022`:`2024`,
                  .fns = ~.x |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric() )
  )



lista_archivos[["Agropecuario"]] = lista_archivos[["Agropecuario"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`,
  ) |> 
  dplyr::select(tema:liga.de.consulta)



lista_archivos[["Barómetro de Informacion Presupuestal Estatal BIPE" ]] = lista_archivos[["Barómetro de Informacion Presupuestal Estatal BIPE" ]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`
  )


lista_archivos[["Cifra Negra"]] = lista_archivos[["Cifra Negra"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )
  

lista_archivos[["Cobertura Media Superior"]] = lista_archivos[["Cobertura Media Superior"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2023.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )

##################
### Del 6 al 10 ###
##################

# [6] "Cobertura Preescolar"                                        
# [7] "Cobertura Primaria"                                          
# [8] "Cobertura Secundaria"                                        
# [9] "Delitos denunciados"                                         
# [10] "Deuda Publica como porcentaje del PIB" 

lista_archivos[["Cobertura Preescolar"]] = lista_archivos[["Cobertura Preescolar"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2023.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Cobertura Primaria"]] = lista_archivos[["Cobertura Primaria"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2023.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Cobertura Secundaria"]] = lista_archivos[["Cobertura Secundaria"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2023.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Delitos denunciados"]] = lista_archivos[["Delitos denunciados"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Deuda Publica como porcentaje del PIB"]] = lista_archivos[["Deuda Publica como porcentaje del PIB"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2017.0`:`2019.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2017" = `2017.0`,
    "2018" = `2018.0`,
    "2019" = `2019.0`
  )


####################
### Del 11 al 15 ###
####################

# [11] "Eficiencia Terminal Primaria"                                
# [12] "Eficiencia Terminal Secundaria"                              
# [13] "Genero"                                                      
# [14] "Indice de Competitividad Estatal ICE"                        
# [15] "Indice de Paz"   

lista_archivos[["Eficiencia Terminal Primaria"]] = lista_archivos[["Eficiencia Terminal Primaria"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`
  )



lista_archivos[["Eficiencia Terminal Secundaria"]] = lista_archivos[["Eficiencia Terminal Secundaria"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`
  )



lista_archivos[["Genero"]] = lista_archivos[["Genero"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022`:`2025`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) 



lista_archivos[["Indice de Competitividad Estatal ICE"]] = lista_archivos[["Indice de Competitividad Estatal ICE"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



lista_archivos[["Indice de Paz"]] = lista_archivos[["Indice de Paz"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



####################
### Del 16 al 20 ###
####################

# [16] "Medio Ambiente"                                              
# [17] "Mortalidad Defunciones registradas en Accidentes de Transito"
# [18] "Mortalidad Defunciones Registradas"                          
# [19] "Patentes"                                                    
# [20] "Percepcion sobre Seguridad Publica Inseguro"  


lista_archivos[["Medio Ambiente"]] = lista_archivos[["Medio Ambiente"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



lista_archivos[["Mortalidad Defunciones registradas en Accidentes de Transito"]] = lista_archivos[["Mortalidad Defunciones registradas en Accidentes de Transito"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022`:`2025`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) 



lista_archivos[["Mortalidad Defunciones Registradas"]] = lista_archivos[["Mortalidad Defunciones Registradas"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )


lista_archivos[["Patentes"]] = lista_archivos[["Patentes"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2020.0`:`2025_2ot*`,
      .fns = ~ .x |>  gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2020" = `2020.0`,
    "2021" = `2021.0`,
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025_2ot*`
  ) |> 
  dplyr::filter(tema != "Fuente: Instituto Mexicano de la Propiedad Industrial IMPI. En cifras general, 1993 al 2T 2025.")



lista_archivos[["Percepcion sobre Seguridad Publica Inseguro"]] = lista_archivos[["Percepcion sobre Seguridad Publica Inseguro"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )




####################
### Del 21 al 25 ###
####################

# [21] "Percepcion sobre Seguridad Publica Seguro"                   
# [22] "Percepcion sobre tema de Inseguridad"                        
# [23] "PIB Entidad Federativa"                                      
# [24] "Tasa de Abandono Escolar Media Superior"                     
# [25] "Tasa de Abandono Escolar Primaria"  


lista_archivos[["Percepcion sobre Seguridad Publica Seguro"]] = lista_archivos[["Percepcion sobre Seguridad Publica Seguro"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



lista_archivos[["Percepcion sobre tema de Inseguridad"]] = lista_archivos[["Percepcion sobre tema de Inseguridad"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )




lista_archivos[["PIB Entidad Federativa"]] = lista_archivos[["PIB Entidad Federativa"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`
  )



lista_archivos[["Tasa de Abandono Escolar Media Superior"]] = lista_archivos[["Tasa de Abandono Escolar Media Superior"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Tasa de Abandono Escolar Primaria"]] = lista_archivos[["Tasa de Abandono Escolar Primaria"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



####################
### Del 26 al 30 ###
####################

# [26] "Tasa de Abandono Escolar Superior"                           
# [27] "Tasa de Homicidios"                                          
# [28] "Tasa de Incidencia Delictiva (100 mil hab)"                  
# [29] "Tasa de Prevalencia Delictiva"                               
# [30] "Transporte" 


lista_archivos[["Tasa de Abandono Escolar Superior"]] = lista_archivos[["Tasa de Abandono Escolar Superior"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2024.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`
  )



lista_archivos[["Tasa de Homicidios"]] = lista_archivos[["Tasa de Homicidios"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022`:`2025`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) 



lista_archivos[["Tasa de Incidencia Delictiva (100 mil hab)" ]]  = lista_archivos[["Tasa de Incidencia Delictiva (100 mil hab)" ]]  |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )


lista_archivos[["Tasa de Prevalencia Delictiva" ]]  = lista_archivos[["Tasa de Prevalencia Delictiva"]]  |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



lista_archivos[["Transporte"]] = lista_archivos[["Transporte"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )



####################
### Del 31 al 33 ###
####################

# [31] "Turismo Oferta Alojamiento"                                  
# [32] "Turismo Porcentaje de Ocupación"                             
# [33] "Turismo" 

lista_archivos[["Turismo Oferta Alojamiento"]] = lista_archivos[["Turismo Oferta Alojamiento"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2020.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2020" = `2020.0`,
    "2021" = `2021.0`,
    "2022" = `2022.0`,
    "2023" = `2023.0`,
  )



lista_archivos[["Turismo Porcentaje de Ocupación"]] = lista_archivos[["Turismo Porcentaje de Ocupación"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2020.0`:`2023.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2020" = `2020.0`,
    "2021" = `2021.0`,
    "2022" = `2022.0`,
    "2023" = `2023.0`,
  )



lista_archivos[["Turismo"]] = lista_archivos[["Turismo"]] |> 
  dplyr::mutate(
    dplyr::across(
      .cols = `2022.0`:`2025.0`,
      .fns = ~ .x |> gsub(pattern = ",", replacement = ".") |> gsub(pattern = "  ", replacement = " ") |>  gsub(pattern = " ", replacement = "") |>  stringr::str_squish() |>  as.numeric()
    )
  ) |> 
  dplyr::rename(
    "2022" = `2022.0`,
    "2023" = `2023.0`,
    "2024" = `2024.0`,
    "2025" = `2025.0`
  )
  

lista_archivos |>  lapply(function(x) class(x$`2025`))

union= dplyr::bind_rows(lista_archivos)

union = union |> 
  dplyr::select(tema, entidad.federativa, indicador, link.de.consulta,`2017`, `2018`, `2019`, `2020`, `2021`, `2022`,  `2023`, `2024`, `2025`, liga.de.consulta, entidad, link)

union = union |> 
  dplyr::mutate(entidad.federativa = dplyr::if_else(condition = is.na(entidad.federativa), true = entidad, false = entidad.federativa)) |> 
  dplyr::select(-entidad) 

union = union |> 
  dplyr::mutate(link.de.consulta = dplyr::if_else(condition = is.na(link.de.consulta), true = liga.de.consulta, false = link.de.consulta),
                link.de.consulta = dplyr::if_else(condition = is.na(liga.de.consulta), true = link, false = link.de.consulta)) |> 
  dplyr::select(-liga.de.consulta, -link)

union = union |> 
  dplyr::rename(Tema = tema,
                Entidad = entidad.federativa,
                Indicador = indicador)

union = union |> 
  dplyr::mutate(Entidad = dplyr::case_when(
    Entidad == "Veracruz de Llave" ~ "Veracruz de Ignacio de la Llave",
    Entidad == "Estado de México" ~ "México",
    T ~ Entidad
  ))

union$Entidad |>  unique()

union = union |> 
  dplyr::mutate(Tema = dplyr::if_else(condition = Tema == "Economico", true = "Económico", false = Tema),
                Entidad = Entidad |> stringr::str_squish(),
                Indicador = Indicador |>  stringr::str_squish()
                )


anual_mayor1 = union |> 
  dplyr::mutate(no_na = rowSums(!is.na(dplyr::across(.cols = c(`2017`:`2025`)))))

anual_mayor1 = anual_mayor1 |> 
  dplyr::filter(no_na > 1) |> 
  dplyr::select(-no_na)

h = anual_mayor1 |>  dplyr::count(Entidad,sort = T)
ind = anual_mayor1 |>  dplyr::count(Indicador, sort = T)

ind |>  write.csv("Output/indicadores_falta_rellenar.csv", row.names = F, fileEncoding = "UTF-8")


union |> write.csv("../datos/anual.csv", row.names = F, fileEncoding = "UTF-8")


datos = lista_archivos[["Genero"]]
