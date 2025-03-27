const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const nurseMW = require("../middleware/nurseMW")
const administerMW = require("../middleware/administerMW")
const NurseScheduleControllers = require("../Controllers/NurseScheduleControllers")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)
// router.get("/", secretaryMW, NurseScheduleControllers.getAllNurseSchedule)
// router.get("/:_id",  nurseMW, NurseScheduleControllers.getNurseScheduleById)
// router.get("/:_id", nurseMW, NurseScheduleControllers.getSchedulesByNurseId)
// router.post("/", secretaryMW, NurseScheduleControllers.createNewNurseSchedule)
// router.delete("/:_id", secretaryMW, NurseScheduleControllers.deleteNurseSchedule)
// router.put("/",  nurseMW, NurseScheduleControllers.updateNurseSchedule)
router.post("/", nurseMW, NurseScheduleControllers.createScheduleForNurse);
router.get("/available-slots", nurseMW, NurseScheduleControllers.getAvailableSlots);
router.post("/book-slot", nurseMW, NurseScheduleControllers.bookSlot);

module.exports = router
