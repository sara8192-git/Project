const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const login = async (req, res) => {
    const { identity, password } = req.body
    if (!identity || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ identity }).lean()
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized111' })
    const userInfo = {
        _id: foundUser._id,
        identity: foundUser.identity,
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
}

const register = async (req, res) => {
    const { identity, name, email, password, role } = req.body
    if (!identity || !name || !email || !password || !role) {// Confirm data
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ identity: identity }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate identity" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { identity, name, email, role, password: hashedPwd }
    const user = await User.create(userObject)
    if (user) { // Created
        return res.status(201).json({ message: `New user ${user.identity} created` })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }

}
module.exports = { login, register }