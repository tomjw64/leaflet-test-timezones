const crypto = require('crypto')
const hash = crypto.createHash('sha256')
const geojson = require('./geodata.json')

const mymap = window.L.map('mapid', { preferCanvas: true })

mymap.setView([39.0921167, -94.8559011], 5)

const mapPositronNoLabels = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: 'data from <a href="https://simplemaps.com/data/us-cities">simplemaps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
})

mapPositronNoLabels.addTo(mymap)

const memo = {}
function getColor (feature) {
  const timezoneString = feature.properties.timezone
  if (!memo[timezoneString]) {
    hash.update(timezoneString)
    memo[timezoneString] = '#' + hash.digest('hex').substring(0, 6)
  }
  return memo[timezoneString]
}

const points = window.L.geoJSON(geojson, {
  pointToLayer: function (feature, latlng) {
    return window.L.circleMarker(latlng, {
      radius: 6,
      fillColor: getColor(feature),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).on('click', function (e) {
      window.L.popup()
        .setLatLng(e.latlng)
        .setContent(`<p><b>City:</b> ${e.target.feature.properties.city_ascii}<br /><b>Timezone:</b> ${e.target.feature.properties.timezone}</p>`)
        .openOn(mymap)
    })
  }
})

points.addTo(mymap)
