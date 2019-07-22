const home = [39.759541, -104.999107];
const work = [39.760000, -104.999200];
let map = L.map('map').setView(home, 17);
// L.marker(home)
//   .bindPopup(home.toString())
//   .openPopup()
//   .addTo(map);
// L.marker(work)
//   .bindPopup(work.toString())
//   .openPopup()
//   .addTo(map);
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
  edit: {
    featureGroup: editableLayers,
    edit: false,
    save: false
  }
});
map.addControl(drawControl);

let listings = [
  {
    id: 1,
    addr: '123 Main St',
    lat: 39.759541,
    long: -104.999107
  },
  {
    id: 2,
    addr: '987 Main St',
    lat: 39.765000,
    long: -104.998200
  }
]

let filteredListings = []

let coordArr = []

let markerArr = []

let searchArea = {
  lat: {
    west: null,
    east: null
  },
  long: {
    north: null,
    south: null
  }
}

map.on(L.Draw.Event.CREATED, function(e) {
  let type = e.layerType,
    layer = e.layer;
  if (type === 'marker') {
    layer.bindPopup('Marker');
  }
  editableLayers.addLayer(layer);
  searchArea.lat.west = layer._bounds._southWest.lat
  searchArea.lat.east = layer._bounds._northEast.lat
  searchArea.long.north = layer._bounds._northEast.lng
  searchArea.long.south = layer._bounds._southWest.lng
  console.log(searchArea)
  filterResults()
  return searchArea
});

function filterResults() {
  console.log(filteredListings)
  for (let i = 0; i < listings.length; i++) {
    if ((listings[i].lat > searchArea.lat.west && listings[i].lat < searchArea.lat.east) && (listings[i].long < searchArea.long.north && listings[i].long > searchArea.long.south)) {
      filteredListings.push(listings[i])
      markerArr.push(listings[i].lat, listings[i].long)
      L.marker(markerArr)
        .bindPopup(listings[i].addr)
        .openPopup()
        .addTo(map);
    }
  }
  console.log(filteredListings)
}

let beginDraw = new L.Control.Coordinates()
beginDraw.addTo(map);
map.on('mousedown', function(e) {
  beginDraw.setCoordinates(e);
});

let endDraw = new L.Control.Coordinates()
endDraw.addTo(map);
map.on('mouseup', function(e) {
  endDraw.setCoordinates(e);
});
