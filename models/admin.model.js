const mongoose = require('mongoose');
const crypto = require('crypto');
// admin schema
const adminScheama = new mongoose.Schema(
  {

    user_name: {
      type: String,
      trim: true,
      required: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    resetPasswordLink: {
      data: String,
      default: ''
    },
    role: {
      type: String,
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
);

// virtual                  
adminScheama
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods
adminScheama.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

module.exports = mongoose.model('Admin', adminScheama);
