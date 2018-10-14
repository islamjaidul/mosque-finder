let mongose = require('mongoose');

const geomatry = {
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
};

var Mosque = mongose.model('Mosques', {
    town: {
        type: String,
        required: true,
        trim: true
    },
    county: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        default: null
    },
    geomatry: geomatry
});

module.exports = {Mosque};