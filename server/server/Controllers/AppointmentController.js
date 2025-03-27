const Appointment = require('../models/Appointments')
const jwt = require('jsonwebtoken'); // ודא שהחבילה מותקנת

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
    const { _id } = req.params
    // Get single task from MongoDB
    const Appointments = await Appointment.findById(_id).lean()
    // If no tasks
    if (!Appointments || !_id) {
        return res.status(400).json({ message: 'No Appointment found' })
    }
    res.json(Appointments)
}
const getAppointmentsByDate = async (req, res) => {


    try {
        // const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
        // if (!token) {
        //     return res.status(401).json({ message: 'No token provided' }); // אם לא קיים טוקן
        // }

        // // פענוח הטוקן
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ודא שיש לך את הסוד במשתני סביבה
        // if (decoded.role !== 'parent') { // אם המשתמש אינו הורה
        //     return res.status(403).json({ message: 'Forbidden: You are not authorized' });
        // }
      
        const { date } = req.params; // התאריך שמתקבל מהלקוח
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        // המרה של התאריך לאובייקט Date כדי להשוות
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
 

        const appointments = await Appointment.find({
            "appointment_time.date":selectedDate  
        }).lean();
   console.log(appointments);
        if (!appointments.length) {
            return res.status(404).json({ message: 'No appointments found for this date' });
        }

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    createNewAppointments,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsByDate
}
