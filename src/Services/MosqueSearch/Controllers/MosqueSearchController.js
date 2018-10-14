const {Mosque} = require('../Models/Mosque');

class MosqueSearchController {
    saveMosque(req, res) {
        let mosque = new Mosque({
            name: req.body.name,
            image: req.body.image,
            postcode: req.body.postcode,
            city: req.body.city,
            geomatry: req.body.geomatry
        });
        mosque.save().then((doc) => {
            res.send(doc);
        }).catch((err) => {
            res.send(err);
        })
    }

    findMosque(req, res) {
        let mosque = Mosque.findById(req.params.id).then((doc) => {
            res.send(doc);
        }).catch((err) => {
            res.send(err);
        })
    }

    searchMosque(req, res) {
        const sort = req.query.sort ? req.query.sort.split("=") : "_id=1".split("=");
        const key = sort[0];
        const value = Number(sort[1]);
        const perPage = Number(req.query.per_page) || 25;
        const from = req.query.from ? Number(req.query.from) : 0;

        Mosque.aggregate([
            {
                $geoNear: {
                    near: {type: "Point", coordinates: [Number(req.query.lng), Number(req.query.lat)]},
                    maxDistance: 100000,
                    spherical: true,
                    distanceField: "dist.calculated"             
                }
            },
            {$limit: perPage},
            {$skip: from},
            {$sort: {key: value}}
        ]).then((doc) => {
            res.json({
                results: doc
            });
        })
        .catch((error) => {
            res.send(error);
        })
    }

    bulkUpload(req, res) {
        const fs = require('fs');
        const postcodes = JSON.parse(fs.readFileSync(appRoot + '/storage/coordinate/result.json', 'utf8'));
        let mosque;
        postcodes.map((item) => {
            mosque = new Mosque({
                town: item.town,
                county: item.county,
                country: item.country,
                postcode: item.postcode,
                geomatry: {
                    type: "Point",
                    coordinates: [item.lng, item.lat]
                }
            });

            mosque.save();
        })

        res.send("Processing complete");
    }
}

module.exports = MosqueSearchController;