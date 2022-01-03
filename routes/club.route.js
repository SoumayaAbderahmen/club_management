const express = require('express');
const router = express.Router();
const upload= require('../helpers/upload_photos')

const { requireSignin, adminMiddleware } = require('../controllers/auth.controller');
const { getById, update, list,deleteClub,create,setPresedent,setProfessor, addMember} = require('../controllers/club.controller');

router.post('/',upload.single('logo'), requireSignin, create);
router.put('/update', upload.single('logo'),requireSignin, update);
router.get('/', requireSignin, list);
router.get('/details/:id', requireSignin, getById);
router.delete('/:id', requireSignin, deleteClub);
router.patch('/:id/set-presedent/:id_user',requireSignin, setPresedent);
router.patch('/:id/set-professor/:id_prof',requireSignin, setProfessor);
router.post('/:id/add-member',requireSignin, addMember);

module.exports = router;