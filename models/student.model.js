const mongoose = require('mongoose');
const crypto = require('crypto');

const role_options=['member','presedent' ,'stuff'] 

// student schema
const club_schema = new mongoose.Schema({
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'club'
  },
  role: {
    type:String,
    enum: role_options,
    default:'member'
}
},  {
  timestamps: true
})

const studentScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
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
    image: {
      type: String,
      trim: true
    },
    niveau: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    resetPasswordLink: {
      data: String,
      default: ''
    },
    role: {
      type: String,
      default: 'student'
    },
    cin: {
      type: String,
      trim: true
    },
    club: [club_schema]
  },

  {
    timestamps: true, usePushEach : true 
  }
);

// virtual
studentScheama
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
studentScheama.methods = {
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

module.exports = mongoose.model('student', studentScheama);
