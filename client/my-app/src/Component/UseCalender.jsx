import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';         
import { Button } from 'primereact/button';           
import { ListBox } from 'primereact/listbox';

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
                // const availableSlots = res.data.flatMap(schedule => 
                //     schedule.available_slots.map(slot => slot.time)
                //   );; // קבלת הנתונים

                //  console.log(formattedDate)
                const availableSlots = res.data.flatMap(schedule => 
                    schedule.available_slots.map(slot => ({
                        label: slot.time,
                        value: slot.time
                    }))
                );
                    
                if (availableSlots.length == 0)
                   { alert("אין שעות עבודה ביום זה😮‍💨")
                    console.log("אין שעות עבודה ביום זה😮‍💨")}
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
        setDate(e.value);            // שמירת התאריך שנבחר
        setAvailableHours([]);       // ניקוי השעות של היום הקודם
        setSelectedTime(null);       // ניקוי הבחירה של היום הקודם
        fetchAvailableHours(e.value); // קריאה לפונקציה שמביאה שעות פנויות
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
        <div className="card flex flex-column align-items-center justify-content-center">
        {role === "Secretary" || role === "Admin" || role === "Parent" ? (
            <>
                <Calendar value={date} onChange={handleDateChange} inline showWeek />

                {availableHours.length > 0 && (
                    <div className="mt-4 w-full md:w-20rem">
                        <h4>שעות פנויות:</h4>
                        <ListBox
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.value)}
                            options={availableHours}
                            optionLabel="label"
                            className="w-full custom-listbox"    
                            listStyle={{ maxHeight: '250px' }}
                            itemTemplate={(option) => (
                                <div style={{ color: 'black' }}>
                                    {option.label}
                                </div>
                            )}
                        />
                    </div>
                )}

                {selectedTime && (
                    <div className="mt-4">
                        <h4>בחרת את השעה: <span style={{ color: 'gold' }}>{selectedTime}</span></h4>
                        <Button
                            label="הזמן תור"
                            icon="pi pi-calendar-plus"
                            className="p-button-warning mr-2"
                            onClick={handleBookSlot}
                        />
                        <Button
                            label="בטל תור"
                            icon="pi pi-times"
                            className="p-button-danger"
                            onClick={() => setSelectedTime(null)}
                        />
                    </div>
                )}
            </>
        ) : (
            <h3>אין לך הרשאה לצפות ביומן</h3>
        )}
    </div>
);
}