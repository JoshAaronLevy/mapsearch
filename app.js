const home = [39.759541, -104.999107];
let map = L.map('map').setView(home, 17);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

let MyCustomMarker = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
    iconUrl: 'link/to/image.png'
  }
});

let drawControl = new L.Control.Draw({
  position: 'topleft',
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    circlemarker: false,
    rectangle: {
      shapeOptions: {
        clickable: false
      }
    },
    marker: false
  },
  edit: false
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function(e) {
  let type = e.layerType,
    layer = e.layer;
  if (type === 'marker') {
    layer.bindPopup('Marker');
  }
  editableLayers.addLayer(layer);
});

let beginDraw = new L.Control.Coordinates()

beginDraw.addTo(map);

map.on('mousedown', function(e) {
  beginDraw.setCoordinates(e);
  console.log('Beginning coordinates:')
  console.log(e.latlng.lat, e.latlng.lng)
});

let endDraw = new L.Control.Coordinates()

endDraw.addTo(map);

map.on('mouseup', function(e) {
  endDraw.setCoordinates(e);
  console.log('Ending coordinates:')
  console.log(e.latlng.lat, e.latlng.lng)
});
