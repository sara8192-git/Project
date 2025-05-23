const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const multer = require("multer");
const path = require("path");

const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Both identity and password are required' })
        }

        const foundUser = await User.findOne({ email }).lean()
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized - Invalid email' })
        }
        if (!password || !foundUser.password) {
            throw new Error('Password or hash is missing');
        }

        console.log(password + "    " + foundUser.password);
        const match = await bcrypt.compare(password, foundUser.password)
        console.log(match);
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
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)

        res.json({ accessToken, user: foundUser })

    } catch (error) {
        console.error(" שגיאה במהלך לוגין:", error);
        return res.status(500).json({ message: 'Error during login', error })
    }
}


const register = async (req, res) => {
    try {
        const { identity, name, email, password, role } = req.body; 
        console.log("role" + role);
        if (!identity || !name || !email || !password) {
            return res.status(400).json({ message: 'כל השדות חובה' });
        }
        const isNumeric = !isNaN(identity) && Number.isInteger(Number(identity));

        if (!isNumeric) {
            return res.status(409).json({message:"ה-תז מכיל תווים שאינם מספרים"});

        } 
        
        const dupliemail = await User.findOne({ email: email }).lean();
        if (dupliemail) {
            return res.status(409).json({ message: 'המייל הנוכחי שייך למשתמש שונה' });
        }

        const nameRegex = /^[a-zA-Zא-ת]+(?: [a-zA-Zא-ת]+)*$/u; // ביטוי רגולרי: אותיות באנגלית, בעברית ורווחים
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: 'שם יכול להכיל רק אותיות באנגלית, בעברית ורווחים בלבד' });
        }

        const duplicate = await User.findOne({ identity }).lean();
        if (duplicate) {
            return res.status(409).json({ message: 'קיים משתמש עם התז הנוכחי' });
        }

        let profilePicturePath = null;
        if (req.file) {
            profilePicturePath = `/uploads/${req.file.filename}`;
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const userRole = role ? role : "Parent";

        const userObject = {
            identity,
            name,
            email,
            password: hashedPwd,
            profilePicture: profilePicturePath, 
            role: userRole 
        };

        const user = await User.create(userObject);

        if (user) {
            return res.status(201).json({
                message: `New user ${user.identity} created successfully`,
                user,
            });
        } else {
            return res.status(400).json({ message: 'Error creating user' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error during registration', error: err.message });
    }
};

module.exports = { login, register }