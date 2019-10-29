const csvtojsonV2 = require("csvtojson");
const https = require('https')
const uuidv1 = require('uuid/v1')
const fs = require('fs')
const path = require('path')

const csv = 'https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+3T2018+type@asset+block/customer-data.csv'

// 1. Download the CSV:
const downloadCSV = (csv) => {

    console.log('downloading csv file')

    const fetchPage = (urlF, callback) => {
        https.get(urlF, (response) => {
            let buff = ''
            response.on('data', (chunk) => {
                buff += chunk
            })
            response.on('end', () => {
                callback(null, buff)
            })
        }).on('error', (error) => {
            console.error(`Got error: ${error.message}`)
            callback(error)
        })
    }

    var folderNameCSV = uuidv1()
    folderNameCSV = 'CSV_TO_JSON'
    fs.mkdirSync(folderNameCSV)
    fetchPage(csv, (error, data) => {

        if (error) return console.log(error)
        fs.writeFileSync(path.join(__dirname, folderNameCSV, 'file.xml'), data)

    })
}

// 2. Transform the CSV to JSON and save it
function transform(){
    csvtojsonV2().fromFile('./CSV_TO_JSON/file.xml')
    .then((jsonObj) => {

        var folderNameJSON = uuidv1()
        folderNameJSON = 'JSON_CONVERTED'

        fs.mkdirSync(folderNameJSON)
        jsonObj = JSON.stringify(jsonObj)
        fs.writeFileSync(path.join(__dirname, folderNameJSON, 'archivo.json'), jsonObj)

    })
}

downloadCSV(csv)
setTimeout(transform, 3000);