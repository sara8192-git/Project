import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';
import axios from 'axios';


export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    
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
            const res = await axios.get(`http://localhost:7000/appointment/${formattedDate}`);
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
        </div>
    );
}