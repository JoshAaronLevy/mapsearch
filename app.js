const app = document.getElementById('listings');

const home = [39.759541, -104.999107];
const work = [39.760000, -104.999200];
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
  if (type === 'marker') {
    layer.bindPopup('Marker');
  }
  editableLayers.removeLayer(layer);
  editableLayers.addLayer(layer);
  searchArea.lat.west = layer._bounds._southWest.lat;
  searchArea.lat.east = layer._bounds._northEast.lat;
  searchArea.lon.north = layer._bounds._northEast.lng;
  searchArea.lon.south = layer._bounds._southWest.lng;
  filterResults();
}));

function filterResults() {
  for (let i = 0; i < listings.length; i++) {
    if ((listings[i].lat > searchArea.lat.west && listings[i].lat < searchArea.lat.east) && (listings[i].lon < searchArea.lon.north && listings[i].lon > searchArea.lon.south)) {
      filteredListings.push(listings[i])
      let markerPosition = [listings[i].lat, listings[i].lon]
      L.marker(markerPosition)
        .bindPopup(listings[i].address[0].street)
        .openPopup()
        .addTo(map)
    }
  }
  listings.map(createLazyCard).map(node => app.appendChild(node));
}

function createLazyCard(listing) {
  const template = document.querySelector('.property.card');
  const card = template.cloneNode(true);
  card.classList.remove('template');
  // Update cloned nodes fields
  card.querySelector('.card-title').textContent = listing.address[0].street;
  card.querySelector('.card-price').textContent = new Intl.NumberFormat().format(listing.price);
  // card.querySelector('.address').textContent = address
  console.log('card', card);
  return card;
}

function getListingDetails(listing) {
  const $li = document.createElement('li');
  $li.classList.add('card');
  const $elements = [
    setImage(),
    getImage(listing.img),
    getAddress(listing.address[0].street),
    getPrice(listing.price),
    getBedsBaths(listing.beds, listing.baths),
    getSqft(listing.sqft)
  ].forEach($element => $li.appendChild($element));
  document.querySelector('#listings').appendChild($li);
  // createBlock(listing);
}

function setImage() {
  const $imageBlock = document.createElement('div');
  // const $imageBlock = document.createElement('img');
  $imageBlock.classList.add('image-container');
  document.querySelector('#img').appendChild($imageBlock);
}

function getImage(img) {
  const $image = document.createElement('img');
  $image.src = img;
  return $image;
}

function getAddress(street) {
  const $cardInfo = document.createElement('h4');
  $cardInfo.classList.add('card-title');
  $cardInfo.textContent = street
  return $cardInfo
}

function getBedsBaths(beds, baths) {
  return getElement('p', `${beds} Beds - ${baths} Baths`);
}

function getSqft(sqft) {
  sqft = new Intl.NumberFormat().format(sqft)
  return getElement('p', `${sqft} Sq. Ft.`);
}

function getPrice(price) {
  price = new Intl.NumberFormat().format(price)
  return getElement('p', `$${price}`);
}

function getElement(tagName, text) {
  const $element = document.createElement(tagName);
  const $text = document.createTextNode(text);
  $element.appendChild($text);
  return $element;
}
