const fs = require('fs')
const geojson = require('geojson')
const parse = require('csv-parse/lib/sync')

const citiesDataPath = 'uscities.csv'
const citiesData = fs.readFileSync(citiesDataPath)

const records = parse(citiesData, {
  columns: true,
  skip_empty_lines: true
})

const keepKeys = [
  'city_ascii',
  'state_id',
  'timezone',
  'id'
]

const geodata = geojson.parse(records, { Point: ['lat', 'lng'], include: keepKeys })

fs.writeFileSync('geodata.json', JSON.stringify(geodata))
