import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
 
export default function ChatNurse() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get('/messages/lastMessages', { withCredentials: true });
    setMessages(res.data);
  };

  const sendMessage = async () => {
    await axios.post('/messages', { content: newMessage, chatRoomId: 'ID-פה-של-הצאט' }, { withCredentials: true });
    setNewMessage('');
    fetchMessages();
  };
  const messageBubble = (msg, index) => (
    <div
      key={index}
      className={`p-2 mb-2 border-round-lg shadow-1 text-white flex ${
        msg.senderId.role === 'parent' ? 'justify-content-end' : 'justify-content-start'
      }`}
      style={{
        backgroundColor: msg.senderId.role === 'parent' ? '#3f51b5' : '#f48fb1',
        maxWidth: '70%',
        alignSelf: msg.senderId.role === 'parent' ? 'flex-end' : 'flex-start',
      }}
    >
      <div>
        <div className="text-xs font-bold mb-1">{msg.senderId.name}</div>
        <div>{msg.content}</div>
      </div>
    </div>
  );
  return (
    
    <div className="p-4">
      <h2>📩 צ'אט עם הורים</h2>
      <div className="border rounded p-3 mb-3" style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.senderId.name}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="הקלד הודעה..."
        className="p-inputtext p-component p-mr-2"
      />
      <Button label="שלח" icon="pi pi-send" onClick={sendMessage} />
    </div>
  );
}
