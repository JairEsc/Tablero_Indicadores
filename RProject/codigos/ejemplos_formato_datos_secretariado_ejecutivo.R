"../../../Repositorios/Seguridad_Tablero_Movil/Municipal-Delitos - Junio 2025 (2015-2025).csv" |> 
  read.csv(fileEncoding = "latin1",check.names = F)->zzz
zzz2= zzz|>
  dplyr::select(Año,Entidad,`Tipo de delito`,Enero:Diciembre) |> 
  dplyr::group_by(Año,Entidad,`Tipo de delito`) |> 
  dplyr::summarise_all(\(x){sum(x,na.rm=T)}) |> 
  dplyr::ungroup()
colnames(zzz2)[4:15]=c(1:12)
#zzz2$Total=rowSums(zzz2 |> dplyr::select(Enero:Diciembre),na.rm=T)

zzz3=zzz2  |> tidyr::pivot_wider(names_from = Año,values_from = `1`:`12`,)
colnames(zzz3)[3:(12*11+2)]=colnames(zzz3)[3:(12*11+2)] |> sapply(\(x){
  splits=strsplit(x,split = "_") |> unlist()
  paste0(splits[2],"_",splits[1])
})
zzz4=zzz3[,c(1,2,(c(3:13) |> sapply(\(x){11*c(0:11)+x})  |> lapply(unlist) |> unlist()))]
zzz4=zzz4 |> 
  dplyr::mutate(Tema='Seguridad') |> 
  dplyr::relocate(Tema,.before = Entidad)
zzz4 |> write.csv("ejemplo_secretariado_por_entidad_delito.csv")


zzz4 |> tidyr::pivot_longer(cols = `2015_1`:`2025_12`,names_to = "Mes")->zzz5

zzz6=zzz5 |> 
  tidyr::pivot_wider(names_from = Entidad)


zzz5 |> write.csv("ejemplo_secretariado_por_entidad_delito_mes.csv")
zzz6 |> write.csv("ejemplo_secretariado_por_delito_mes.csv",fileEncoding = "UTF-8",row.names = F)
