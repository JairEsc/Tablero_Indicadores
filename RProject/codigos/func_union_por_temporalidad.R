#unir por temporalidad 

unir_p_temp=function(temp){
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
  
  union=do.call(plyr::rbind.fill,lista_archivos)
  union=union |> 
    dplyr::rename(Tema=tema,Indicador=indicador,Entidad=entidad,link.de.consulta=liga.de.consulta) |> 
    dplyr::relocate(c(Tema,Entidad,Indicador,link.de.consulta),.before = Tema)
  return(union)
}
temp='trimestral'
trimestral=unir_p_temp(temp)
trimestral$Entidad[trimestral$Entidad=='Veracruz']='Veracruz de Ignacio de la Llave'
trimestral$Entidad[trimestral$Entidad=='Veracruz de la Llave']='Veracruz de Ignacio de la Llave'
trimestral$Entidad[trimestral$Entidad=='Veracruz de Ignacipo de la Llave']='Veracruz de Ignacio de la Llave'
trimestral$Entidad[trimestral$Entidad=='Coahuila']='Coahuila de Zaragoza'
trimestral$Entidad[trimestral$Entidad=='Michoacán']='Michoacán de Ocampo'
trimestral$Entidad[trimestral$Entidad=='Yucatan']='Yucatán'
trimestral$Entidad[trimestral$Entidad=='Qurétaro']='Querétaro'
zzz=(trimestral |> colnames())[5:12] |> 
  sapply(\(z){
    zz=strsplit(z,"\\.")

    return(zz)
  },simplify = T,USE.NAMES = F) |> 
  lapply(\(t){
    paste0(t[[2]],"_",t[[1]])
  }) |> unlist()
colnames(trimestral)[5:12]=zzz

trimestral |> write.csv("../Datos/Trimestral.csv",fileEncoding = "utf-8",row.names = F)

