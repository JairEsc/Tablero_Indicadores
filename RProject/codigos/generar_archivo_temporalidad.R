#Generar Temporalidad a partir de .csv de indicadores

#Tema | Entidad | Indicador | link.de.consulta | Medidas ... |  <---- Formato Indicadores

# "Tema","Indicador","Temporalidad"  <---- Formato Temporalidad

temp_anual="../Datos/Anual.csv" |> read.csv(check.names = F,as.is = T)
temp_mensual="../Datos/Mensual.csv" |> read.csv(check.names = F,as.is = T)
temp_trimestral="../Datos/Trimestral.csv" |> read.csv(check.names = F,as.is = T)

temporalidad=rbind(trimestral |> 
        dplyr::select(Tema,Indicador) |> 
        dplyr::mutate(Temporalidad='Trimestral') |> 
        dplyr::group_by(Tema,Indicador) |> 
        dplyr::slice_head(n=1),temp_mensual |> 
        dplyr::select(Tema,Indicador) |> 
        dplyr::mutate(Temporalidad='Mensual') |> 
        dplyr::group_by(Tema,Indicador) |> 
        dplyr::slice_head(n=1))

temporalidad |> write.csv("../Datos/Temporalidad.csv",fileEncoding = "UTF-8",row.names = F)
