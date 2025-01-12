const express = require("express")
const router = express.Router()
const UserControler = require("../Controllers/UserController")

const secretaryMW = require("../middleware/secretaryMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const parentMW = require("../middleware/parentMW")

router.get("/",[administerMW,nurseMW,secretaryMW],UserControler.getAllUsers)
router.get("/:_id",UserControler.getUserById)
router.post("/",UserControler.creatNewUsers)
router.delete("/:_id",administerMW,UserControler.deleteUser)
router.put("/",UserControler.updateUser)

module.exports = router

