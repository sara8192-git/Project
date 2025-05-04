import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux"; // 🔹 ייבוא Redux
import "./ChatParent.css"; // עיצוב הצ'אט

const socket = io("http://localhost:7002"); // כתובת השרת שלך

export default function ChatParent() {
    const [message, setMessage] = useState(""); // הודעה חדשה
    const [messages, setMessages] = useState([]); // רשימת ההודעות

    // 🔹 שליפת שם המשתמש מ-Redux
    const userName = useSelector((state) => state.token.user.name); 

    useEffect(() => {
        const chatRoomId = "example-room-id"; // מזהה החדר (יש לעדכן)
        socket.emit("joinRoom", chatRoomId); // התחברות לחדר

        // האזנה להודעות חדשות מהשרת
        socket.on("newMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // ניקוי מאזינים כשעוזבים את הרכיב
        return () => {
            socket.off("newMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "") {
            const chatRoomId = "example-room-id"; // מזהה החדר (יש לעדכן)
            const newMessage = { 
                chatRoomId, 
                text: message, 
                user: userName // 🔹 שליחת שם המשתמש יחד עם ההודעה
            };

            // הוספת ההודעה למערך ההודעות באופן מקומי
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // שליחת ההודעה לשרת
            socket.emit("sendMessage", newMessage);

            // ניקוי שדה ההודעה
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}