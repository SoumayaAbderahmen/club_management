const Club = require('../models/club.model');
const Student = require('../models/student.model');
const Prof = require('../models/professor.model');
const { body } = require('express-validator');
const { response } = require('express');

const handleDate = (dataD) => {
    let data = new Date(dataD)
    let month = data.getMonth() + 1
    let day = data.getDate()
    let year = data.getFullYear()
    if (day <= 9)
        day = '0' + day
    if (month < 10)
        month = '0' + month
    const postDate = day + '-' + month + '-' + year
    return postDate
}


exports.getById = (req, res) => {
    const _id = req.params.id;
    Club.findById(_id).populate('professor presedent members.member_id ').exec((err, club) => {
        if (err || !club) {
            return res.status(400).json({
                error: 'club not found'
            });
        }
        response = {
            name: club.name,
            description: club.description,
            logo: club.logo,
            createdAt: handleDate(club.createdAt),
            professor: club.professor ? {
                first_name: club.professor.first_name,
                lastname: club.professor.lastname,
                image: club.professor.image,
                email: club.professor.email
            } : {},
            description: club.description,
            logo: club.logo,
            presedent: club.presedent ? {
                first_name: club.presedent.first_name,
                lastname: club.presedent.lastname,
                image: club.presedent.image,
                email: club.presedent.email
            } : {},
            members: club.members.map((m) => {
                return ({
                    first_name: m.member_id.first_name,
                    lastname: m.member_id.lastname,
                    image: m.member_id.image,
                    email: m.member_id.email,
                    role: m.role
                })
            })
        }
        res.json(response);
    });
};


exports.deleteClub = (req, res) => {
    const _id = req.params.id;
    Club.findAndDelete({ _id: _id }).exec().then((err, club) => {

        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        else {
            Student.findAndUpdate({ 'club.club_id': _id },
                { $pull: { "club.$.club_id": _id } }).exec()
                .then((clubs) => {
                    Prof.findAndUpdate({ 'club.club_id': _id },
                        { $pull: { "club.$.club_id": _id } }).exec()
                        .then((clubs) => {

                            res.json({ message: "club deleted" });
                        })
                        .catch((err) => {
                            return res.status(400).json({
                                error: err
                            });

                        })
                })
                .catch((err) => {
                    return res.status(400).json({
                        error: err
                    });

                })
        }

    });
};

exports.create = (req, res) => {
    let payload = req.body
    if (req.file)
        payload['logo'] = req.file.filename
    else
        payload['logo'] = 'nabeul_logo.png'

    Club.findOne({ name: payload.name }).exec((err, club) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        if (club) {
            return res.status(400).json({
                error: "club already exists"
            });
        }
        const new_club = new Club(payload);

        new_club.save((err, saved_club) => {
            if (err) {
                console.log('Save error', errorHandler(err));
                return res.status(401).json({
                    errors: errorHandler(err)
                });
            } else {
                return res.json({
                    success: true,
                    data: saved_club,
                    message: 'create club success'
                });
            }
        });

        res.json(club);
    });

};
exports.list = (req, res) => {

    Club.find({}, '-updatedAt').populate('professor presedent members.member_id ').exec((err, clubs) => {
        if (err) {
            return res.status(400).json({
                error: 'error on getting the list'
            });
        }
        clubs.map((c) => {
            return ({
                name: c.name,
                description: c.description,
                logo: c.logo,
                createdAt: handleDate(c.createdAt),
                professor: c.professor ? {
                    first_name: c.professor.first_name,
                    lastname: c.professor.lastname,
                    image: c.professor.image,
                    email: c.professor.email
                } : {},
                description: c.description,
                logo: c.logo,
                presedent: c.presedent ? {
                    first_name: c.presedent.first_name,
                    lastname: c.presedent.lastname,
                    image: c.presedent.image,
                    email: c.presedent.email
                } : {},
                members: c.members.map((m) => {
                    return ({
                        first_name: m.member_id.first_name,
                        lastname: m.member_id.lastname,
                        image: m.member_id.image,
                        email: m.member_id.email,
                        role: m.role

                    })
                }),
            })
        })
        res.json(clubs);
    });
};

