const mongoose = require('mongoose');
// admin schema

const role_options = ['member', 'RH', 'marketing', 'tresory', 'media']

const members_schema = new mongoose.Schema({

  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
  },
  role: {
    type: String,
    enum: role_options,
  }
}
)
const stuff_schema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
  },
  role: {
    type: String,
    enum: role_options,
  }
}
)
const clubScheama = new mongoose.Schema(
  {

    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    logo: {
      type: String,
      required: true
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'professor'
    },
    presedent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student'
    },
    members: [members_schema],

  },

  {
    timestamps: true
  }
);


module.exports = mongoose.model('Club', clubScheama);
