import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

export default function ChatParent() {
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
    if (!newMessage) return;
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
    <div className="p-4 flex justify-content-center">
      <Card title="📩 הצ'אט שלך" className="w-full md:w-8 border-round-3xl shadow-4">
        <div className="p-3 border-1 surface-200 border-round mb-3" style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}>
          {messages.length ? messages.map(messageBubble) : <div className="text-center text-600">אין הודעות עדיין</div>}
        </div>

        <div className="flex gap-2">
          <InputText
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="הקלד הודעה..."
            className="flex-1 p-inputtext-lg border-round-xl"
          />
          <Button
            label="שלח"
            icon="pi pi-send"
            className="p-button-rounded p-button-lg p-button-primary"
            onClick={sendMessage}
          />
        </div>
      </Card>
    </div>
  );
}
