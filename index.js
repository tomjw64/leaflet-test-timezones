const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const geojson = require('./geodata.json')

const mymap = L.map('mapid', { preferCanvas: true })

mymap.setView([29.753970, -95.369686], 5)

const CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: 'data from <a href="https://simplemaps.com/data/us-cities">simplemaps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
})

CartoDB_PositronNoLabels.addTo(mymap)

const memo = {}
function getColor(feature) {
  const timezoneString = feature.properties.timezone
  if (!memo[timezoneString]) {
    hash.update(timezoneString)
    memo[timezoneString] = "#" + hash.digest('hex').substring(0,6)
  }
  return memo[timezoneString]
}

const points = L.geoJSON(geojson, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: getColor(feature),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
})

points.addTo(mymap)

// mymap.on('zoomend', function() {
//   if (mymap.getZoom() < 9) {
//     geoPointsSmall.addTo(mymap)
//   } else {
//     geoPointsLarge.addTo(mymap)
//   }
// });