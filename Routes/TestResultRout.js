const express = require("express")
const router = express.Router()
const NurseScheduleControllers = require("../Controllers/TestResultController")
 router.get("/",TestResultController.getAllNurseSchedule)
router.get("/:_id", TestResultController.getUserById)
router.post("/", TestResultController.creatTestResults)
 router.delete("/:_id",TestResultController.deleteTestResults)
 router.put("/",TestResultController.updateTestResults)
module.exports = router
