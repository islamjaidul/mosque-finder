class PostcodeSearchController {
    index(req, res) {
       return res.render('PostcodeSearch/resources/views/postcodesearch/index');
    }

    async fetchData(req, res) {
        res.send('Job is processing');
        let fs = require('fs');
        let postcodes = JSON.parse(fs.readFileSync(appRoot + '/storage/postcode/uk-towns.json', 'utf8'));
        let data = [];
        let count = 0;
        const promises = postcodes.map(async function(item, index) {
            let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.latitude},${item.longitude}&result_type=postal_code&key=AIzaSyCWURC1EHNgmcSScwpIYdegYYcqoUKGDdo`);
            count++;
            console.log(count);
            
            try {
                if (response.data.results.status = 'OK') {
                    let formattedResponse = {
                        id: item.id,
                        name: item.name,
                        county: item.county,
                        country: item.country,
                        grid_reference: item.grid_reference,
                        easting: item.easting,
                        northing: item.northing,
                        lat: item.latitude,
                        lng: item.longitude,
                        elevation: item.elevation,
                        postcode_sector: item.postcode_sector,
                        local_government_area: item.local_government_area,
                        nuts_region: item.nuts_region,
                        type: item.type,
                        formatted_address: response.data.results[0] && response.data.results[0].formatted_address ? response.data.results[0].formatted_address: null
                    };
                    return data.push(formattedResponse);
                }
            } catch(err) {
                console.log(err);
            }
            
        })

        await Promise.all(promises)
            .then((response) => {
                fs.writeFileSync(appRoot + '/storage/postcode/jidul.json', JSON.stringify(data));
                console.log('Total Execution', count);
            }).catch((error) => {
                console.log(error.response.data);
            });
         
        return;
    }

    parseData(req, res) {
        res.send('Parsing...');

        let fs = require('fs');
        let postcodes = JSON.parse(fs.readFileSync(appRoot + '/storage/postcode/jidul.json', 'utf8'));
        let count = 0;

        let result = [];
        postcodes.map((item) => {
            if (item.formatted_address != null) {
                let splittedStr = item.formatted_address.split(',');
                splittedStr.map((splittedItem) => {
                    if (splittedItem.includes(item.postcode_sector)) {
                        let formattedPostcode = splittedItem.substr(splittedItem.indexOf(item.postcode_sector));
                        
                        let formattedData = {
                            id: item.id,
                            name: item.name,
                            county: item.county,
                            country: item.country,
                            grid_reference: item.grid_reference,
                            easting: item.easting,
                            northing: item.northing,
                            lat: item.latitude,
                            lng: item.longitude,
                            elevation: item.elevation,
                            postcode_sector: item.postcode_sector,
                            local_government_area: item.local_government_area,
                            nuts_region: item.nuts_region,
                            type: item.type,
                            formatted_address: item.formatted_address,
                            full_postcode: formattedPostcode
                        };

                        result.push(formattedData);
                    }
                })
            }
        })

        fs.writeFileSync(appRoot + '/storage/postcode/main_result.json', JSON.stringify(result));
        
        console.log('processing complete.');
    }
}

module.exports = PostcodeSearchController;