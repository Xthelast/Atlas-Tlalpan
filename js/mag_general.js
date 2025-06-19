// Inicializar el mapa
const map = L.map('map').setView([19.2883, -99.1671], 11);

// Capa base inicial
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
baseLayer.addTo(map);

// Popup informativo en el punto central
const contenidoPopup = `
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

L.marker([19.288353, -99.167169]).bindPopup(contenidoPopup).addTo(map);

// Capas principales
let entidadLayer = null;
let entidadContornoLayer = null;
let capaActiva = null;
const capas = {}; // Aquí se almacenan las capas dinámicamente

// Cargar entidad con relleno y contorno
fetch('data/A_Tlalpan.geojson')
  .then(res => res.json())
  .then(data => {
    entidadLayer = L.geoJSON(data, {
      style: {
        color: '#773357',
        weight: 2.5,
        fillColor: '#773357',
        fillOpacity: 0.3
      }
    }).addTo(map);

    entidadContornoLayer = L.geoJSON(data, {
      style: {
        color: '#773357',
        weight: 2.5,
        fillOpacity: 0
      }
    });
  });

// Definición de rutas de capas
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

// Cargar capas (pero no agregarlas al mapa aún)
for (const clave in rutas) {
  fetch(rutas[clave])
    .then(res => res.json())
    .then(data => {
      capas[clave] = L.geoJSON(data, {
        style: { color: getRandomColor(), weight: 2 }
      });
    });
}

// Función para manejar el cambio de capa
function cambiarCapa(seleccionada) {
  if (capaActiva) map.removeLayer(capaActiva);

  if (!seleccionada) {
    if (entidadContornoLayer && map.hasLayer(entidadContornoLayer)) map.removeLayer(entidadContornoLayer);
    if (entidadLayer && !map.hasLayer(entidadLayer)) entidadLayer.addTo(map);
    return;
  }

  if (entidadLayer && map.hasLayer(entidadLayer)) map.removeLayer(entidadLayer);
  if (entidadContornoLayer && !map.hasLayer(entidadContornoLayer)) entidadContornoLayer.addTo(map);

  const nuevaCapa = capas[seleccionada];
  if (nuevaCapa) {
    capaActiva = nuevaCapa;
    capaActiva.addTo(map);
  }
}

// Escuchar selector de capas
const selector = document.getElementById('layerSelector');
selector.addEventListener('change', () => cambiarCapa(selector.value));

// Color aleatorio para estilos
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
  

