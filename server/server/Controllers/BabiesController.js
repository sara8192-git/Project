

const User = require("../models/User")
const Babies = require("../models/Babies")

const creatNewBaby = async (req, res) => {
    try {
        const { identity, name, dob, parent_id } = req.body
        if (!identity || !name || !dob || !parent_id)
            return res.status(400).json({ message: 'Mandatory fields are required' })
        const baby = await Babies.create({ identity, name, dob, parent_id })
        if (baby) {
            const parent = await User.findById(parent_id);
            if (parent) {
                parent.babies.push(baby._id);
                await parent.save();
            }
            return res.status(201).json({ message: 'New baby created', baby })
        } else {
            return res.status(400).json({ message: 'Invalid baby' })
        }
    } catch (error) {
        console.error("Error creating baby:", error);
        return res.status(500).json({ message: 'Error creating baby', error: error.message });
    }
}
const getBabiesByParent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const babies = await Babies.find({ parent_id: parentId });
        res.status(200).json(babies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching babies', error });
    }
}
const getAllBabies = async (req, res) => {
    try {
        const babies = await Babies.find().lean()
        if (!babies?.length) {
            return res.status(400).json({ message: 'No babies found' })
        }
        res.json(babies)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching babies', error })
    }
}


const updateBabies = async (req, res) => {
    try {
        const { _id, identity, name, dob, parent_id } = req.body

        if (!_id) {
            return res.status(400).json({ message: 'Baby ID is required' })
        }

        const baby = await Babies.findById(_id).exec()
        if (!baby) {
            return res.status(400).json({ message: 'Baby not found' })
        }

        baby.identity = identity || baby.identity
        baby.name = name || baby.name
        baby.dob = dob || baby.dob
        baby.parent_id = parent_id || baby.parent_id

        const updatedBaby = await baby.save()
        res.json(`'${updatedBaby.identity}' updated`)
    } catch (error) {
        return res.status(500).json({ message: 'Error updating baby', error })
    }
}

const deleteBaby = async (req, res) => {
    try {
        const { _id } = req.params
        const baby = await Babies.findById(_id).exec()
        if (!baby) {
            return res.status(400).json({ message: 'Baby not found' })
        }
        await baby.deleteOne()
        res.json(`ID ${_id} deleted`)
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting baby', error })
    }
}

// const deleteBabiesOutOfAge = async (req, res) => {
//     try {
//         const baby = await Babies.findById(_id).exec()
//         if (!baby) {
//             return res.status(400).json({ message: 'Baby not found' })
//         }
//         await baby.deleteOne()
//         res.json(`ID ${_id} deleted`)
//     } catch (error) {
//         return res.status(500).json({ message: 'Error deleting baby', error })
//     }
// }

const getBabiesById = async (req, res) => {
    try {
        const { _id } = req.params
        const baby = await Babies.findById(_id).lean()
        if (!baby) {
            return res.status(400).json({ message: 'No baby found' })
        }
        res.json(baby)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching baby', error })
    }

}
const getWeightsByBabyId = async (req, res) => {
    const {id } = req.params; // קבלת ה-ID מהפרמטרים של ה-URL
console.log(id);
    try {
        // חיפוש התינוק לפי ID
        const baby = await Babies.findById(id);

        // בדיקה אם התינוק לא נמצא
        if (!baby) {
            return res.status(404).json({ message: 'Baby not found' });
        }

        // יצירת מערך של כל המשקלים של התינוק
        const weights = baby.messure.map(measure => measure.weight);

        res.status(200).json({ weights });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching weights for the baby' });
    }
};
const getHightssByBabyId = async (req, res) => {
    const {id } = req.params; // קבלת ה-ID מהפרמטרים של ה-URL
console.log(id);
    try {
        // חיפוש התינוק לפי ID
        const baby = await Babies.findById(id);

        // בדיקה אם התינוק לא נמצא
        if (!baby) {
            return res.status(404).json({ message: 'Baby not found' });
        }

        // יצירת מערך של כל המשקלים של התינוק
        const weights = baby.messure.map(measure => measure.height);

        res.status(200).json({ height });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching height for the baby' });
    }
};
const addMeasurement = async (req, res) => {
    try {
        const { identity, height, weight } = req.body
        console.log( identity, height, weight);
        if (!identity || !height || !weight)
            return res.status(400).json({ message: 'All fields are required' })
    
        const baby = await Babies.findById(identity)
        if (!baby)
            return res.status(404).json({ message: 'Baby not found' })

        // מחפש אם יש כבר measurements ומעדכן אם כן
        baby.messure.push({ height, weight });
        await baby.save();


        res.status(200).json({ message: 'Measurement updated successfully', result: baby.result })

    } catch (error) {
        res.status(500).json({ message: 'Error adding measurement', error: error.message })
    }
}
module.exports = {
    creatNewBaby,
    getAllBabies,
    updateBabies,
    deleteBaby,
    getBabiesById,
    getBabiesByParent,
    addMeasurement,
    getWeightsByBabyId,
    getHightssByBabyId
    
}

