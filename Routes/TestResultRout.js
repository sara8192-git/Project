const express = require("express")
const router = express.Router()
const TestResultController = require("../Controllers/TestResultController")
 router.get("/",TestResultController.getAllTestResults)
router.get("/:_id", TestResultController.getTestResultById)
router.post("/", TestResultController.creatTestResults)
 router.delete("/:_id",TestResultController.deleteTestResults)
 router.put("/",TestResultController.updateTestResults)
module.exports = router
