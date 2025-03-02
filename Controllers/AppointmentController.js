const Appointment = require('../models/Appointments')

 // יצירת תור חדש
const createNewAppointments = async (req, res) => {
    try {
        const { appointment_time, status, user_id } = req.body;

        // בדיקה אם יש תור קיים באותו זמן
        const existingAppointment = await Appointment.findOne({ appointment_time });
        if (existingAppointment) {
            return res.status(400).json({ message: 'Appointment already exists at this time' });
        }

        // יצירת תור חדש
        const appointment = new Appointment({
            appointment_time,
            status,
            user_id,
        });

        await appointment.save();
        return res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating appointment', error });
    }
};

   const getAllAppointments = async (req, res) => {

    const Appointments = await Appointment.find().lean()
    if (!Appointments?.length) {
        return res.status(400).json({ message: 'No Appointments found' })
        }
        res.json(Appointments)
        
   }
 // עדכון תור
const updateAppointment = async (req, res) => {
    try {
        const { _id, appointment_time, status } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        // מציאת התור על ידי ID
        const appointment = await Appointment.findById(_id).exec();
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' });
        }

        // עדכון פרטי התור
        appointment.appointment_time = appointment_time || appointment.appointment_time;
        appointment.status = status || appointment.status;

        await appointment.save();
        return res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating appointment', error });
    }
};

    const deleteAppointment = async (req, res) => {
        try {
            const { _id } = req.body;
    
            if (!_id) {
                return res.status(400).json({ message: 'Appointment ID is required' });
            }
    
            // מציאת התור על ידי ID
            const appointment = await Appointment.findById(_id).exec();
            if (!appointment) {
                return res.status(400).json({ message: 'Appointment not found' });
            }
    
            // מחיקת התור
            await Appointment.deleteOne({ _id });
            return res.status(200).json({ message: 'Appointment deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting appointment', error });
        }
    };

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
