const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})
require('dotenv').config();
process.env.NODE_ENV = 'development'

const app = express()

// Connect to database
connectDB();

// body parser
app.use(bodyParser.json())
// Load routes

const authRouter = require('./routes/auth.route')
const studentRouter = require('./routes/student.route')
const profRouter = require('./routes/professor.route')
const adminRouter = require('./routes/admin.route')
const clubRouter = require('./routes/club.route')

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
const cors = require('cors')

app.use(cors())
    app.use(morgan('dev'))
}

// Use Routes
app.use('/api', authRouter)
app.use('/api/students', studentRouter)
app.use('/api/admin', adminRouter)
app.use('/api/prof', profRouter)
app.use('/api/clubs', clubRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});