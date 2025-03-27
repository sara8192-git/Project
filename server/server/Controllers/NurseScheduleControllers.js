const NurseSchedule = require('../models/NurseSchedule')

// const createNewNurseSchedule = async (req, res) => {
//     try {
//         const { nurse_id, start_time, end_time } = req.body
//         if (!nurse_id || !start_time || !end_time) {
//             return res.status(400).json({ message: 'nurse_id, start_time, and end_time are required' })
//         }

//         // בדיקת לוח זמנים קיים
//         const existingSchedule = await NurseSchedule.findOne({ nurse_id, start_time })
//         if (existingSchedule) {
//             return res.status(400).json({ message: 'Schedule already exists for this nurse at this time' })
//         }

//         const schedule = await NurseSchedule.create({ nurse_id, start_time, end_time })
//         return res.status(201).json({ message: 'New Nurse schedule created', schedule })
//     } catch (error) {
//         return res.status(500).json({ message: 'Error creating nurse schedule', error })
//     }
// }

//    const getAllNurseSchedule = async (req, res) => {

//     try {
//         const schedules = await NurseSchedule.find().lean()
//         if (!schedules?.length) {
//             return res.status(400).json({ message: 'No nurse schedules found' })
//         }
//         res.json(schedules)
//     } catch (error) {
//         return res.status(500).json({ message: 'Error fetching nurse schedules', error })
//     }
// }
//    const updateNurseSchedule = async (req, res) => {
//     try {
//         const { _id, nurse_id, start_time, end_time } = req.body

//         if (!_id) {
//             return res.status(400).json({ message: 'Schedule ID is required' })
//         }

//         const schedule = await NurseSchedule.findById(_id).exec()
//         if (!schedule) {
//             return res.status(400).json({ message: 'Schedule not found' })
//         }

//         schedule.nurse_id = nurse_id || schedule.nurse_id
//         schedule.start_time = start_time || schedule.start_time
//         schedule.end_time = end_time || schedule.end_time

//         const updatedSchedule = await schedule.save()

//         return res.status(200).json({ message: `'${updatedSchedule.nurse_id}' schedule updated`, updatedSchedule })
//     } catch (error) {
//         return res.status(500).json({ message: 'Error updating nurse schedule', error })
//     }
// }

//     const deleteNurseSchedule = async (req, res) => {
//         try {
//             const { _id } = req.params

//             if (!_id) {
//                 return res.status(400).json({ message: 'Schedule ID is required' })
//             }

//             const schedule = await NurseSchedule.findById(_id).exec()
//             if (!schedule) {
//                 return res.status(400).json({ message: 'Schedule not found' })
//             }

//             await schedule.deleteOne()
//             return res.status(200).json({ message: `Schedule with ID ${_id} deleted` })
//         } catch (error) {
//             return res.status(500).json({ message: 'Error deleting nurse schedule', error })
//         }
//     }


//     const getNurseScheduleById = async (req, res) => {
//         try {
//             const { _id } = req.params

//             if (!_id) {
//                 return res.status(400).json({ message: 'Schedule ID is required' })
//             }

//             const schedule = await NurseSchedule.findById(_id).lean()
//             if (!schedule) {
//                 return res.status(400).json({ message: 'No schedule found' })
//             }
//             res.json(schedule)
//         } catch (error) {
//             return res.status(500).json({ message: 'Error fetching nurse schedule', error })
//         }
//     }
//     // קבלת לוח זמנים לפי מזהה אחות
// const getSchedulesByNurseId = async (req, res) => {
//     try {
//         const { nurse_id } = req.params

//         if (!nurse_id) {
//             return res.status(400).json({ message: 'Nurse ID is required' })
//         }

