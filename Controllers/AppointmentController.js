const Appointment = require('../models/Appointments')

const createNewAppointments = async (req, res) => {
    const {identity,baby_id,nurse_id,status,appointment_time} = req.body
    if (!identity || !baby_id || !nurse_id || !appointment_time )  
        return res.status(400).json({ message: 'identity, baby_id, nurse_id,appointment_time  are required' })

    const Appointments = await Appointment.create({identity,baby_id,nurse_id,status,appointment_time })

    if (Appointments) { // Created
        return res.status(201).json({ message: 'New Appointments created' })
        } else {
        return res.status(400).json({ message: 'Invalid Appointments ' })}
   }

   const getAllAppointments = async (req, res) => {

    const Appointments = await Appointment.find().lean()
    if (!Appointments?.length) {
        return res.status(400).json({ message: 'No Appointments found' })
        }
        res.json(Appointments)
        
   }
   const updateAppointment = async (req, res) => {
    const {_id, identity,baby_id,nurse_id,status,appointment_time}= req.body
    // Confirm data
    if (!identity  ) {
    return res.status(400).json({ message: 'fields are required' })
    }
    // Confirm task exists to update
    const Appointments = await Appointment.findById(_id).exec()
    if (!Appointments) {
    return res.status(400).json({ message: 'Appointment not found' })
    }
    if(baby_id)
        Appointments.baby_id=baby_id
    if(nurse_id)
        Appointments.nurse_id=nurse_id
    if(status)
        Appointments.status=status
    if(appointment_time)
        Appointments.appointment_time=appointment_time
    const savedAppointments=await Appointments.save()
    if (!savedAppointments)
        res.status(400).send("Update Failed")

    //const Appointments = await Appointment.find().lean()
    res.json(`'${savedAppointments.identity}' updated`)
    }

    const deleteAppointment = async (req, res) => {
        const { _id } = req.params
        // Confirm task exists to delete
        const Appointments = await Appointment.findById(_id).exec()
        if (!_id) {
        return res.status(400).json({ message: 'Appointment not found' })
        }
        const result = await Appointment.deleteOne()
        const reply=`ID ${_id} deleted`
        //const newAppointment= await Appointment.find().lean()
        res.json(reply)
    }

    const getAppointmentById = async (req, res) => {
        const {_id} = req.params
        // Get single task from MongoDB
        const Appointments = await Appointment.findById(_id).lean()
        // If no tasks
        if (!Appointments || !_id) {
        return res.status(400).json({ message: 'No Appointment found' })
        }
        res.json(Appointments)
    }

    

    module.exports = {
        createNewAppointments,
        getAllAppointments,
        updateAppointment ,
        deleteAppointment,
        getAppointmentById
        }
