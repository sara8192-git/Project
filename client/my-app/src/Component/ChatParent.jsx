import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import "./ChatParent.css";

const socket = io("http://localhost:7002");

export default function ChatParent() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedNurse, setSelectedNurse] = useState("");
    const [nurses, setNurses] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({}); // מעקב אחר הודעות חדשות
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
                if (message.chatRoomId !== chatRoomId) {
                    // אם ההודעה מיועדת לחדר אחר, עדכן מצב של הודעה חדשה
                    setUnreadMessages((prev) => ({
                        ...prev,
                        [message.chatRoomId]: true
                    }));
                } else {
                    setMessages((prev) => [...prev, message]);
                }
            });

            return () => {
                socket.off("newMessage");
            };
        }
    }, [selectedNurse]);

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
            [`${userName}-${nurseName}`]: false // מנקה הודעות חדשות לחדר הנבחר
        }));
    };

    return (
        <div className="chat-container">
            <div className="nurse-selection">
                <label>בחר אחות:</label>
                <select onChange={(e) => selectNurse(e.target.value)} value={selectedNurse}>
                    <option value="">--בחר--</option>
                    {nurses.map((nurse) => (
                        <option key={nurse._id} value={nurse.name}>
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