const home = [39.759541,-104.999107];
const map = L.map("map").setView(home, 17);

L.marker(home)
    .bindPopup("Home")
    .openPopup()
    .addTo(map);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
}).addTo(map);
