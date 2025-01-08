const Babies = require("../models/Babies")

const creatNewBabie = async (req, res) => {
    {
        const { identity, name, dob, parent_id} = req.body
        if (!identity || !name || !dob || !parent_id )
            return res.status(400).json({ message:'Mandatory fields' })
        const baby = await Babies.create({identity, name, dob, parent_id})
        if (baby) {
            return res.status(201).json({ message: 'New baby created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid baby ' })
        }
    }
}

const getAllBabies = async (req, res) => {
    const babies = await Babies.find().lean()
    if (!babies?.length) {
        return res.status(400).json({ message: 'No babies found' })
    }
    res.json(babies)
}


const updateBabies = async (req, res) => {
    const {_id,identity, name, dob, parent_id} = req.body

    if (!_id) {
        return res.status(400).json({ message: "There is no Babies with this id" })
    }

    const baby = await Babies.findById(_id).exec()
    if (!baby) {
        return res.status(400).json({ message: 'baby not found' })
    }
    baby.identity = identity
    baby.name = name
    baby.dob = dob
    baby.parent_id = parent_id
    const updatedbaby = await baby.save()
    res.json(`'${updatedbaby.identity}' updated`)
}


const deleteBabies = async (req, res) => {
    const {_id} = req.params
    const baby = await Babies.findById(_id).exec()
    if (!baby) {
        return res.status(400).json({ message: 'user not found' })
    }
    const result = await baby.deleteOne()
    const reply = ` ID ${_id} deleted`
    res.json(reply)
}


const getBabiesById = async (req, res) => {
    const {_id} = req.params
    const baby = await Babies.findById(_id).lean()
    if (!baby) {
        return res.status(400).json({ message: 'No baby found' })
    }
    res.json(baby)
}


module.exports = {
    creatNewBabie,
    getAllBabies,
    updateBabies,
    deleteBabies,
    getBabiesById  
}