const express = require("express")
const router = express.Router()
const BabiesControler = require("../Controllers/BabiesController")

router.get("/",BabiesControler.getAllBabies)
router.get("/:_id",BabiesControler.getBabiesById)
router.post("/",BabiesControler.creatNewBabie)
router.delete("/:_id",BabiesControler.deleteBabies)
router.put("/",BabiesControler.updateBabies)

module.exports = router

