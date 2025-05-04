import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import "./ChatParent.css"; 

const socket = io("http://localhost:7002");

export default function ChatNurse() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const userName = useSelector((state) => state.token.user.name); // שם המשתמש
    const userRole = useSelector((state) => state.token.user.role); // תפקיד המשתמש
    const chatRoomId = "unique-parent-id"; // מזהה ייחודי לצ'אט (יש להתאים לפי ההורה)

    useEffect(() => {
        // הצטרפות לחדר
        socket.emit("joinRoom", { chatRoomId, userName, userRole });

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
                text: `אחות ${userName} עונה: ${message}`, // הוספת שם האחות
                user: userName, 
                userRole
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
        <div className="chat-container"> {/* הוספת קלאס CSS לצ'אט */}
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
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
