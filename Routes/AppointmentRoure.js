const express = require("express")
const router = express.Router()
const secretaryMW = require("../middleware/secretaryMW")
const parentMW = require("../middleware/parentMW")
const verifyJWT = require("../middleware/verifyJWT")

const AppointmentController = require("../Controllers/AppointmentController")
router.use(verifyJWT)
router.get("/", secretaryMW, AppointmentController.getAllAppointments)
router.get("/:id",  parentMW, AppointmentController.getAppointmentById)
router.post("/",  parentMW, AppointmentController.createNewAppointments)
router.delete("/:_id",  parentMW, AppointmentController.deleteAppointment)
router.put("/",  parentMW, AppointmentController.updateAppointment)
module.exports = router
