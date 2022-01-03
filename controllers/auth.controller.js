const Student = require('../models/student.model');
const Professor = require('../models/professor.model');
const Admin = require('../models/admin.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
process.env.MAIL_KEY = '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'
sgMail.setApiKey(process.env.MAIL_KEY);
require('dotenv').config();
process.env.JWT_ACCOUNT_ACTIVATION = 'heytheresoumaya'
process.env.EMAIL_FROM = 'soumayaabderahmen44@gmail.com'
process.env.CLIENT_URL = 'http://localhost:3000'


exports.studentSignup = (req, res) => {
  let data = req.body;
  const errors = validationResult(req);
  if (req.file)
    data['image'] = req.file.fiename
  else
    data['image'] = 'user_avatar.jpg'
    
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(406).json({
      errors: firstError
    });
  } else {
    Student.findOne({
      email:
        data.email
    }).exec((err, student) => {

      if (student) {
        return res.status(400).json({
          errors: 'Email is taken'
        });
      }

    });
    data['role'] = 'student'
    const token = jwt.sign(
      {
        user_name: data.user_name,
        email: data.email,
        password: data.password,
        role: data.role,
        first_name: data.first_name,
        last_name: data.last_name,
        niveau: data.niveau,
        phone: data.phone,
        cin: data.cin,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5h'
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
    };

    sgMail
      .send(emailData)
      .then(sent => {
        return res.json({
          message: `Email has been sent to ${email}`
        });
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err)
        });
      });
  }
};
exports.createAdmin = (req, res) => {
  let data = req.body;
  const errors = validationResult(req);
  if (req.file)
    data['image'] = req.file.fiename
  else
    data['image'] = 'user_avatar.jpg'
    
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(406).json({
      errors: firstError
    });
  } else {
    Admin.findOne({
      email:
        data.email
    }).exec((err, admin) => {

      if (admin) {
        return res.status(400).json({
          errors: 'Email is taken'
        });
      }
      data['role'] = 'admin'
      const admin_object = new Admin(payload);

      admin_object.save((err, new_admin) => {
        if (err) {
          console.log('Save error', errorHandler(err));
          return res.status(401).json({
            errors: errorHandler(err)
          });
        } else {
          const token = jwt.sign(
            {
              user_name: data.user_name,
              email: data.email,
              password: data.password,
              role: data.role,
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
              expiresIn: '5h'
            }
          );
          return res.json({
            success: true,
            token: token,
            data: new_admin,
            message: 'admin is created'
          });
        }
      });
    });



  }
};
exports.professorSignup = (req, res) => {
  let data = req.body;
  const errors = validationResult(req);
  if (req.file)
    data['image'] = req.file.fiename
  else
    data['image'] = 'user_avatar.jpg'

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    Professor.findOne({
      email: data.email
    }).exec((err, pro) => {

      if (pro) {
        return res.status(400).json({
          errors: 'Email is taken'
        });
      }

    });
    data['role'] = 'professor'
    const token = jwt.sign(
      {
        user_name: data.user_name,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        role: data.role,
        phone: data.phone,
        niveau: 'None',
        cin: 'None',

      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5h'
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
    };

    sgMail
      .send(emailData)
      .then(sent => {
        return res.json({
          message: `Email has been sent to ${email}`
        });
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err)
        });
      });
  }
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again'
        });
      } else {
        let payload = jwt.decode(token);
        payload['image'] = 'user_image.jpg'
        payload['club']=[];
        console.log('email and role', email, role);
        if (payload.role == 'student') {
          const student = new Student(payload);

          student.save((err, student) => {
            if (err) {
              console.log('Save error', errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err)
              });
            } else {
              return res.json({
                success: true,
                data: student,
                message: 'Signup success'
              });
            }
          });
        } else {

          const professor = new Professor(payload);

          professor.save((err, professor) => {
            if (err) {
              console.log('Save error', errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err)
              });
            } else {
              return res.json({
                success: true,
                data: professor,
                message: 'Signup success'
              });
            }
          });
        }

      }
    });
  } else {
    return res.json({
      message: 'error happening please try again'
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {

    let user = Student.findOne({ email }).exec().then((user) => user) ? Student.findOne({ email }).exec().then((user) => user) : Professor.findOne({ email }).exec().then((user) => user) ? Professor.findOne({ email }).exec().then((user) => user) : Admin.findOne({ email }).exec().then((user) => user) ? Admin.findOne({ email }).exec().then((user) => user) : null

    if (user == null) {
      return res.status(400).json({
        errors: 'student with that email does not exist. Please signup'
      });
    } else {
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Email and password do not match'
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );
      const { _id, user_name, email, role, image } = user;

      return res.json({
        token,
        user: {
          _id,
          user_name,
          email,
          role,
          image
        }
      });
    }
  }
};


exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET // req.user._id
});

exports.adminMiddleware = (req, res, next) => {

  Student.findById({
    _id: req.student._id
  }).exec((err, student) => {
    if (err || !student) {
      return res.status(400).json({
        error: 'student not found'
      });
    }
    if (student.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource. Access denied.'
      });
    }

    req.profile = student;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    Student.findOne(
      {
        email
      },
      (err, student) => {
        if (err || !student) {
          return res.status(400).json({
            error: 'student with that email does not exist'
          });
        }

        const token = jwt.sign(
          {
            _id: student._id
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: '10m'
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/students/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
        };

        return student.updateOne(
          {
            resetPasswordLink: token
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error:
                  'Database connection error on student password forgot request'
              });
            } else {
              sgMail
                .send(emailData)
                .then(sent => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                  });
                })
                .catch(err => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            error: 'Expired link. Try again'
          });
        }

        Student.findOne(
          {
            resetPasswordLink
          },
          (err, student) => {
            if (err || !student) {
              return res.status(400).json({
                error: 'Something went wrong. Try later'
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: ''
            };

            student = _.extend(student, updatedFields);

            student.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: 'Error resetting student password'
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`
              });
            });
          }
        );
      });
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleAuth = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then(response => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, user_name, email } = response.payload;
      if (email_verified) {
        Student.findOne({ email }).exec((err, student) => {
          if (student) {
            const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, user_name, role } = student;
            return res.json({
              token,
              student: { _id, email, user_name, role }
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            student = new student({ user_name, email, password });
            student.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON student SAVE', err);
                return res.status(400).json({
                  error: 'student signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, user_name, role } = data;
              return res.json({
                token,
                student: { _id, email, user_name, role }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    });
};

exports.facebookAuth = (req, res) => {
  console.log('FACEBOOK LOGIN REQ BODY', req.body);
  const { _id, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${_id}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      // .then(response => console.log(response))
      .then(response => {
        const { email, user_name } = response;
        Student.findOne({ email }).exec((err, student) => {
          if (student) {
            const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, user_name, role } = student;
            return res.json({
              token,
              student: { _id, email, user_name, role }
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            student = new student({ user_name, email, password });
            student.save((err, data) => {
              if (err) {
                console.log('ERROR FACEBOOK LOGIN ON student SAVE', err);
                return res.status(400).json({
                  error: 'student signup failed with facebook'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, user_name, role } = data;
              return res.json({
                token,
                student: { _id, email, user_name, role }
              });
            });
          }
        });
      })
      .catch(error => {
        res.json({
          error: 'Facebook login failed. Try later'
        });
      })
  );
};
