const express = require("express")
const router = express.Router()
const AppointmentController = require("../Controllers/AppointmentController")
router.get("/",AppointmentController.getAllAppointments)
router.get("/:id", AppointmentController.getAppointmentById)
router.post("/", AppointmentController.createNewAppointments)
router.delete("/:_id",AppointmentController.deleteAppointment)
router.put("/",AppointmentController.updateAppointment)
module.exports = router
