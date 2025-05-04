import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import BookedAppointmentParent from "./BookedAppointmentParent"
import UseCalendar from './UseCalendar';
import ChatParent from './ChatParent'
import {  Route, Routes } from 'react-router-dom'
import AddBabySecretary from './AddBabySecretary'
import AddScheduleNurse from './AddScheduleNurse'
import defaultProfilePicture from "../picture/WIN_20250430_18_06_45_Pro.jpg";
import { useSelector } from "react-redux"; // לשימוש בפרטי המשתמש מ-Redux

export default function Parent() {
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
            label: 'AddBabySecretary',
            icon: 'pi pi-star',
            command: () => {
                navigate('/secretary/AddBabySecretary')
            }
        },
        {
            label: 'AddScheduleNurse',
            icon: 'pi pi-search',
            command: () => {
                navigate('/secretary/AddScheduleNurse')
            }
        },
        {
            label:'chat with nurse',
            icon: 'pi pi-comments',
            command: () => {
              navigate('/secretary/ChatParent');
            }
          }
          
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
                <Route path='/BookedAppointmentParent' element={<BookedAppointmentParent />} />
                <Route path='/UseCalendar' element={<UseCalendar />} />
                <Route path='/ChatParent' element={<ChatParent />} />
                <Route path='/AddBabySecretary' element={<AddBabySecretary />} />
                <Route path='/AddScheduleNurse' element={<AddScheduleNurse />} />

            </Routes>
        </div>
    );
}