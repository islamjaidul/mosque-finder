let _ = require('lodash');

class CoordinatSearchController {

    /**
     * retrieve lat and lng from google by postcode using json file
     * 
     * @param {*} req 
     * @param {*} res 
     * @return void
     */
    async getCoordinateByPostcode(req, res) {
        res.send('Job is processing');
        let fs = require('fs');
        let postcodes = JSON.parse(fs.readFileSync(appRoot + '/storage/coordinate/postcode.json', 'utf8'));
        let data = [];
        let count = 0;
        const promises = postcodes.map(async function(item, index) {
            try {
                let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.Postcode)}&key=AIzaSyDjLsgMwpw2U2g11FfRWSdUYqOqJibFjqs`);
                count++;
                if (response.data.results.status = 'OK') {
                    let formattedResponse = {
                        "town": item.Town,
                        "county": item.County,
                        "country": item.Country,
                        "postcode": item.Postcode,
                        "lat": response.data.results[0].geometry ? response.data.results[0].geometry.location.lat : null,
                        "lng": response.data.results[0].geometry ? response.data.results[0].geometry.location.lng : null
                    };
                    return data.push(formattedResponse);
                }
            } catch(err) {
                console.log(err);
            }
            
        })

        await Promise.all(promises)
            .then((response) => {
                fs.writeFileSync(appRoot + '/storage/coordinate/result.json', JSON.stringify(data));
                console.log('Total Execution', count);
            }).catch((error) => {
                console.log(error.response.data);
            });
         
        return;
    }

    /**
     * create json file by lat and lng from google map api
     * 
     * @param {*} req 
     * @param {*} res 
     * @return void
     */
    makePropertyDataSet(req, res) {
        res.send('Parsing...');

        let fs = require('fs');

        let coordinates = JSON.parse(fs.readFileSync(appRoot + '/storage/coordinate/result.json', 'utf8'));
        let properties = JSON.parse(fs.readFileSync(appRoot + '/storage/coordinate/property-type/residential-to-rent.json', 'utf8'));
        let result = this.processData(coordinates, properties);
        
        console.log("Writing File with Data", result.length);

        try {
            fs.writeFileSync(appRoot + '/storage/coordinate/property-result/residential_to_rent_result.json', JSON.stringify(result));
        } catch(err) {
            console.log("Problem with", err.message);
        }
        
        console.log('processing complete.');
    }

    /**
     * process data by coordinate and given properties
     * 
     * @param {*} coordinates 
     * @param {*} properties
     * @return array
     */
    processData(coordinates, properties) {
        let coordinatesLength = coordinates.length;
        let propertiesLength = properties.length - 1;
        let propertyIndex = 0;

        let result = [];
        for (let i = 0; i < coordinatesLength; i++) {
            if (propertyIndex > propertiesLength) {
                propertyIndex = 0;
            }

            let property = _.cloneDeep(properties[propertyIndex])

            property.lat = coordinates[i].lat;
            property.lng = coordinates[i].lng;
            property.postcode = coordinates[i].postcode;
            result.push(property);
            
            console.log("Processing - ", i);
            propertyIndex++;
        }

        return result;
    }
}

module.exports = CoordinatSearchController;