const NurseSchedule = require('../models/NurseSchedule')

const createNewNurseSchedule = async (req, res) => {
    try {
        const { nurse_id, start_time, end_time } = req.body
        if (!nurse_id || !start_time || !end_time) {
            return res.status(400).json({ message: 'nurse_id, start_time, and end_time are required' })
        }

        // בדיקת לוח זמנים קיים
        const existingSchedule = await NurseSchedule.findOne({ nurse_id, start_time })
        if (existingSchedule) {
            return res.status(400).json({ message: 'Schedule already exists for this nurse at this time' })
        }

        const schedule = await NurseSchedule.create({ nurse_id, start_time, end_time })
        return res.status(201).json({ message: 'New Nurse schedule created', schedule })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating nurse schedule', error })
    }
}

   const getAllNurseSchedule = async (req, res) => {

    try {
        const schedules = await NurseSchedule.find().lean()
        if (!schedules?.length) {
            return res.status(400).json({ message: 'No nurse schedules found' })
        }
        res.json(schedules)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching nurse schedules', error })
    }
}
   const updateNurseSchedule = async (req, res) => {
    try {
        const { _id, nurse_id, start_time, end_time } = req.body

        if (!_id) {
            return res.status(400).json({ message: 'Schedule ID is required' })
        }

        const schedule = await NurseSchedule.findById(_id).exec()
        if (!schedule) {
            return res.status(400).json({ message: 'Schedule not found' })
        }

        schedule.nurse_id = nurse_id || schedule.nurse_id
        schedule.start_time = start_time || schedule.start_time
        schedule.end_time = end_time || schedule.end_time

        const updatedSchedule = await schedule.save()

        return res.status(200).json({ message: `'${updatedSchedule.nurse_id}' schedule updated`, updatedSchedule })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating nurse schedule', error })
    }
}

    const deleteNurseSchedule = async (req, res) => {
        try {
            const { _id } = req.params
    
            if (!_id) {
                return res.status(400).json({ message: 'Schedule ID is required' })
            }
    
            const schedule = await NurseSchedule.findById(_id).exec()
            if (!schedule) {
                return res.status(400).json({ message: 'Schedule not found' })
            }
    
            await schedule.deleteOne()
            return res.status(200).json({ message: `Schedule with ID ${_id} deleted` })
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting nurse schedule', error })
        }
    }
    

    const getNurseScheduleById = async (req, res) => {
        try {
            const { _id } = req.params
    
            if (!_id) {
                return res.status(400).json({ message: 'Schedule ID is required' })
            }
    
            const schedule = await NurseSchedule.findById(_id).lean()
            if (!schedule) {
                return res.status(400).json({ message: 'No schedule found' })
            }
            res.json(schedule)
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching nurse schedule', error })
        }
    }
    // קבלת לוח זמנים לפי מזהה אחות
const getSchedulesByNurseId = async (req, res) => {
    try {
        const { nurse_id } = req.params

        if (!nurse_id) {
            return res.status(400).json({ message: 'Nurse ID is required' })
        }

        const schedules = await NurseSchedule.find({ nurse_id }).lean()
        if (!schedules?.length) {
            return res.status(400).json({ message: 'No schedules found for this nurse' })
        }
        res.json(schedules)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching schedules for nurse', error })
    }
}

    module.exports = {
        createNewNurseSchedule,
         getAllNurseSchedule,
         updateNurseSchedule ,
         deleteNurseSchedule,
         getNurseScheduleById,
         getSchedulesByNurseId//רק הוספתי פה בלי ברוטר והמידל...
        }
