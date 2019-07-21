const home = [39.759541, -104.999107];
var map = L.map('map').setView(home, 17);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var options = {
  position: 'topright',
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
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }
});
