const express = require('express');
const router = express.Router();
const MosqueSearchController = new(require('../Controllers/MosqueSearchController'));

router.post('/mosque', MosqueSearchController.saveMosque);
router.get('/mosque/:id', MosqueSearchController.findMosque);
router.get('/bulk-data/mosque/', MosqueSearchController.bulkUpload);
router.get('/search', MosqueSearchController.searchMosque);

module.exports = router;