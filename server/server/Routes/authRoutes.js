
const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload"); // <-- להוסיף את זה!

const authController = require("../Controllers/authController")
router.post("/login", authController.login)
router.post("/register", upload.single('profilePicture'), authController.register)
module.exports = router