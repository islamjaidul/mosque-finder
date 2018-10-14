let _ = require('lodash');

class StreetCheckApiController {
    
    processMetaData(req, res) {
        res.send('Processing...');

        let fs = require('fs');

        let postcodes = JSON.parse(fs.readFileSync(appRoot + '/storage/coordinate/result.json', 'utf8'));
        let result = this.processData(postcodes);
        
        console.log("Writing File with Data", result.length);

        try {
            fs.writeFileSync(appRoot + '/storage/coordinate/property-result/residential_for_sale_meta.json', JSON.stringify(result));
        } catch(err) {
            console.log("Problem with", err.message);
        }
        
        console.log('processing complete.');
    }

    processData(postcodes) {
        
    }
}

module.exports = StreetCheckApiController;