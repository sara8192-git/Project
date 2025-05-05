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
let messages = []; // Array to store messages

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // כשהמשתמש מצטרף לחדר
    socket.on('joinRoom', ({ chatRoomId, userName, userRole }) => {
        console.log(`User ${userName} (${userRole}) joined room ${chatRoomId}`);
        socket.join(chatRoomId); // הצטרפות לחדר

        // שליחה של הודעות קודמות
        const roomMessages = messages.filter(msg => msg.chatRoomId === chatRoomId);
        socket.emit('previousMessages', roomMessages);
    });

    // כשהמשתמש שולח הודעה
    socket.on('sendMessage', (message) => {
        // console.log(`Message sent to room ${message.chatRoomId} by ${message.user}:`, message.text);
        message.timestamp = new Date().toISOString();

        // שמירת ההודעה בזיכרון
        messages.push(message);

        // שידור ההודעה לחדר (לכלל המשתמשים בחדר מלבד השולח)
        socket.broadcast.to(message.chatRoomId).emit('newMessage', message);
        socket.emit('newMessage', message);    });

    // כשהמשתמש מתנתק
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 הגדרת נתיב API לשליפת רשימת אחיות
app.get("/nurses", async (req, res) => {
    try {
        const nurses = await mongoose.model("User").find({ role: "Nurse" }, "name _id");
        res.status(200).json(nurses);
    } catch (error) {
        console.error("Error fetching nurses:", error);
        res.status(500).json({ error: "Failed to fetch nurses" });
    }
});

// 🔹 הגדרת נתיב API לשליפת רשימת הורים
app.get("/parents", async (req, res) => {
    try {
        const parents = await mongoose.model("User").find({ role: "Parent" }, "name _id");
        res.status(200).json(parents);
    } catch (error) {
        console.error("Error fetching parents:", error);
        res.status(500).json({ error: "Failed to fetch parents" });
    }
});

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