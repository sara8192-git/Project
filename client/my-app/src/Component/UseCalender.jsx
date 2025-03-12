import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';

export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    // 🟡 **שליפת השעות הפנויות מהשרת עבור תאריך שנבחר**
    const fetchAvailableHours = async (selectedDate) => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0]; // 🟡 המרת התאריך לפורמט YYYY-MM-DD  
        console.log("📅 תאריך שנבחר:", formattedDate); // 🟡 לוודא שהתאריך שהמשתמש בחר נקלט

        try {
            const response = await fetch(`https://your-api.com/available-hours?date=${formattedDate}`);
            const data = await response.json();
            setAvailableHours(data); // 🟡 שמירת השעות הפנויות ב-state כדי שיוצגו על המסך
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
                <Calendar value={date} onChange={(e) => setDate(e.value)} inline showWeek />
            </div>

        )
    }
