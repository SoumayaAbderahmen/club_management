const express = require('express');
const router = express.Router();

const { requireSignin, adminMiddleware } = require('../controllers/auth.controller');
const { getById, update, list, getProfile } = require('../controllers/student.controller');

router.get('/:id', requireSignin, getById);
router.get('/profile', requireSignin,getProfile );
router.put('/update', requireSignin, update);
router.get('/', list);

module.exports = router;