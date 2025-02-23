const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/home.controller');

router.route('/')
    .get(HomeController.get);

module.exports = router;