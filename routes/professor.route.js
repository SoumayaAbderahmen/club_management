const express = require('express');
const router = express.Router();
const upload= require('../helpers/upload_photos')

const { requireSignin, adminMiddleware } = require('../controllers/auth.controller');
const { getById, update, list,getProfile } = require('../controllers/professor.controller');

router.get('/:id', requireSignin, getById);
router.put('/update', upload.single('image'),requireSignin, update);
router.get('/', requireSignin, list);
router.get('/profile', requireSignin, getProfile)

module.exports = router;