const express = require('express');
const router = express.Router();
const PostcodeSearchController = new (require('../Controllers/PostcodeSearchController'));
const CoordinateSearchController = new (require('../Controllers/CoordinateSearchController'));
const StreetCheckApiController = new (require('../Controllers/StreetCheckApiController'));

router.get('/', PostcodeSearchController.index);
router.get('/data', PostcodeSearchController.fetchData);
router.get('/parse-data', PostcodeSearchController.parseData);
router.get('/search-coordinate', CoordinateSearchController.getCoordinateByPostcode);
router.get('/parse-coordinate', CoordinateSearchController.makePropertyDataSet.bind(CoordinateSearchController));
router.get('/fetch-metadata', StreetCheckApiController.processMetaData.bind(StreetCheckApiController));

module.exports = router;