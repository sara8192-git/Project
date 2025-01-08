const NurseSchedule = require('../models/NurseSchedule')

const createNewNurseSchedule = async (req, res) => {
    const {nurse_id,working_day,satrt_time,end_time} = req.body
    if (!nurse_id || !working_day || !satrt_time || !end_time )  
        return res.status(400).json({ message: 'reqired field' })

    const nurseSchedule = await NurseSchedule.create({nurse_id,working_day,satrt_time,end_time})

    if (nurseSchedule) { // Created
        return res.status(201).json({ message: 'New NurseSchedule created' })
        } else {
        return res.status(400).json({ message: 'Invalid NurseSchedule ' })}
   }

   const getAllNurseSchedule = async (req, res) => {

    const nurseSchedule = await NurseSchedule.find().lean()
    if (!nurseSchedule?.length) {
        return res.status(400).json({ message: 'No nurseSchedule found' })
        }
        res.json(nurseSchedule)
        
   }
   const updateNurseSchedule = async (req, res) => {
    const {nurse_id,working_day,satrt_time,end_time,_id}= req.body
    // Confirm data
    if (!_id) {
        return res.status(400).json({ message: "There is no user with this id" })
    }

    const nurseSchedule = await NurseSchedule.findById(_id).exec()
    if (!nurseSchedule) {
        return res.status(400).json({ message: 'nurseSchedule not found' })
    }
    if(nurse_id)
        nurseSchedule.nurse_id = nurse_id
    if(working_day)
        nurseSchedule.working_day = working_day
    if(satrt_time)
        nurseSchedule.satrt_time = satrt_time
    if(end_time)
         nurseSchedule.end_time = end_time
    const updateNurseSchedule = await nurseSchedule.save()
    res.json(`'${updateNurseSchedule.nurse_id}' updated`)
}
    const deleteNurseSchedule = async (req, res) => {
        const { _id } = req.params
        // Confirm task exists to delete
        const nurseSchedule = await NurseSchedule.findById(_id).exec()
        if (!_id) {
        return res.status(400).json({ message: 'NurseSchedule not found' })
        }
        const result = await NurseSchedule.deleteOne()
        const reply=`ID ${_id} deleted`
        //const newAppointment= await Appointment.find().lean()
        res.json(reply)
    }

    const getNurseScheduleById = async (req, res) => {
        const {_id} = req.params
        // Get single task from MongoDB
        const nurseSchedule = await NurseSchedule.findById(_id).lean()
        // If no tasks
        if (!nurseSchedule || !_id) {
        return res.status(400).json({ message: 'No nurseSchedule found' })
        }
        res.json(nurseSchedule)
    }

    

    module.exports = {
        createNewNurseSchedule,
         getAllNurseSchedule,
         updateNurseSchedule ,
         deleteNurseSchedule,
         getNurseScheduleById
        }
