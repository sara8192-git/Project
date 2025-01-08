const express = require("express")
const cors = require("cors")
require("dotenv").config()
const corsOptions = require('./config/corsOptions')
const connectDB = require("./config/dbConn")
const app = express()
connectDB()
const PORT = process.env.PORT || 7000

app.use(cors(corsOptions))
app.use(express.json())

app.use(express.static("public"))

app.listen(PORT, ()=>{console.log(`Server run on${PORT}`)})