const express = require('express');
const { register } = require('../controllers/authControllers');
const router = express.Router();

router.post('/jwt', register)

module.exports = router;