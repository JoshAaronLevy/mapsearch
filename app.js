const app = document.getElementById('listings');

setTimeout(() => {
  loadServerPins()
}, 1250);

const home = [39.759541, -104.999107];
const work = [39.760000, -104.999200];
let map = new L.map('map').setView(home, 16);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);

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
  edit: {
    featureGroup: editableLayers,
    edit: false,
    save: false,
    delete: true
  }
});
map.addControl(drawControl);

let listings = [
  {
    id: 1,
    address: [
      {
        street: '123 Main St',
        city: 'Denver',
        state: 'CO',
        zip: 80202
      }
    ],
    img: 'https://vo-mapsearch.s3-us-west-2.amazonaws.com/house-1.png',
    beds: 3,
    baths: 4,
    sqft: 4500,
    price: 1000000,
    remarks: 'This house is nice!',
    lat: 39.760000,
    lon: -104.998200
  },
  {
    id: 2,
    address: [
      {
        street: '987 Main Blvd',
        city: 'Denver',
        state: 'CO',
        zip: 80202
      }
    ],
    img: 'https://vo-mapsearch.s3-us-west-2.amazonaws.com/house-2.png',
    beds: 4,
    baths: 5,
    sqft: 5750,
    price: 2000000,
    remarks: 'Wow, what an awesome house!',
    lat: 39.759541,
    lon: -104.999107
  }
]

let filteredListings = []

let searchArea = {
  lat: {
    west: null,
    east: null
  },
  lon: {
    north: null,
    south: null
  }
}

let beginDraw = new L.Control.Coordinates();
beginDraw.addTo(map);
map.on('mousedown', (e => {
  beginDraw.setCoordinates(e);
}));

let endDraw = new L.Control.Coordinates();
endDraw.addTo(map);
map.on('mouseup', (e => {
  endDraw.setCoordinates(e);
}));

map.on(L.Draw.Event.CREATED, (e => {
  let type = e.layerType;
  let layer = e.layer;
  editableLayers.addLayer(layer);
  if (type === 'marker') {
    layer.bindPopup('Marker');
  }
  searchArea.lat.west = layer._bounds._southWest.lat;
  searchArea.lat.east = layer._bounds._northEast.lat;
  searchArea.lon.north = layer._bounds._northEast.lng;
  searchArea.lon.south = layer._bounds._southWest.lng;
  filterResults();
}));

map.on('draw:deleted', function (e) {
  console.log('Deleted:', arguments)
  // window.location.reload(e);
});

function loadServerPins() {
  return getServerData()
    .then(listings => {
      return listings.map((l, index) => {
        if (index === 0) {
          map.panTo([l.lat, l.lon]);
        }
        return L.marker([l.lat, l.lon])
          .bindPopup(`${l.ln}: ${l.address}`)
          .openPopup()
          .addTo(map)
      })
    })
}
function filterResults() {
  for (let i = 0; i < listings.length; i++) {
    let markerPosition = [listings[i].lat, listings[i].lon]
    if ((listings[i].lat > searchArea.lat.west && listings[i].lat < searchArea.lat.east) && (listings[i].lon < searchArea.lon.north && listings[i].lon > searchArea.lon.south)) {
      filteredListings.push(listings[i])
      L.marker(markerPosition)
        .bindPopup(`${listings[i].id}: ${listings[i].address[0].street}`)
        .openPopup()
        .addTo(map)
    } else {
      markerPosition = [];
    }
    console.log(markerPosition);
  }
  listings = filteredListings
  listings.map(createLazyCard).map(node => app.appendChild(node));
}

function createLazyCard(listing) {
  const template = document.querySelector('.property.card');
  const card = template.cloneNode(true);
  const sidebarTrigger = document.querySelector('.sidebar.sidebar-left.leaflet-touch');
  const sidebarContent = document.querySelector('#home');
  const sidebarTabs = document.querySelector('#sidebar-tab-control');
  card.classList.remove('template');
  card.querySelector('.card-id').textContent = listing.id;
  card.querySelector('.card-img-top').src = listing.img;
  card.querySelector('.card-title').textContent = listing.address[0].street;
  card.querySelector('.card-price').textContent = '$' + new Intl.NumberFormat().format(listing.price);
  card.querySelector('.card-beds-baths').textContent = `${listing.beds} Beds - ${listing.baths} Baths`;
  card.querySelector('.card-sqft').textContent = new Intl.NumberFormat().format(listing.sqft) + ' ' + 'Sq. Ft.';
  sidebarTrigger.classList.remove('collapsed');
  sidebarTabs.classList.add('active');
  sidebarContent.classList.add('active');
  return card;
}
