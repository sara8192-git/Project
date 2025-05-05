import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import sound from "../sounds/notification.wav";

const socket = io("http://localhost:7002");

export default function ChatNurse() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedParent, setSelectedParent] = useState("");
    const [parents, setParents] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [highlightedSender, setHighlightedSender] = useState(""); // שולח מודגש
    const userName = useSelector((state) => state.token.user.name);
    const userRole = useSelector((state) => state.token.user.role);
    const chatRoomId = `${selectedParent}-${userName}`;

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get("http://localhost:7002/parents");
                setParents(response.data);
            } catch (error) {
                console.error("Error fetching parents:", error);
            }
        };
        fetchParents();
    }, []);

    useEffect(() => {
        if (selectedParent) {
            socket.emit("joinRoom", { chatRoomId, userName, userRole });

            socket.on("previousMessages", (msgs) => {
                setMessages(msgs);
            });

            socket.on("newMessage", (message) => {
                if (message.chatRoomId !== chatRoomId) {
                    setUnreadMessages((prev) => ({
                        ...prev,
                        [message.chatRoomId]: true
                    }));
                } else {
                    setMessages((prev) => [...prev, message]);
                    setHighlightedSender(message.user); // עדכון השולח המודגש
                }
            });

            return () => {
                socket.off("newMessage");
            };
        }
    }, [selectedParent]);

    const playSound = () => {
        const audio = new Audio(sound);
        audio.play().catch((error) => {
            console.error("Failed to play sound:", error);
        });
    };

    const sendMessage = () => {
        if (message.trim() !== "" && selectedParent) {
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

    const selectParent = (parentName) => {
        setSelectedParent(parentName);
        setUnreadMessages((prev) => ({
            ...prev,
            [`${parentName}-${userName}`]: false
        }));
        setHighlightedSender(""); // איפוס הדגשה בבחירת הורה חדש
    };

    return (
        <div className="chat-container">
            <div className="parent-selection">
                <label>בחר הורה:</label>
                <select onChange={(e) => selectParent(e.target.value)} value={selectedParent}>
                    <option value="">--בחר--</option>
                    {parents.map((parent) => (
                        <option
                            key={parent._id}
                            value={parent.name}
                            className={highlightedSender === parent.name ? "highlight" : ""}
                        >
                            {unreadMessages[`${parent.name}-${userName}`] ? `🔴 ${parent.name}` : parent.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedParent && (
                <>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.userRole === "parent" ? "parent-message" : ""}`}>
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