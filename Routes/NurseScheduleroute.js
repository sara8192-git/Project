const express = require("express")
const router = express.Router()
const NurseScheduleControllers = require("../Controllers/NurseScheduleControllers")
 router.get("/",NurseScheduleControllers.getAllNurseSchedule)
router.get("/:_id", NurseScheduleControllers.getNurseScheduleById)
router.post("/", NurseScheduleControllers.createNewNurseSchedule)
 router.delete("/:_id",NurseScheduleControllers.deleteNurseSchedule)
 router.put("/",NurseScheduleControllers.updateNurseSchedule)
module.exports = router
