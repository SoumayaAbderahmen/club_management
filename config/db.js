const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const connection = await mongoose.connect('mongodb://localhost:27017/clubs', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
}; 

module.exports = connectDB;