historico=read.csv("../Datos/Hidalgo_historico.csv")
nacional=readr::read_csv("../Datos/Nacional.csv",quote = '\"')
nacional=nacional |> 
  dplyr::select(Tema:Zacatecas)
nacional=nacional |> 
  dplyr::rowwise() |> 
  dplyr::filter(!dplyr::if_all(.cols = Aguascalientes:Zacatecas,.fns = is.na))


#rellenar con los datos que tenemos:

for(indicador_faltante in historico$Indicador[historico$Valor |> is.na()|> which()]){
  if(indicador_faltante%in%nacional$Indicador){
    print(paste0("Indicador: ",indicador_faltante))
    año=nacional$Año[which(indicador_faltante==nacional$Indicador)]
    print(paste0("Año: ",año))
    valor=nacional$Hidalgo[which(indicador_faltante==nacional$Indicador)]
    print(paste0("Valor: ",valor))
    
    if(historico$Año[historico$Indicador==indicador_faltante]==año){
      print("Año correcto")
      historico$Valor[historico$Indicador==indicador_faltante]=valor
    }else{
      print("Otro Año")
      historico[nrow(historico)+1,]=historico[indicador_faltante,]
      historico$Año[nrow(historico)+1]=año
      historico$Valor[nrow(historico)+1]=valor
    }
      
    
  }
}
##Si tuviéramos datos a nivel nacional, se podría alimentar la estatal
##Si tuvieramos datos a nivel estatal, no estaría en esta seleccion
 # (indicador_faltante in historico$Indicador[historico$Valor |> is.na()|> which()])

#Por lo tanto podemos eliminar los na.
historico=historico |> 
  dplyr::filter(!is.na(Valor))


nacional$Indicador[nacional$Indicador%in%historico$Indicador[historico$Valor |> is.na()|> which()]]



##

  ##Supongamos hist una coleccion de medidas por año
  ## Formato Header(Indicador,Año,Dato)
  
  #Suponemos nac coleccion de medidas por indicador
  # Formato Header(Indicador, Est1,Est2,...EstN)
  
  #Podemos asegurar que hay medidas históricas para cada indicador nacional
  print("Nacional contenido en histórico")
  print(nacional$Indicador |> sapply(\(ind) {
    ind%in%historico$Indicador
  }) |> unlist() |> all())
  print("histórico en nacional?")##No tiene nada de malo que no sea así
  
  print(historico$Indicador |> sapply(\(ind) {
    ind%in%nacional$Indicador
  }) |> unlist() |> all())
  
  
  historico |> 
    dplyr::filter(!Indicador%in%nacional$Indicador)->z

nacional$Descripción[nacional$Indicador=='Índice de Rezago Social Longitudinal']=
  'El IRSL busca identificar los avances en el desarrollo social a partir de distinguir zonas que han disminuido su rezago social a largo del tiempo, así como identificar los retos que se plantean en aquellas que han permanecido con un alto grado de rezago social en estos 20 años.'
nacional$Descripción[nacional$Indicador=='Porcentaje de la población vulnerable por ingresos']='Aquella población que no presenta carencias sociales pero cuyo ingreso es inferior o igual a la línea de bienestar.'

###############################################################
########################Pendiente##############################
indicadores_para_actualizar=openxlsx::read.xlsx("Datos/Actualizaciones/Economico_Julio_2025.xlsx")
colnames(indicadores_para_actualizar)=gsub("\\."," ",colnames(indicadores_para_actualizar))

indicadores_para_actualizar=indicadores_para_actualizar |> 
  dplyr::rename(Indicador=Inullicador)|> 
  dplyr::select(dplyr::matches(colnames(nacional))) |> 
  dplyr::mutate(Tema='Económico') |> 
  dplyr::relocate(Tema,.before = Indicador)
indicadores_para_actualizar$Indicador=gsub(pattern = "null",replacement = "nd",x = indicadores_para_actualizar$Indicador)
indicadores_para_actualizar$Descripción=gsub(pattern = "null",replacement = "nd",x = indicadores_para_actualizar$Descripción)
z=indicadores_para_actualizar |> 
  stringdist_left_join(nacional |> dplyr::select(Indicador), by = c(Indicador = "Indicador")
                        ,
                        max_dist=0.133597885,distance_col = "dist",method='jw') |> 
  dplyr::group_by(Indicador.x)  |> 
  dplyr::slice_min(order_by = dist, n = 1) |> 
  dplyr::arrange(dist) |> 
  dplyr::filter(!is.na(dist)) |> 
  dplyr::relocate(c(dist,Indicador.y),.after = Indicador.x)

z=z |> dplyr::select(-Descripción) |> 
  merge(nacional |> 
          dplyr::select(Indicador,Descripción),by.x='Indicador.y',by.y='Indicador',all.x=T) |> 
  dplyr::relocate(Descripción,.after = Indicador.y)
indicadores_nuevos=indicadores_para_actualizar |> 
  dplyr::filter(!Indicador%in%z$Indicador.x)






##Reemplazar los renglones: #Ni modo que me pidan actualizar información desactualizada
nacional2=rbind(nacional |> dplyr::filter(!Indicador%in%z$Indicador.y),
z |> dplyr::ungroup()|> dplyr::select(-c(Indicador.x,dist)) |> 
  dplyr::rename(Indicador=Indicador.y))

##
##Agregar los nuevos:
#Se modifican los nombres de indicadores para hacerlos coincidir.





###############################################################
##Podemos acompletar la información de los históricos con los datos nacionales.
nacional[paste0(nacional$Indicador,"-",nacional$Año) |> sapply(\(x){
  !x%in%paste0(historico$Indicador,"-",historico$Año)
}) |> which(),]->z
historico2=rbind(historico,z |> dplyr::select(Tema,Indicador,Año,Hidalgo,) |> 
  dplyr::rename(Valor=Hidalgo) |> 
  dplyr::mutate(Fuente=NA))
nacional2[paste0(nacional2$Indicador,"-",nacional2$Año) |> sapply(\(x){
  !x%in%paste0(historico2$Indicador,"-",historico2$Año)
}) |> which(),]->z
historico2=rbind(historico2,z |> dplyr::select(Tema,Indicador,Año,Hidalgo,) |> 
  dplyr::rename(Valor=Hidalgo) |> 
  dplyr::mutate(Fuente=NA))




historico2=historico2 |> 
  dplyr::filter(Valor!='-' & !is.na(Valor))

historico_fuentes=historico2 |> 
  dplyr::arrange(Año) |> 
  dplyr::group_by(Indicador) |> 
  dplyr::slice_head(n=1)



historico2 |> 
  dplyr::filter(!Indicador%in%nacional2$Indicador) ->z




#################################################
#################################################
#Datos sin histórico:
nacional2[nacional2$Indicador |> sapply(\(x){
  !x%in%historico2$Indicador
}) |> unlist() |> which(),]->zz
#################################################
#################################################
library(sf)


###Guardar

historico2 |> 
  write.csv("../Datos/Hidalgo_historico.csv",row.names = F,fileEncoding = "UTF-8")

nacional2 |> 
  write.csv("../Datos/Nacional.csv",row.names = F,fileEncoding = "UTF-8")
