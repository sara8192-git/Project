const Users = require("../models/User")

const creatNewUsers = async (req, res) => {
    {
        const { identity, name, email, password, role } = req.body
        if (!identity || !name || !email || !password || !role)
            return res.status(400).json({ message:'Mandatory fields' })
        const user = await Users.create({identity, name, email, password, role})
        if (user) {
            return res.status(201).json({ message: 'New user created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid user ' })
        }
    }
}

const getAllUsers = async (req, res) => {
    const users = await Users.find().lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
}


const updateUser = async (req, res) => {
    const {_id,identity, name, email, role} = req.body

    if (!_id) {
        return res.status(400).json({ message: "There is no user with this id" })
    }

    const user = await Users.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }
    if(identity)
        user.identity = identity
    if(name)
        user.name = name
    if(email)
        user.email = email
    if(role)
         user.role = role
    const updatedUser = await user.save()
    res.json(`'${updatedUser.name}' updated`)
}


const deleteUser = async (req, res) => {
    const {_id} = req.params
    const user = await Users.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }
    const result = await user.deleteOne()
    const reply = ` ID ${_id} deleted`
    res.json("user delete successfully")
}


const getUserById = async (req, res) => {
    const {_id} = req.params
    const user = await Users.findById(_id).lean()
    if (!user) {
        return res.status(400).json({ message: 'No user found' })
    }
    res.json(user)
}


module.exports = {
    getAllUsers,
    creatNewUsers,
    getUserById,
    updateUser,
    deleteUser
    
}