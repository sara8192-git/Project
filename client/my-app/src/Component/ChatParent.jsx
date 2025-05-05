import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import sound from "../sounds/notification.wav";

const socket = io("http://localhost:7002");

export default function ChatParent() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedNurse, setSelectedNurse] = useState("");
    const [nurses, setNurses] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [highlightedSender, setHighlightedSender] = useState(""); // שולח מודגש
    const userName = useSelector((state) => state.token.user.name);
    const userRole = useSelector((state) => state.token.user.role);
    const chatRoomId = `${userName}-${selectedNurse}`;

    useEffect(() => {
        const fetchNurses = async () => {
            try {
                const response = await axios.get("http://localhost:7002/nurses");
                setNurses(response.data);
            } catch (error) {
                console.error("Error fetching nurses:", error);
            }
        };
        fetchNurses();
    }, []);

    useEffect(() => {
        if (selectedNurse) {
            socket.emit("joinRoom", { chatRoomId, userName, userRole });

            socket.on("previousMessages", (msgs) => {
                setMessages(msgs);
            });

            socket.on("newMessage", (message) => {
                // אם ההודעה לא קשורה לחדר הצ'אט הנוכחי, אז אנחנו רק מעדכנים את מצב ההודעות הלא נקראות
                if (message.chatRoomId !== chatRoomId) {
                    setUnreadMessages((prev) => ({
                        ...prev,
                        [message.chatRoomId]: true
                    }));
                } else {
                    // כאן אנחנו דואגים לא להוסיף את ההודעה פעמיים אם היא כבר קיימת
                    if (!messages.some(msg => msg.timestamp === message.timestamp)) {
                        setMessages((prev) => [...prev, message]);
                        setHighlightedSender(message.user); // עדכון השולח המודגש
                    }
                }
            });

            return () => {
                socket.off("newMessage");
            };
        }
    }, [selectedNurse, messages]); // הוספת messages כ-dependency

    const playSound = () => {
        const audio = new Audio(sound);
        audio.play().catch((error) => {
            console.error("Failed to play sound:", error);
        });
    };

    const sendMessage = () => {
        if (message.trim() !== "" && selectedNurse) {
            const newMessage = {
                chatRoomId,
                text: message,
                user: userName,
                userRole
            };

            socket.emit("sendMessage", newMessage);
            setMessages((prev) => [...prev, newMessage]);
            setMessage("");
            playSound();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const selectNurse = (nurseName) => {
        setSelectedNurse(nurseName);
        setUnreadMessages((prev) => ({
            ...prev,
            [`${userName}-${nurseName}`]: false
        }));
        setHighlightedSender(""); // איפוס הדגשה בבחירת אחות חדשה
    };

    return (
        <div className="chat-container">
            <div className="nurse-selection">
                <label>בחר אחות:</label>
                <select onChange={(e) => selectNurse(e.target.value)} value={selectedNurse}>
                    <option value="">--בחר--</option>
                    {nurses.map((nurse) => (
                        <option
                            key={nurse._id}
                            value={nurse.name}
                            className={highlightedSender === nurse.name ? "highlight" : ""}
                        >
                            {unreadMessages[`${userName}-${nurse.name}`] ? `🔴 ${nurse.name}` : nurse.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedNurse && (
                <>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.userRole === "nurse" ? "nurse-message" : ""}`}>
                                <div className="chat-text">
                                    <strong>{msg.user}:</strong> {msg.text}
                                </div>
                                {msg.timestamp && (
                                    <div className="chat-timestamp">
                                        {new Date(msg.timestamp).toLocaleString("he-IL", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit"
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
}
