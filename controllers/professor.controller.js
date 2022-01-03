const Professor = require('../models/professor.model');
const expressJwt = require('express-jwt');

exports.getById = (req, res) => {
    const professorId = req.params.id;
    Professor.findById(professorId,'-password -salt').populate('club.club_id').exec((err, professor) => {
        if (err || !professor) {
            return res.status(400).json({
                error: 'professor not found'
            });
        }
        //professor.hashed_password = undefined;
        //professor.salt = undefined;
        res.json(professor);
    });
};

exports.getProfile = (req, res) => {
    Professor.findById(req.user._id,'-password -salt').populate('club.club_id').exec((err, professor) => {
        if (err || !professor) {
            return res.status(400).json({
                error: 'professor not found'
            });
        }

        res.json(professor);
    });
};

exports.list = (req, res) => {
    const professorId = req.params.id;
    Professor.find({},'-password -salt').populate('club.club_id').exec((err, professor) => {
        if (err) {
            return res.status(400).json({
                error: 'error on getting the list'
            });
        }
        //professor.hashed_password = undefined;
        //professor.salt = undefined;
        res.json(professor);
    });
};

exports.update = (req, res) => {
    
    // console.log('UPDATE professor - req.professor', req.professor, 'UPDATE DATA', req.body);
    let body = req.body;

    Professor.findOne({ _id: req.user._id }, (err, professor) => {
        if (err || !professor) {
            return res.status(400).json({
                error: 'professor not found'
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

        professor.save((err, updatedprofessor) => {
            if (err) {
                console.log('professor UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'professor update failed'
                });
            }
            updatedprofessor.hashed_password = undefined;
            updatedprofessor.salt = undefined;
            res.json(updatedprofessor);
        });
    });
};