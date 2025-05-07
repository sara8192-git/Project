import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import BookedAppointmentParent from "./BookedAppointmentParent"
import UseCalendar from './UseCalendar';
import ChatParent from './ChatParent'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"; // לשימוש בפרטי המשתמש מ-Redux
import defaultProfilePicture from "../picture/WIN_20250430_18_06_45_Pro.jpg";
import { logOut } from "../redux/tokenSlice"; // ייבוא הפעולה למחיקת הטוקן

export default function Parent() {
    const name = useSelector((state) => state.token.user.name)
    // 🔹 נתיב לתמונת פרופיל דיפולטיבית
    const dispatch = useDispatch(); // 🔹 מאפשר קריאה לפעולות Redux

    // 🔹 פרטי המשתמש מ-Redux
    const user = useSelector((state) => state.token.user);
    console.log(user);

    // 🔹 פרטי תמונת הפרופיל
    const profilePicture = user?.profilePicture
        ? `http://localhost:7002${user.profilePicture}` // נתיב מוחלט לתמונה שהועלתה
        : defaultProfilePicture; // תמונה דיפולטיבית
    console.log(profilePicture);

    const handleLogout = () => {
        dispatch(logOut()); // קריאה לפעולת מחיקת הטוקן
        navigate('/login'); // ניתוב לדף הלוגין
    };

    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים
    const items = [
        {
            label: 'בית',
            icon: 'pi pi-home',
            command: () => {
                navigate('/parent/Home')
            }
        },
        {
            label: 'קביעת תור',
            icon: 'pi pi-calendar-times',
            command: () => {
                navigate('/parent/UseCalendar')
            }
        },
        {
            label: 'התורים שלי',
            icon: 'pi pi-list-check',
            command: () => {
                navigate('/parent/BookedAppointmentParent')
            }
        },
        {
            label: 'צאט עם אחות',
            icon: 'pi pi-comments',
            command: () => {
                navigate('/parent/ChatParent');
            }
        },
        {
            label: 'Log Out', // 🔹 כפתור Log Out
            icon: 'pi pi-sign-out',
            command: handleLogout // קריאה לפונקציה
        }

    ];
    // 🔹 תבנית ימין של ה-Menubar (עם תמונת פרופיל)
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
                <Route path='/Home' element={<Home />} />

            </Routes>
        </div>
    );
}