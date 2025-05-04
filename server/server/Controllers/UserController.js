const Users = require("../models/User")

const creatNewUsers = async (req, res) => {
    try {
        const { identity, name, email, password, role } = req.body
        if (!identity || !name || !email || !password) {
            return res.status(400).json({ message: 'All fields (identity, name, email, password, role) are required' })
        }

        // בדיקת קיום משתמש קיים לפי אימייל
        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' })
        }

        const user = await Users.create({ identity, name, email, password, role })
        if (user) {
            return res.status(201).json({ message: 'New user created', user })
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error })
    }
}


const getAllUsers = async (req, res) => {
    console.log(req.user);

    try {
        const users = await Users.find().lean()
        if (!users?.length) {
            return res.status(404).json({ message: 'No users found' })
        }
        res.json(users)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error })
    }
}


const updateUser = async (req, res) => {
    try {
        const { _id, identity, name, email, role } = req.body

        if (!_id) {
            return res.status(400).json({ message: "User ID is required" })
        }

        const user = await Users.findById(_id).exec()
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (identity) user.identity = identity
        if (name) user.name = name
        if (email) user.email = email
        if (role) user.role = role

        const updatedUser = await user.save()
        return res.status(200).json({ message: `'${updatedUser.name}' updated successfully`, updatedUser })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user', error })
    }
}



const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params
        if (!_id) {
            return res.status(400).json({ message: "User ID is required" })
        }

        const user = await Users.findById(_id).exec()
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        await user.deleteOne()
        return res.status(200).json({ message: `User with ID ${_id} deleted successfully` })
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error })
    }
}


const getUserById = async (req, res) => {
    try {
        
        const { _id } = req.params
     
        if (!_id) {
            return res.status(400).json({ message: "User ID is required" })
        }
        console.log("before user")
        
        const user = await Users.findById(_id).lean()
        console.log("after user")
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error })
    }
}
const getMyBabies = async (req, res) => {
    try {
        const { parentId } = req.params;
        const user = await Users.findById(parentId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.babies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
 

const getUserByIdentity = async (req, res) => {
    try {
        
        const { identity } = req.params
     
        if (!identity) {
            return res.status(400).json({ message: "User identity is required" })
        }
        console.log("before user")
        
        const user = await Users.findOne({identity:identity}).lean()
        console.log("after user")
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'No User exsist' })
        }
        res.json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error })
    }
}



module.exports = {
    getAllUsers,
    creatNewUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyBabies,
    getUserByIdentity
}
