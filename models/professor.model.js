const mongoose = require('mongoose');
const crypto = require('crypto');
// professor schema

const club_schema = new mongoose.Schema({
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'club'
  }
},  {
  timestamps: true
})

const professorScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true, //eleminate whitespace
      required: true,
      unique: true, //an email must be unique
      lowercase: true //
    },
    user_name: {
      type: String,
      trim: true,
      required: true
    },
    first_name: {
      type: String,
      trim: true
    },
    last_name: {
      type: String,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      default: 'professor'
    },
    club: [club_schema]
  },

  {
    timestamps: true
  }
);

// virtual
professorScheama
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
professorScheama.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
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

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

module.exports = mongoose.model('Professor', professorScheama);
