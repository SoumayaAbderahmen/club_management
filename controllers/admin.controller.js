const Admin = require('../models/admin.model');
const expressJwt = require('express-jwt');


exports.getProfile = (req, res) => {
    Admin.findById(req.user._id,'-password -salt').exec((err, admin) => {
        if (err || !admin) {
            return res.status(400).json({
                error: 'admin not found'
            });
        }

        res.json(admin);
    });
};


exports.update = (req, res) => {
    
    // console.log('UPDATE admin - req.admin', req.admin, 'UPDATE DATA', req.body);
    let body = req.body;

    Admin.findOne({ _id: req.user._id }, (err, admin) => {
        if (err || !admin) {
            return res.status(400).json({
                error: 'admin not found'
            });
            
        }
        if(req.file){
            body['image']= req.file.filename
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                data['password'] = password;
            }
        }

        admin.save((err, updatedadmin) => {
            if (err) {
                console.log('admin UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'admin update failed'
                });
            }
            updatedadmin.hashed_password = undefined;
            updatedadmin.salt = undefined;
            res.json(updatedadmin);
        });
    });
};