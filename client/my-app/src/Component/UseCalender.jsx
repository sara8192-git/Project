
import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [userRole, setUserRole] = useState(null);

    // 🟡 **בדיקת הרשאות משתמש בעת טעינת הקומפוננטה**
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await axios.get("http://localhost:7000/auth/user", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.status === 200) {
                    setUserRole(res.data.role);
                }
            } catch (error) {
                console.error("❌ שגיאה בקבלת הרשאות המשתמש:", error);
            }
        };
        fetchUserRole();
    }, []);

    // 🟡 **שליפת השעות הפנויות מהשרת עבור תאריך שנבחר**
    const fetchAvailableHours = async (selectedDate) => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0]; // 🟡 המרת התאריך לפורמט YYYY-MM-DD  
        console.log("📅 תאריך שנבחר:", formattedDate); // 🟡 לוודא שהתאריך שהמשתמש בחר נקלט

        const token = localStorage.getItem("authToken"); // 🟡 שליפת הטוקן מה-LocalStorage

        if (!token) {
            console.error("❌ לא נמצא טוקן, יש להתחבר!");
            return;
        }
        try {
            const res = await axios.get(`http://localhost:7008/appointment/${formattedDate}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 200) {
                setAvailableHours(res.data);
            }
        } catch (error) {
            console.error("❌ שגיאה בשליפת השעות הפנויות:", error);
        }
    };

    // 🟡 **כאשר המשתמש לוחץ על תאריך בלוח השנה → מופעלת הפונקציה הזו**
    const handleDateChange = (e) => {
        setDate(e.value);  // 🟡 שמירת התאריך שנבחר
        fetchAvailableHours(e.value);  // 🟡 קריאה לפונקציה שמביאה שעות פנויות
    };

    return (
        <div className="card flex justify-content-center">
            {userRole === "Secretary" || userRole === "Admin" ? (
                <>
                    <Calendar value={date} onChange={handleDateChange} inline showWeek />
                    {availableHours.length > 0 && (
                        <div>
                            <h3>שעות פנויות:</h3>
                            <ul>
                                {availableHours.map((hour, index) => (
                                    <li key={index}>{hour}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <h3>אין לך הרשאה לצפות ביומן</h3>
            )}
        </div>
    );
}
