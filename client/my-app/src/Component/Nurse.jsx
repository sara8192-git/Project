import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import QueueSummaryNurse from './QueueSummaryNurse'
import { Route, Routes } from 'react-router-dom'
import ChatNurse from './ChatNurse'
import TestsAndStatistics from "./TestsAndStatistics"
import defaultProfilePicture from "../picture/WIN_20250430_18_06_45_Pro.jpg";
import { useSelector } from "react-redux"; // לשימוש בפרטי המשתמש מ-Redux

export default function Nurse() {
    const name = useSelector((state) => state.token.user.name)
    const user = useSelector((state) => state.token.user);
    const profilePicture = user?.profilePicture
    ? `http://localhost:7002${user.profilePicture}` // נתיב מוחלט לתמונה שהועלתה
    : defaultProfilePicture; // תמונה דיפולטיבית
    
    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('./Home')
            }
        },
        {
            label: 'QueueSummaryNurse',
            icon: 'pi pi-star',
            command: () => {
                navigate('/nurse/QueueSummaryNurse')
            }
        },
        {
            label:'chat with parents',
            icon: 'pi pi-comments',
            command: () => {
                navigate('/nurse/chat');
            }},
      
    ];
    const endTemplate = (
        <div className="flex align-items-center">
            <img
                src={profilePicture} // נתיב התמונה
                className="profile-picture"
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                }}
            />
            <span>{name || "Guest"}</span>
        </div>
    );
    return (
        <div className="flex flex-column align-items-center">
            <Menubar model={items} end={endTemplate}/>
            <Routes>
                <Route path='/QueueSummaryNurse' element={<QueueSummaryNurse />} />
                <Route path='/ChatNurse' element={<ChatNurse />} />
                <Route path='/nurse/TestsAndStatistics/:id' element={<TestsAndStatistics />} />
                </Routes>
        </div>
    );
}