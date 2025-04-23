import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';

export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);//שעות התורים לתאריך
    const [userRole, setUserRole] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null); // זמן שנבחר
    const role = useSelector((state) => state.token.user.role)
    const token = useSelector((state) => state.token.token)



    //  **שליפת השעות הפנויות מהשרת עבור תאריך שנבחר**
    const fetchAvailableHours = async (selectedDate) => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0]; //  המרת התאריך לפורמט YYYY-MM-DD  

        if (!token) {
            console.error("❌ לא נמצא טוקן, יש להתחבר!");
            return;
        }
        // 🟡 בהנחה שהשרת מחזיר את השעות הפנויות לפי אחות ו-תאריך:
        try {

            const res = await axios.get(`http://localhost:7002/nurseScheduler/${formattedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                const availableSlots = res.data; // קבלת הנתונים


                if (availableSlots.length == 0)
                    console.log("אין שעות עבודה ביום זה😮‍💨")
                else {
                    setAvailableHours(availableSlots); // השעות הפנויות נשמרות במצב
                    console.log(availableSlots);
                }
            }
        } catch (error) {
            console.error("❌ שגיאה בשליפת השעות הפנויות:", error);
        }
    };

    //  **כאשר המשתמש לוחץ על תאריך בלוח השנה → מופעלת הפונקציה הזו**
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
            const res = await axios.post('http://localhost:7002/appointment/book', {
                selectedTime,
                date,
            }, {
                headers: { Authorization: `Bearer ${token}` }
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
            {role === "Secretary" || role === "Admin" || role === "Parent" ? (
                <>
                    <Calendar value={date} onChange={handleDateChange} inline showWeek />
                    {availableHours.length > 0 && (
                        <div>
                            <h3>שעות פנויות:</h3>
                            <ul>
                                {availableHours.map((hour, index) => {
                                    const hours = availableHours[index];
                                    return (
                                        <li key={index}>
                                            <button
                                                onClick={() => setSelectedTime(hours)}  // 🟡 בחר שעה
                                                className={availableHours.includes(index) ? "p-button-success" : "p-button-secondary"}
                                                style={{ backgroundColor: selectedTime === hour ? 'lightblue' : 'white' }}
                                            >
                                                {hour}
                                            </button>
                                        </li>
                                    )
                                })}
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