exports.update = (req, res) => {

    // console.log('UPDATE club - req.club', req.club, 'UPDATE DATA', req.body);
    let _id = req.params._id;
    let body = req.body


    Club.findById(_id, (err, club) => {
        if (err || !club) {
            return res.status(400).json({
                error: 'club not found'
            });

        }
        if (req.file) {
            body['image'] = req.file.filename
        }
        club.set(body)
        club.save((err, updatedclub) => {
            if (err) {
                console.log('club UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'club update failed'
                });
            }
            res.json(updatedclub);
        });
    });
};


exports.setProfessor = (req, res) => {

    // console.log('UPDATE club - req.club', req.club, 'UPDATE DATA', req.body);
    const id_prof = req.params.id_prof
    const club_id = req.params.id
    Club.update({ _id: req.params.id }, { $set: { professor: id_prof } }).exec().then((club) => {
        if (!club) {
            return res.status(400).json({
                error: 'club not found'
            });
        }
        else {

            Prof.findById(id_prof, 'club').exec().then((prof) => {
                
                prof.club.push({ club_id: club_id})
                prof.save().then(() => {
                        res.json({ message: "updated" })
                    })

                
            }).catch((error) => {
                return res.status(400).json({
                    error: error
                });
            });

        }

    }).catch((error) => {
        return res.status(400).json({
            error: error
        });
    });
};

exports.setPresedent = (req, res) => {

    // console.log('UPDATE club - req.club', req.club, 'UPDATE DATA', req.body);
    const user_id = req.params.user_id
    const club_id = req.params.id
    Club.update({ _id: req.params.id }, { $set: { presedent: user_id } }).exec().then((club) => {
        if (!club) {
            return res.status(400).json({
                error: 'club not found'
            });
        }
        else {

            Student.findById(user_id, 'club').exec().then((user) => {
                let club = user.club.filter((c) => c.club_id == club_id
                )
                if (club) {
                    user.club.id(club._id).set({ role: 'presedent' })
                    user.save().then(() => {
                        res.json({ message: "updated" })
                    })
                } else {

                    user.club.push({ club_id: club_id, role: 'presedent' })
                    user.save().then(() => {
                        res.json({ message: "updated" })
                    })

                }
            }).catch((error) => {
                return res.status(400).json({
                    error: error
                });
            });

        }

    }).catch((error) => {
        return res.status(400).json({
            error: error
        });
    });
};

exports.addMember = (req, res) => {
    const club_id = req.params.id
    const user_id = req.params.user_id
    const body = req.body
    Club.findById(club_id).exec().then((club) => {
        if (!club) {
            return res.status(400).json({
                error: 'club not found'
            });
        }
        else {
            let member = club.members.filter((m) => m.user_id == user_id)
            if (member) {
                club.members.id(member.id).set({ role: body.role })
                club.save().then((err, saved) => {
                    Student.findById(user_id, 'club').exec().then((user) => {
                        let club = user.club.filter((c) => c.club_id == club_id
                        )
                        if (club) {
                            user.club.id(club._id).set({ role: body.role })
                            user.save().then(() => {
                                res.json({ message: "updated" })
                            })
                        } else {

                            user.club.push({ club_id: club_id, role: body.role })
                            user.save().then(() => {
                                res.json({ message: "updated" })
                            })

                        }
                    }).catch((error) => {
                        return res.status(400).json({
                            error: error
                        });
                    });
                })
            } else {
                club.members.push({ user_id: user_id, role: body.role })
                club.save().then((err, saved) => {
                    Student.findById(user_id, 'club').exec().then((user) => {
                        let club = user.club.filter((c) => c.club_id == club_id
                        )
                        if (club) {
                            user.club.id(club._id).set({ role: body.role })
                            user.save().then(() => {
                                res.json({ message: "updated" })
                            })
                        } else {

                            user.club.push({ club_id: club_id, role: body.role })
                            user.save().then(() => {
                                res.json({ message: "updated" })
                            })

                        }
                    }).catch((error) => {
                        return res.status(400).json({
                            error: error
                        });
                    });
                })
            }
        }
    }).catch((error) => {
        return res.status(400).json({
            error: error
        });
    });
};
