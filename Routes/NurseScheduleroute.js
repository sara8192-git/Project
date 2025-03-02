const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const NurseScheduleControllers = require("../Controllers/NurseScheduleControllers")

 router.get("/",secretaryMW,NurseScheduleControllers.getAllNurseSchedule)
router.get("/:_id", [secretaryMW,nurseMW],NurseScheduleControllers.getNurseScheduleById)
router.get("/:_id", [secretaryMW,nurseMW],NurseScheduleControllers.getSchedulesByNurseId)
router.post("/", secretaryMW, NurseScheduleControllers.createNewNurseSchedule)
 router.delete("/:_id",secretaryMW, NurseScheduleControllers.deleteNurseSchedule)
 router.put("/", [secretaryMW,nurseMW],NurseScheduleControllers.updateNurseSchedule)
module.exports = router
