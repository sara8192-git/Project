const express = require("express")
const cors = require("cors")
require("dotenv").config()
const mongoose=require("mongoose")
const corsOptions = require('./config/corsOptions')
const connectDB = require("./config/dbConn")
const verifyJWT = require("./middleware/verifyJWT")
const app = express()
connectDB()
const PORT = process.env.PORT || 7000

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))
app.get("/", (req, res) => { res.send("This is home page") })




app.use(verifyJWT)
app.use('/user',require('./Routes/UserRoure'))
app.use('/appointment',require('./Routes/AppointmentRoure'))
app.use('/nurseScheduler',require('./Routes/NurseScheduleroute'))
app.use('/baby',require('./Routes/BabiesRout'))
app.use('/testResults',require('./Routes/TestResultRout'))
app.use("/auth", require("./Routes/authRoutes"))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
    })
    mongoose.connection.on('error', err => {
    console.log(err)
})