const fs = require('fs')

const bufferData = fs.readFileSync('1-json.json')
const jsonData = bufferData.toString()
const data = JSON.parse(jsonData)
console.log(data.name)

// update data

data.name = "Jayshree"

const userJson = JSON.stringify(data)
fs.writeFileSync('1-json.json', userJson)