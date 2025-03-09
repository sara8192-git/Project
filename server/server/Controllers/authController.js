const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const login = async (req, res) => {
    try {
        const { identity, password } = req.body
        if (!identity || !password) {
            return res.status(400).json({ message: 'Both identity and password are required' })
        }

        const foundUser = await User.findOne({ identity }).lean()
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized - Invalid identity' })
        }

        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) {
            return res.status(401).json({ message: 'Unauthorized - Invalid password' })
        }

        const userInfo = {
            _id: foundUser._id,
            identity: foundUser.identity,
            name: foundUser.name,
            role: foundUser.role,
            email: foundUser.email
        }

        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.json({ accessToken })
    } catch (error) {
        return res.status(500).json({ message: 'Error during login', error })
    }
}
const register = async (req, res) => {
    try {
        const { identity, name, email, password, role } = req.body
        if (!identity || !name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const duplicate = await User.findOne({ identity }).lean()
        if (duplicate) {
            return res.status(409).json({ message: 'User with this identity already exists' })
        }

        const hashedPwd = await bcrypt.hash(password, 10)
        const userObject = { identity, name, email, role, password: hashedPwd }

        const user = await User.create(userObject)
        if (user) {
            return res.status(201).json({ message: `New user ${user.identity} created successfully` })
        } else {
            return res.status(400).json({ message: 'Error creating user' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error during registration', error })
    }
}

module.exports = { login, register }