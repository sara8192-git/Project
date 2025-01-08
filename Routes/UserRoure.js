const express = require("express")
const router = express.Router()
const UserControler = require("../Controllers/UserController")

router.get("/",UserControler.getAllUsers)
router.get("/:_id",UserControler.getUserById)
router.post("/",UserControler.creatNewUsers)
router.delete("/:_id",UserControler.deleteUser)
router.put("/",UserControler.updateUser)

module.exports = router

