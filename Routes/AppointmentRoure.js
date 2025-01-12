const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const parentMW = require("../middleware/parentMW")
const AppointmentController = require("../Controllers/AppointmentController")

router.get("/",secretaryMW, AppointmentController.getAllAppointments)
router.get("/:id",[secretaryMW,parentMW],AppointmentController.getAppointmentById)
router.post("/", [secretaryMW,parentMW],AppointmentController.createNewAppointments)
router.delete("/:_id",[secretaryMW,parentMW],AppointmentController.deleteAppointment)
router.put("/",[secretaryMW,parentMW],AppointmentController.updateAppointment)
module.exports = router
