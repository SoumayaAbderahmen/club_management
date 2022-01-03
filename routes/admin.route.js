const express = require('express');
const router = express.Router();
const upload= require('../helpers/upload_photos')
// import controller
const { requireSignin } = require('../controllers/auth.controller');
const { getProfile, update, list } = require('../controllers/admin.controller');

router.get('/profile', requireSignin, getProfile);
router.put('/update',upload.single('image'), requireSignin, update);


module.exports = router;