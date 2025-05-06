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
import { useSelector ,useDispatch} from "react-redux"; // לשימוש בפרטי המשתמש מ-Redux
import RegisterNurse from './RegisterNurse'
import { logOut } from "../redux/tokenSlice"; // ייבוא הפעולה למחיקת הטוקן

export default function Parent() {
    const name = useSelector((state) => state.token.user.name)
    const user = useSelector((state) => state.token.user);
    const profilePicture = user?.profilePicture
    ? `http://localhost:7002${user.profilePicture}` // נתיב מוחלט לתמונה שהועלתה
    : defaultProfilePicture; // תמונה דיפולטיבית
    const dispatch = useDispatch(); // 🔹 מאפשר קריאה לפעולות Redux
    
    const handleLogout = () => {
        dispatch(logOut()); // קריאה לפעולת מחיקת הטוקן
        navigate('/login'); // ניתוב לדף הלוגין
    };

    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים
    const items = [
        {
            label: 'הוסף אחות',
            icon: 'pi pi-home',
            command: () => {
                navigate('/secretary/RegisterNurse')
            }
        },
        {
            label: 'הוספת תינוק',
            icon: 'pi pi-star',
            command: () => {
                navigate('/secretary/AddBabySecretary')
            }
        },
        {
            label: 'הוספת מערכת שעות לאחות',
            icon: 'pi pi-search',
            command: () => {
                navigate('/secretary/AddScheduleNurse')
            }
        },
       
          {
              label: 'Log Out', // 🔹 כפתור Log Out
              icon: 'pi pi-sign-out',
              command: handleLogout // קריאה לפונקציה
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
                <Route path='/RegisterNurse' element={<RegisterNurse />} />

            </Routes>
        </div>
    );
}