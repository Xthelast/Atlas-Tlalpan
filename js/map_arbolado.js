var map = L.map('map').setView([19.2883, -99.1671], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

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

var entidadLayer = L.geoJSON(null, { style: { color: 'black', weight: 2 } }).addTo(map);

fetch('data/A_Tlalpan.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: '#773357',
                    weight: 2.5,
                    fillColor: '#773357',
                    fillOpacity: 0.0,
                };
            }
        }).addTo(map);
    });

fetch('data/A_Tlalpan.geojson')
    .then(response => response.json())
    .then(data => {
        entidadLayer = L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: '#773357',
                    weight: 2.5,
                    fillColor: '#773357',
                    fillOpacity: 0.3,
                };
            }
        }).addTo(map);
    });

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

var coloniasLayer;
fetch('data/N1.geojson')
    .then(response => response.json())
    .then(data => {
        coloniasLayer = L.geoJSON(data, {
            style: { color: 'green', weight: 1 },
            onEachFeature: function(feature, layer) {
                if (feature.properties && feature.properties.NOMUT) {
                    layer.bindPopup(`<strong>Colonia:</strong> ${feature.properties.NOMUT}`);
                }
            }
        });
    });

var arboladoLayer;
fetch('data/arbolado_1_inventado.geojson')
    .then(response => response.json())
    .then(data => {
        arboladoLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, pointStyle(feature));
            },
            onEachFeature: function(feature, layer) {
                var popupContent = `
                    <table>
                        <tr><th>Especie</th><td>${feature.properties["Especie (nombre común)"]}</td></tr>
                        <tr><th>Nombre Científico</th><td>${feature.properties["Especie (nombre cientifico)"]}</td></tr>
                        <tr><th>Diámetro (cm)</th><td>${feature.properties["Diametro a la altura del pecho (cm)"]}</td></tr>
                        <tr><th>Diámetro Copa (m)</th><td>${feature.properties["Diametro de la copa (m)"]}</td></tr>
                        <tr><th>Diámetro Raíz (m)</th><td>${feature.properties["Diametro de raíz (m)"]}</td></tr>
                        <tr><th>Colonia</th><td>${feature.properties["Colonia"]}</td></tr>
                        <tr><th>Altura (m)</th><td>${feature.properties["Altura del arbol (m)"]}</td></tr>
                        <tr><th>Latitud</th><td>${feature.geometry.coordinates[1]}</td></tr>
                        <tr><th>Longitud</th><td>${feature.geometry.coordinates[0]}</td></tr>
                        <tr><th>Observaciones</th><td>${feature.properties["Observaciones"]}</td></tr>
                    </table>
                `;
                layer.bindPopup(popupContent);
            }
        });
    });

map.on('zoomend', function() {
    var zoomLevel = map.getZoom();

    if (zoomLevel < 14) {
        if (!map.hasLayer(entidadLayer)) map.addLayer(entidadLayer);
        if (map.hasLayer(coloniasLayer)) map.removeLayer(coloniasLayer);
        if (map.hasLayer(arboladoLayer)) map.removeLayer(arboladoLayer);
    } else if (zoomLevel >= 13 && zoomLevel < 15) {
        if (map.hasLayer(entidadLayer)) map.removeLayer(entidadLayer);
        if (!map.hasLayer(coloniasLayer)) map.addLayer(coloniasLayer);
        if (map.hasLayer(arboladoLayer)) map.removeLayer(arboladoLayer);
    } else {
        if (map.hasLayer(entidadLayer)) map.removeLayer(entidadLayer);
        if (map.hasLayer(coloniasLayer)) map.removeLayer(coloniasLayer);
        if (!map.hasLayer(arboladoLayer)) map.addLayer(arboladoLayer);
    }
});

