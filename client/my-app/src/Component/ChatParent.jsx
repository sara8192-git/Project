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
    const userRole = useSelector((state) => state.token.user.role); // שליפת תפקיד המשתמש
    const chatRoomId = "unique-parent-id"; // מזהה ייחודי לצ'אט (יש להתאים לפי ההורה)

    useEffect(() => {
        // הצטרפות לחדר
        socket.emit("joinRoom", { chatRoomId, userName, userRole });

        // קבלת הודעות מהשרת
        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("newMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "") {
            const newMessage = { 
                chatRoomId, 
                text: message, 
                user: userName, // שם המשתמש
                userRole // תפקיד המשתמש
            };

            // שליחת ההודעה לשרת
            socket.emit("sendMessage", newMessage);

            // הוספת ההודעה למערך ההודעות מקומית
            setMessages((prev) => [...prev, newMessage]);

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
