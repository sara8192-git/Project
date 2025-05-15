const Appointment = require('../models/Appointments')
const jwt = require('jsonwebtoken'); // ודא שהחבילה מותקנת


// יצירת תור חדש
const createNewAppointments = async (req, res) => {
    try {
        const { appointment_time, nurse_id, baby_id } = req.body;
        console.log(appointment_time, nurse_id, baby_id);
        const now = new Date();

        const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        const date = now.toISOString();
        console.log(date);

        if ( (date) > (appointment_time.date)) {
            return res.status(409).json({ message:'התאריך הנוכחי מאוחר יותר מהתאריך הקיים.'});
        } 
        const appointment = new Appointment({
            baby_id: baby_id,
            appointment_time,
            nurse_id,
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
const updateAppointment = async (req, res) => {
    try {
        const { _id, appointment_time, status } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findById(_id).exec();
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' });
        }

        appointment.appointment_time = appointment_time || appointment.appointment_time;
        appointment.status = status || appointment.status;

        await appointment.save();
        return res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating appointment', error });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { _id } = req.params;
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, 'your-secret-key');
        if (!_id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findById(_id).exec();
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' });
        }
        if (appointment.user_id.toString() !== decoded.userId) {
            return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
        }
        appointment.status = 'מבוטל';
        await appointment.save();
        return res.status(200).json({ message: 'Appointment change status' });
    } catch (error) {
        console.error("Error in cancelAppointment:", error);
        return res.status(500).json({ message: 'Error canceling appointment', error });
    }
};

const getAppointmentById = async (req, res) => {
    const { _id } = req.params
    const Appointments = await Appointment.findById(_id).lean()
    if (!Appointments || !_id) {
        return res.status(400).json({ message: 'No Appointment found' })
    }
    res.json(Appointments)
}
const getAppointmentsByDate = async (req, res) => {
    console.log("the token:");
    console.log(req.headers['authorization']);
    try {

        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'No token provided' }); 
        }

        jwt.verify(token, 'your-secret-key', async (err, decoded) => { 
            console.log("Decoded token:", decoded); 

            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = decoded; 

            const { date } = req.params;
            if (!date) {
                return res.status(400).json({ message: "Date parameter is required" });
            }

            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            const appointments = await Appointment.find({
                appointment_time: { $gte: selectedDate, $lt: nextDay } 
            }).lean();


            if (!appointments.length) {
                return res.status(404).json({ message: 'No appointments found for this date' });
            }

            return res.json(appointments);
        });

    } catch (error) {

        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAppointmentByNurseId = async (req, res) => {
    const { nurse_id } = req.params

    if (!nurse_id) {
        return res.status(400).json({ message: "יש לספק מזהה אחות  ." });
    }

    const Appointments = await Appointment.find({ nurse_id: nurse_id });
    console.log(Appointments);

    if (!Appointments) {
        return res.status(400).json({ message: 'No Appointment found' })
    }
    res.json(Appointments)
}
const getAppointmentByBabyId = async (req, res) => {
    const { baby_id } = req.params

    if (!baby_id) {
        return res.status(400).json({ message: "יש לספק מזהה אחות  ." });
    }

    const Appointments = await Appointment.find({ baby_id: baby_id });
    console.log(Appointments);

    if (!Appointments) {
        return res.status(400).json({ message: 'No Appointment found' })
    }
    res.json(Appointments)
}

const deleteAppointment = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) {
            return res.status(400).json({ message: 'Appointment  ID is required' })
        }

        const appointment = await Appointment.findById(_id).exec()
        console.log("appointment" + appointment + "_id" + _id);
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' })
        }

        await appointment.deleteOne()
        return res.status(200).json({ message: `Appointment with ID ${_id} deleted` })
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting Appointment', error })
    }
}

const updateAppointmentStatus = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findById(_id).exec();
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = "completed"

        await appointment.save();
        return res.status(200).json({ message: 'Appointment status updated successfully', appointment });
    } catch (error) {
        console.error("Error in updateAppointmentStatus:", error);
        return res.status(500).json({ message: 'Error updating appointment status', error });
    }
};
module.exports = {
    createNewAppointments,
    getAllAppointments,
    updateAppointment,
    cancelAppointment,
    getAppointmentById,
    getAppointmentsByDate,
    getAppointmentByNurseId,
    getAppointmentByBabyId,
    deleteAppointment,
    updateAppointmentStatus
}
