import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null); // 🟡 זמן שנבחר

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

        const token = localStorage.getItem("authToken"); // 🟡 שליפת הטוקן מה-LocalStorage

        if (!token) {
            console.error("❌ לא נמצא טוקן, יש להתחבר!");
            return;
        }
        
        // 🟡 בהנחה שהשרת מחזיר את השעות הפנויות לפי אחות ו-תאריך:
        try {
            const res = await axios.get(`http://localhost:7008/appointment/${formattedDate}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 200) {
                setAvailableHours(res.data); // 🟡 השעות הפנויות נשמרות במצב
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

    // 🟡 **פונקציה להזמנת תור**
    const handleBookSlot = async () => {
        if (!selectedTime) {
            alert('אנא בחר שעה');
            return;
        }

        try {
            const res = await axios.post('http://localhost:7000/appointment/book', {
                selectedTime,
                date,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (res.status === 200) {
                alert('הזמנת התור בוצעה בהצלחה');
                // 🟡 עדכון השעות הפנויות לאחר ההזמנה
                setAvailableHours(availableHours.filter(hour => hour !== selectedTime));
            } else {
                alert('הייתה בעיה בהזמנת התור');
            }
        } catch (error) {
            console.error('❌ שגיאה בהזמנת תור:', error);
        }
    };

    return (
        <div className="card flex justify-content-center">
            {userRole === "Secretary" || userRole === "Admin" || userRole === "Parent" ? (
                <>
                    <Calendar value={date} onChange={handleDateChange} inline showWeek />
                    {availableHours.length > 0 && (
                        <div>
                            <h3>שעות פנויות:</h3>
                            <ul>
                                {availableHours.map((hour, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => setSelectedTime(hour)}  // 🟡 בחר שעה
                                            style={{ backgroundColor: selectedTime === hour ? 'lightblue' : 'white' }}
                                        >
                                            {hour}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedTime && (
                        <div>
                            <h4>בחרת את השעה: {selectedTime}</h4>
                            <button onClick={handleBookSlot}>הזמן תור</button>
                        </div>
                    )}
                </>
            ) : (
                <h3>אין לך הרשאה לצפות ביומן</h3>  // 🟡 הודעה למי שאין לו הרשאה
            )}
        </div>
    );
}