const TestResults = require("../models/TestResults")

const creatTestResults = async (req, res) => {
    {
        const {baby_id, nurse_id, test_date, result} = req.body
        if (!baby_id || !nurse_id || !test_date || !result)
            return res.status(400).json({ message:'Mandatory fields' })
        const testResults = await TestResults.create({baby_id, nurse_id, test_date, result})
        if (testResults) {
            return res.status(201).json({ message: 'New testResults created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid testResults ' })
        }
    }
}

// const getTestResults = async (req, res) => {
//     const testResults = await TestResults.find().lean()
//     if (!testResults?.length) {
//         return res.status(400).json({ message: 'No testResults found' })
//     }
//     res.json(testResults)
// }


// const updateUser = async (req, res) => {
//     const {_id,identity, name, email, role} = req.body

//     if (!_id) {
//         return res.status(400).json({ message: "There is no user with this id" })
//     }

//     const user = await Users.findById(_id).exec()
//     if (!user) {
//         return res.status(400).json({ message: 'user not found' })
//     }
//     if(identity)
//         user.identity = identity
//     if(name)
//         user.name = name
//     if(email)
//         user.email = email
//     if(role)
//          user.role = role
//     const updatedUser = await user.save()
//     res.json(`'${updatedUser.name}' updated`)
// }


// const deleteUser = async (req, res) => {
//     const {_id} = req.params
//     const user = await Users.findById(_id).exec()
//     if (!user) {
//         return res.status(400).json({ message: 'user not found' })
//     }
//     const result = await user.deleteOne()
//     const reply = ` ID ${_id} deleted`
//     res.json("user delete successfully")
// }


// const getUserById = async (req, res) => {
//     const {_id} = req.params
//     const user = await Users.findById(_id).lean()
//     if (!user) {
//         return res.status(400).json({ message: 'No user found' })
//     }
//     res.json(user)
// }


module.exports = {
    // getAllUsers,
    creatTestResults
    // getUserById,
    // updateUser,
    // deleteUser
    
}