//         const schedules = await NurseSchedule.find({ nurse_id }).lean()
//         if (!schedules?.length) {
//             return res.status(400).json({ message: 'No schedules found for this nurse' })
//         }
//         res.json(schedules)
//     } catch (error) {
//         return res.status(500).json({ message: 'Error fetching schedules for nurse', error })
//     }
// }
// פונקציה ליצירת שעות עבודה (חצי שעה הפרש)
const generateTimeSlots = (startTime, endTime, interval = 30) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    let starttime = startHours * 60 + startMinutes; // in minutes
    let endtime = endHours * 60 + endMinutes; // in minutes
    let currentTime = starttime;

    const slots = [];
    while (currentTime < endtime) {
        let hours = Math.floor(currentTime / 60);
        let minutes = currentTime % 60;
        let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        slots.push({ time: formattedTime, is_booked: false });
        currentTime += interval;
    }
  
    return slots;
};
//  יצירת מערכת שעות לאחות
const createScheduleForNurse = async (req, res) => {
    try {
        const { identity, workingDay, startTime, endTime } = req.body;
        // בדיקות ולידציה
        if (!identity || !workingDay || startTime === undefined || endTime === undefined) {
            return res.status(400).json({ message: "חובה לספק את כל השדות: nurseId, workingDay, startTime, endTime" });
        }


        // if (isNaN(startTime) || isNaN(endTime) || startTime < 0 || startTime >= 1440 || endTime <= 0 || endTime > 1440) {
        //     return res.status(400).json({ message: "שעות העבודה חייבות להיות בטווח 0-1440 דקות." });
        // }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "שעת הסיום חייבת להיות אחרי שעת ההתחלה." });
        }

        // בדיקה אם כבר קיימת מערכת שעות לאותו יום
        const existingSchedule = await NurseSchedule.findOne({ identity: identity, working_day: new Date(workingDay) });
        if (existingSchedule) {
            return res.status(400).json({ message: "כבר קיימת מערכת שעות לאחות בתאריך זה." });
        }

        const availableSlots = generateTimeSlots(startTime, endTime);
        console.log(availableSlots);

        const schedule = new NurseSchedule({
            identity: identity,
            working_day: new Date(workingDay),
            available_slots: availableSlots
        });

        await schedule.save();
        res.status(201).json({ message: "מערכת שעות נוצרה בהצלחה!", schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🎯 שליפת שעות פנויות של אחות ביום מסוים
const getAvailableSlots = async (req, res) => {
    try {
        const { nurseId, date } = req.query;

        // בדיקות ולידציה
        if (!nurseId || !date) {
            return res.status(400).json({ message: "יש לספק מזהה אחות ותאריך." });
        }

        const schedule = await NurseSchedule.findOne({ nurse_id: nurseId, working_day: new Date(date) });

        if (!schedule) {
            return res.status(404).json({ message: "לא נמצאה מערכת שעות לאחות בתאריך זה." });
        }

        const availableSlots = schedule.available_slots.filter(slot => !slot.is_booked);
        res.status(200).json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🎯 הזמנת שעה מסוימת (עדכון סטטוס)
const bookSlot = async (req, res) => {
    try {
        const { nurseId, date, selectedTime } = req.body;

        // בדיקות ולידציה
        if (!nurseId || !date || !selectedTime) {
            return res.status(400).json({ message: "יש לספק מזהה אחות, תאריך ושעת תור." });
        }

        const schedule = await NurseSchedule.findOne({ nurse_id: nurseId, working_day: new Date(date) });

        if (!schedule) {
            return res.status(404).json({ message: "לא נמצאה מערכת שעות לאחות בתאריך זה." });
        }

        const slotIndex = schedule.available_slots.findIndex(slot => slot.time === selectedTime);
        if (slotIndex === -1) {
            return res.status(400).json({ message: "השעה שנבחרה אינה קיימת במערכת." });
        }

        if (schedule.available_slots[slotIndex].is_booked) {
            return res.status(400).json({ message: "השעה כבר נתפסה, אנא בחר שעה אחרת." });
        }

        schedule.available_slots[slotIndex].is_booked = true;
        await schedule.save();

        res.status(200).json({ message: "התור נשמר בהצלחה!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateTimeSlots,
    createScheduleForNurse,
    getAvailableSlots,
    bookSlot
    //         createNewNurseSchedule,
    //          getAllNurseSchedule,
    //          updateNurseSchedule ,
    //          deleteNurseSchedule,
    //          getNurseScheduleById,
    //          getSchedulesByNurseId//רק הוספתי פה בלי ברוטר והמידל...
}
