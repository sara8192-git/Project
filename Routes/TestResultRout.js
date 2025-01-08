const express = require("express")
const router = express.Router()
const NurseScheduleControllers = require("../Controllers/TestResultController")
 router.get("/",TestResultController.getAllNurseSchedule)
router.get("/:_id", TestResultController.getNurseScheduleById)
router.post("/", TestResultController.creatTestResults)
 router.delete("/:_id",TestResultController.deleteNurseSchedule)
 router.put("/",TestResultController.updateNurseSchedule)
module.exports = router
