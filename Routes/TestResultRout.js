const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const parentMW = require("../middleware/parentMW")
const TestResultController = require("../Controllers/TestResultController")

 router.get("/",[nurseMW,secretaryMW],TestResultController.getAllTestResults)
router.get("/:_id",[nurseMW,secretaryMW,parentMW], TestResultController.getTestResultById)
router.post("/",nurseMW, TestResultController.creatTestResults)
 router.delete("/:_id",[nurseMW,secretaryMW],TestResultController.deleteTestResults)
 router.put("/",nurseMW, TestResultController.updateTestResults)
module.exports = router
