const Student = require('../models/student.model');
const expressJwt = require('express-jwt');

exports.getById = (req, res) => {
    const studentId = req.params.id;
    Student.findById(studentId,'-password -salt').populate('club.club_id').exec((err, student) => {
        if (err || !student) {
            return res.status(400).json({
                error: 'student not found'
            });
        }
        //student.hashed_password = undefined;
        //student.salt = undefined;
        res.json(student);
    });
};
exports.getProfile = (req, res) => {
    Student.findById(req.user._id,'-password -salt').populate('club.club_id').exec((err, student) => {
        if (err || !student) {
            return res.status(400).json({
                error: 'student not found'
            });
        }

        res.json(student);
    });
};
exports.list = (req, res) => {
    const studentId = req.params.id;
    Student.find({},'-password -salt').exec((err, student) => {
        if (err) {
            return res.status(400).json({
                error: 'error on getting the list'
            });
        }
        //student.hashed_password = undefined;
        //student.salt = undefined;
        res.json(student);
    });
};

exports.update = (req, res) => {
    
    // console.log('UPDATE student - req.student', req.student, 'UPDATE DATA', req.body);
    let body = req.body;

    Student.findOne({ _id: req.user._id }, (err, student) => {
        if (err || !student) {
            return res.status(400).json({
                error: 'student not found'
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

        student.save((err, updatedstudent) => {
            if (err) {
                console.log('student UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'student update failed'
                });
            }
            updatedstudent.hashed_password = undefined;
            updatedstudent.salt = undefined;
            res.json(updatedstudent);
        });
    });
};