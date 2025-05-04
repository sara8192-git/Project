const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const nodemailer = require("nodemailer");
const messageRoutes = require('./Routes/messageRoutes');
const chatRoomRoutes = require('./Routes/chatRoomRoutes');
const path = require('path');

const PORT = process.env.PORT || 7002;

const app = express();
connectDB();
const http = require('http');
const server = http.createServer(app);

// 🔹 WebSocket Integration
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*', // ניתן להחליף בכתובת ה-Frontend שלך
  }
});

// 🔹 Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // כשהמשתמש מצטרף לחדר
    socket.on('joinRoom', (chatRoomId) => {
        console.log(`User ${socket.id} joined room ${chatRoomId}`);
        socket.join(chatRoomId);
    });

    // כשהמשתמש שולח הודעה
    socket.on('sendMessage', (message) => {
        console.log(`Message sent to room ${message.chatRoomId} by ${message.user}:`, message.text);
        
        // שידור ההודעה לחדר (לכלל המשתמשים בחדר מלבד השולח)
        socket.to(message.chatRoomId).emit('newMessage', message);
    });

    // כשהמשתמש מתנתק
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// הגדרת הטרנספורטר לשליחת מיילים
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // האימייל של השרת
        pass: process.env.EMAIL_PASS  // הסיסמה של השרת
    }
});

// שליחת מייל לאחר הרשמה
const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "נרשמת בהצלחה לטיפת חלב!",
        text: `שלום ${name},\n\nברוך הבא לטיפת חלב! ההרשמה שלך הושלמה בהצלחה.\n\nבברכה, צוות טיפת חלב.`
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log("מייל נשלח בהצלחה ל-", email);
    } catch (error) {
        console.error("שגיאה בשליחת מייל:", error);
    }
};

// חיבור לנתיבים
app.use("/user", require("./Routes/UserRout"));
app.use("/appointment", require("./Routes/AppointmentRout"));
app.use("/baby", require("./Routes/BabiesRout"));
app.use("/testResults", require("./Routes/TestResultRout"));
app.use("/auth", require("./Routes/authRoutes"));
app.use("/nurseScheduler", require("./Routes/NurseScheduleroute"));
app.use('/messages', messageRoutes);
app.use('/chatrooms', chatRoomRoutes);

// התחברות למסד נתונים והרצת השרת
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    // הפעלת השרת HTTP + WebSocket
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", err => {
    console.log(err);
});