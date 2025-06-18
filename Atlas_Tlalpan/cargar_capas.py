# Lista de capas con sus nombres y rutas
capas = [
    ("D:/Uriel/Trabajo/TLALPAN/Colonias_tlalpan.gpkg", "Colonias Tlalpan"),
    ("D:/Uriel/Trabajo/TLALPAN/Entidad_1_1.gpkg", "Entidad 1_1"),
    ("D:/Uriel/Trabajo/TLALPAN/Tlalpan_entidad.gpkg", "Tlalpan Entidad"),
]

# Iterar sobre cada capa y cargarla en el proyecto
for ruta, nombre in capas:
    vlayer = QgsVectorLayer(ruta, nombre, "ogr")
    
    if vlayer.isValid():
        QgsProject.instance().addMapLayer(vlayer)
        print(f"Capa cargada: {nombre}")
    else:
        print(f"Error al cargar: {ruta}")
