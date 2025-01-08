const express = require("express")
const cors = require("cors")
require("dotenv").config()
const mongoose=require("mongoose")
const corsOptions = require('./config/corsOptions')
const connectDB = require("./config/dbConn")
const app = express()
connectDB()
const PORT = process.env.PORT || 7000

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))

app.use('/users',require('./Routes/UserRoure'))
app.use('/appointment',require('./Routes/AppointmentRoure'))
app.use('/nurseScheduler',require('./Routes/NurseScheduleroute'))
app.use('/baby',require('./Routes/BabiesRoure'))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
    })
    mongoose.connection.on('error', err => {
    console.log(err)
})