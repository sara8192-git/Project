const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const parentMW = require("../middleware/parentMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const BabiesControler = require("../Controllers/BabiesController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)

router.post("/",secretaryMW,BabiesControler.creatNewBaby)
router.get("/",nurseMW,BabiesControler.getAllBabies)
router.get("/:_id",parentMW,BabiesControler.getBabiesById)
router.delete("/:_id",administerMW,BabiesControler.deleteBaby)
router.put("/",parentMW,BabiesControler.updateBabies)
router.get("/by-parent/:parentId", parentMW, BabiesControler.getBabiesByParent)

module.exports = router