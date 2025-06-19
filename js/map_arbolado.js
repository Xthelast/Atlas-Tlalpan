// Inicializar el mapa
var map = L.map('map').setView([19.2883, -99.1671], 11);

// Capa base principal
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
osmLayer.addTo(map);

// Popup informativo de ejemplo
var contenidoPopup = `
  <div style="text-align: center;">
    <h4>Alcaldía Tlalpan</h4>
    <img src="assets/Logo AT Horizontal guinda.svg" alt="Logo Tlalpan" style="width: 150px; height: auto; margin-bottom: 10px;" />
    <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
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

L.marker([19.288353, -99.167169])
  .bindPopup(contenidoPopup)
  .addTo(map);

// Estilos generales
function styleEntidad() {
  return {
    color: '#773357',
    weight: 2.5,
    fillOpacity: 0.1
  };
}

function pointStyle(feature) {
  return {
    radius: 5,
    fillColor: "green",
    color: "#006400",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

let entidadLayer;
let coloniasLayer;
let arboladoLayer;

// ENTIDAD
fetch('data/A_Tlalpan.geojson')
  .then(res => res.json())
  .then(data => {
    entidadLayer = L.geoJSON(data, { style: styleEntidad });
    entidadLayer.addTo(map);
  });

// COLONIAS
fetch('data/N1.geojson')
  .then(res => res.json())
  .then(data => {
    coloniasLayer = L.geoJSON(data, {
      style: { color: 'green', weight: 1 },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.NOMUT) {
          layer.bindPopup(`<strong>Colonia:</strong> ${feature.properties.NOMUT}`);
        }
      }
    });
  });

// ARBOLADO
fetch('data/arbolado_1_inventado.geojson')
  .then(res => res.json())
  .then(data => {
    arboladoLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, pointStyle(feature)),
      onEachFeature: function (feature, layer) {
        var p = feature.properties;
        var g = feature.geometry.coordinates;
        var popupContent = `
          <table>
            <tr><th>Especie</th><td>${p["Especie (nombre común)"]}</td></tr>
            <tr><th>Nombre Científico</th><td>${p["Especie (nombre cientifico)"]}</td></tr>
            <tr><th>Diámetro (cm)</th><td>${p["Diametro a la altura del pecho (cm)"]}</td></tr>
            <tr><th>Diámetro Copa (m)</th><td>${p["Diametro de la copa (m)"]}</td></tr>
            <tr><th>Diámetro Raíz (m)</th><td>${p["Diametro de raíz (m)"]}</td></tr>
            <tr><th>Colonia</th><td>${p["Colonia"]}</td></tr>
            <tr><th>Altura (m)</th><td>${p["Altura del arbol (m)"]}</td></tr>
            <tr><th>Latitud</th><td>${g[1]}</td></tr>
            <tr><th>Longitud</th><td>${g[0]}</td></tr>
            <tr><th>Observaciones</th><td>${p["Observaciones"]}</td></tr>
          </table>`;

        layer.bindPopup(popupContent);
      }
    });
  });

// ZOOM DINÁMICO
map.on('zoomend', function () {
  const z = map.getZoom();
  if (z < 14) {
    if (!map.hasLayer(entidadLayer)) map.addLayer(entidadLayer);
    if (map.hasLayer(coloniasLayer)) map.removeLayer(coloniasLayer);
    if (map.hasLayer(arboladoLayer)) map.removeLayer(arboladoLayer);
  } else if (z >= 13 && z < 15) {
    if (map.hasLayer(entidadLayer)) map.removeLayer(entidadLayer);
    if (!map.hasLayer(coloniasLayer)) map.addLayer(coloniasLayer);
    if (map.hasLayer(arboladoLayer)) map.removeLayer(arboladoLayer);
  } else {
    if (map.hasLayer(entidadLayer)) map.removeLayer(entidadLayer);
    if (map.hasLayer(coloniasLayer)) map.removeLayer(coloniasLayer);
    if (!map.hasLayer(arboladoLayer)) map.addLayer(arboladoLayer);
  }
});

// BASEMAPS SWITCHER
new L.basemapsSwitcher([
  {
    layer: osmLayer,
    icon: 'assets/images/img1.png',
    name: 'OpenStreetMap'
  },
  {
    layer: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Stadia Maps'
    }),
    icon: 'assets/images/img2.png',
    name: 'Stadia'
  },
  {
    layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap'
    }),
    icon: 'assets/images/img3.png',
    name: 'Topo'
  }
], {
  position: 'topright'
}).addTo(map);
