const express = require('express')
const upload= require('../helpers/upload_photos')
const router = express.Router()

// Load Controllers
const {
    signin,
    createAdmin,
    facebookAuth,
    googleAuth,
    resetPassword,
    forgotPassword,
    studentSignup,
    professorSignup,
    activateAccount
} = require('../controllers/auth.controller')


const {
    validSign,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

router.post('/student/register', upload.single('image'),studentSignup)

router.post('/admin/create',upload.single('image'),createAdmin)

router.post('/professor/register',upload.single('image'),professorSignup)

router.post('/login',
    validLogin, signin)

router.post('/activation', activateAccount)

// forgot reset password
router.put('/forgotpassword', forgotPasswordValidator, forgotPassword);
router.put('/resetpassword', resetPasswordValidator, resetPassword);


module.exports = router