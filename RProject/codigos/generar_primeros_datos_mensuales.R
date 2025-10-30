list.files(paste0("Datos/","mensual"),full.names = T,pattern = ".xlsx$") |> 
  lapply(\(z){
    archivo_abierto=openxlsx::read.xlsx(z)
    if(!"indicador" %in% stringr::str_to_lower(colnames(archivo_abierto))){
      archivo_abierto=archivo_abierto|> dplyr::mutate(
        Indicador=gsub(paste0("Datos/","mensual","/"),"",gsub(".xlsx","",z))
      )
    }
    return(archivo_abierto)}
  )->lista_archivos
names(lista_archivos)=gsub(".xlsx","",list.files(paste0("Datos/","mensual"),full.names = F,pattern = ".xlsx$"))
#lista_archivos=lista_archivos |> lapply(\(z){colnames(z)=stringr::str_to_lower(colnames(z))
#return(z)})
union=do.call(plyr::rbind.fill,lista_archivos)
union=union |> 
  dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema) |> 
  dplyr::select(-c(X1,X14))
colnames(union)[5:13]=paste0("2025_",1:9)

union$Entidad |> stringr::str_squish() |> unique() |> sort()
union$Entidad=union$Entidad |> stringr::str_squish()
union$Entidad[union$Entidad=='Coahuila']="Coahuila de Zaragoza"
union$Entidad[union$Entidad=='Estado de México']="México"
union$Entidad[union$Entidad=='Michoacan']="Michoacán de Ocampo"
union$Entidad[union$Entidad=='Michoacán']="Michoacán de Ocampo"
union$Entidad[union$Entidad=='Nuevo Leon']="Nuevo León"
union$Entidad[union$Entidad=='Queretaro']="Querétaro"
union$Entidad[union$Entidad=='San Luis Potosi']="San Luis Potosí"
union$Entidad[union$Entidad=='Veracruz']="Veracruz de Ignacio de la Llave"
union$Entidad[union$Entidad=='Veracruz de Ignacio de la llave']="Veracruz de Ignacio de la Llave"
union$Entidad[union$Entidad=='Yucatan']="Yucatán"
union[,5:13] = union[,5:13] |> lapply(\(z){return(as.numeric(z))})


union |> write.csv("../Datos/Mensual.csv",fileEncoding = "UTF-8",row.names = F)
