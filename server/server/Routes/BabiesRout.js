const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const parentMW = require("../middleware/parentMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const BabiesControler = require("../Controllers/BabiesController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)
router.get("/",nurseMW,BabiesControler.getAllBabies)
router.get("/:_id",parentMW,BabiesControler.getBabiesById)
router.post("/",secretaryMW,BabiesControler.creatNewBabie)
router.delete("/:_id",administerMW,BabiesControler.deleteBaby)
router.put("/",parentMW,BabiesControler.updateBabies)

module.exports = router