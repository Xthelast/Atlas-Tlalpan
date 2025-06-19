import geojson

def validar_geojson(data/Entidad_Tlalpan.geojson):
        try:
            with open(data/Entidad_Tlalpan.geojson, 'r') as f:
                data = geojson.load(f)
            print(f"El archivo {archivo_geojson} es válido.")
        except ValueError as e:
            print(f"El archivo {archivo_geojson} no es válido: {e}")