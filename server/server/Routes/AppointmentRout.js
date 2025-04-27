const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const parentMW = require("../middleware/parentMW")
const verifyJWT = require("../middleware/verifyJWT")
const nurseMW = require("../middleware/nurseMW")

const AppointmentController = require("../Controllers/AppointmentController")

router.use(verifyJWT)
router.get("/", parentMW, AppointmentController.getAllAppointments)
router.get("/date/:date",  parentMW, AppointmentController.getAppointmentsByDate)
router.get("/:id",  parentMW, AppointmentController.getAppointmentById)
router.post("/",  parentMW, AppointmentController.createNewAppointments)
router.patch("/cancel/:_id",  parentMW, AppointmentController.cancelAppointment)
router.put("/",  parentMW, AppointmentController.updateAppointment)
router.get("/Nurse/:nurse_id",  nurseMW, AppointmentController.getAppointmentByNurseId)
router.get("/Baby/:baby_id",  parentMW, AppointmentController.getAppointmentByBabyId)

module.exports = router
