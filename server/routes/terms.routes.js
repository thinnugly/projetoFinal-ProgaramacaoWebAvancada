const express = require('express');
const router = express.Router();
const TermsController = require('../controllers/terms.controller')

router.route('/')
    .get(TermsController.get);

module.exports = router;