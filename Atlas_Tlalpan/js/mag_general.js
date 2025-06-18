var map= L.map('map').setView([19.2883, -99.1671], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    }).addTo(map);

    var contenidoPopup = `
    <div style="text-align: center;">
        <h4>Alcaldía Tlalpan</h4>
        <img src="assets/Logo AT Horizontal guinda.svg" 
             alt="Logo Dorado Blanco" 
             style="width: 150px; height: auto; margin-bottom: 10px;" />
        <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 12px;">
            <tr><th>Campo</th><th>Valor</th></tr>
            <tr><td><strong>Nombre</strong></td><td>Alcaldía Tlalpan</td></tr>
            <tr><td><strong>Población</strong></td><td>699,567</td></tr>
            <tr><td><strong>Área</strong></td><td>312 km²</td></tr>
            <tr><td><strong>Altitud</strong></td><td>2,400 m</td></tr>
        </table>
        <p style="margin-top: 8px; font-size: 12px;">
            Más información en: <a href="https://tlalpan.cdmx.gob.mx/" target="_blank">Tlalpan</a>
        </p>
    </div>
`;

var PuntoA = L.marker([19.288353439487146, -99.16716951534852])
    .bindPopup(contenidoPopup)
    .addTo(map);

    let entidadLayer = null;
    let entidadContornoLayer = null;
    
    // Cargar la capa con relleno al principio
    fetch('data/A_Tlalpan.geojson')
      .then(response => response.json())
      .then(data => {
        entidadLayer = L.geoJSON(data, {
          style: {
            color: '#773357',
            weight: 2.5,
            fillColor: '#773357',
            fillOpacity: 0.3
          }
        }).addTo(map);
    
    // Guardamos la versión solo con contorno (pero no la agregamos al mapa aún)
        entidadContornoLayer = L.geoJSON(data, {
          style: {
            color: '#773357',
            weight: 2.5,
            fillOpacity: 0
          }
        });
      });
    
    const capas = {}; // Objeto para guardar las capas
    let capaActiva = null;
    
    document.getElementById('layerSelector').addEventListener('change', function () {
        const seleccionada = this.value;
      
    // Quitar la capa activa anterior si existe
        if (capaActiva) {
          map.removeLayer(capaActiva);
          capaActiva = null;
        }
      
    // Quitar la capa con relleno si existe
        if (entidadLayer && map.hasLayer(entidadLayer)) {
          map.removeLayer(entidadLayer);
        }
      
    // Mostrar contorno si no está ya en el mapa
        if (entidadContornoLayer && !map.hasLayer(entidadContornoLayer)) {
          entidadContornoLayer.addTo(map);
        }
      
    // Mostrar la nueva capa si fue seleccionada
        if (seleccionada && capas[seleccionada]) {
          capaActiva = capas[seleccionada];
          capaActiva.addTo(map);
        }
      });
      
    // Carga todas las capas (aquí pondrías la ruta a tus archivos o servicios)
    const rutas = {
      layer1: 'data/Pueblos.geojson',
      layer2: 'data/Suelo_Conservacion.geojson',
      layer3: 'data/COL_T.geojson',
      layer4: 'data/AGEB_URBANA_TLALPAN.geojson',
      layer5: 'data/ANP_T.geojson',
      layer6: 'data/layer6.geojson',
      layer7: 'data/layer7.geojson',
      layer8: 'data/layer8.geojson',
      layer9: 'data/layer9.geojson',
      layer10: 'data/layer10.geojson'
    };
    
    // Carga todas las capas (pero no las agrega aún al mapa)
    for (const clave in rutas) {
      fetch(rutas[clave])
        .then(res => res.json())
        .then(data => {
          capas[clave] = L.geoJSON(data, {
            style: { color: getRandomColor(), weight: 2 }
          });
        });
    }
    
    // Manejo del cambio de capa
    document.getElementById('layerSelector').addEventListener('change', function () {
      const seleccionada = this.value;
    
      if (capaActiva) {
        map.removeLayer(capaActiva);
      }
    
      if (seleccionada && capas[seleccionada]) {
        capaActiva = capas[seleccionada];
        capaActiva.addTo(map);
      }
    });
    
    // Función auxiliar para colores aleatorios (opcional)
    function getRandomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    
    if (!seleccionada) {
        if (capaActiva) {
          map.removeLayer(capaActiva);
          capaActiva = null;
        }
      
        if (entidadContornoLayer && map.hasLayer(entidadContornoLayer)) {
          map.removeLayer(entidadContornoLayer);
        }
      
        if (entidadLayer && !map.hasLayer(entidadLayer)) {
          entidadLayer.addTo(map);
        }
      }
      

