const express = require('express');
const {createNewUrl, getAllUrls, redirectUrl, getAnalyticOfId} = require('../controllers/url');

const router = express.Router();

router.route('/').post(createNewUrl).get(getAllUrls);
router.get('/analytics/:id', getAnalyticOfId);
// router.get('/:id', redirectUrl);

module.exports = router;