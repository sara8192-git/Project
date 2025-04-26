import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';


export default function UseCalendar() {
    const [date, setDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);//שעות התורים לתאריך
    const [userRole, setUserRole] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null); // זמן שנבחר
    const [babies, setBabies] = useState([]);                   //⭐ תוספת - מערך תינוקות
    const [selectedBaby, setSelectedBaby] = useState(null);      //⭐ תוספת - תינוק שנבחר

    const role = useSelector((state) => state.token.user.role)
    const token = useSelector((state) => state.token.token)
    const parentId = useSelector((state) => state.token.user._id)


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
            console.log(res);
            if (res.status === 200) {
                // const availableSlots = res.data.flatMap(schedule => 
                //     schedule.available_slots.map(slot => slot.time)
                //   );; // קבלת הנתונים

                //  console.log(formattedDate)
                // const availableSlots = res.data.flatMap(schedule =>
                //     schedule.available_slots.map(slot => ({
                //         label: slot.time,
                //         value: slot.time
                //     }))
                // );
                const availableSlots = res.data.flatMap((schedule,index) =>

                    schedule.available_slots.map((slot,i) => ({
                        key:slot.time,
                        value:  (index+1)*(i+48),
                        label:schedule.identity 
                       
                        // identity: schedule.identity // הנח שה-nurse_identity נמצא באובייקט schedule
                    }))
                );
                if (availableSlots.length == 0) {
                    alert("אין שעות עבודה ביום זה😮‍💨")
                    console.log("אין שעות עבודה ביום זה😮‍💨")
                }
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
    // תוספת - שליפת התינוקות של ההורה
    useEffect(() => {
        const fetchBabies = async () => {
            try {
                if (role !== 'Parent' || !token) return;
                console.log(parentId);
                const res = await axios.get(`http://localhost:7002/user/my-babies/${parentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });


                if (res.status === 200) {
                    const babyOptions = res.data.map(b => ({
                        label: b,
                        value: b
                    }));
                    console.log(res);

                    console.log(babyOptions)
                    setBabies(babyOptions);
                }
            } catch (err) {
                console.error("❌ שגיאה בשליפת תינוקות:", err);
            }
        };

        fetchBabies();
    }, [role, token]);


    // 🟡 **פונקציה להזמנת תור**
    const handleBookSlot = async () => {
console.log("aaaaaaaaaaaaaaaaaa");

        if (!selectedTime) {
            alert('אנא בחר שעה');
            return;
        }
        
        try {
           const timeAndId= availableHours.find((e)=>e.value==selectedTime)
            
            // שליחת ההזמנה
            const appointmentData = {
                    time: timeAndId.key, // הנח שהמשתנה selectedTime מכיל את השעה
                    date: new Date(date) // המרת המשתנה date לאובייקט תאריך
                
            }
            
            console.log(appointmentData);
            
            
            
            const res = await axios.post('http://localhost:7002/appointment/', {
                appointment_time: appointmentData,
                baby_id: selectedBaby,   //⭐ תוספת של התינוק
                nurse_id: timeAndId.label
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                alert('הזמנת התור בוצעה בהצלחה');

                // עדכון השעות הפנויות אחרי ההזמנה
                setAvailableHours(availableHours.filter(hour => hour.value !== selectedTime));

                setSelectedAppointmentId(res.data._id); // שמירת ה-ID

                // קריאה לעדכון הדגל של השעה ל-true ביומן של האחות
                await axios.put('http://localhost:7002/nurseScheduler/book-slot', {
                    nurse_id: timeAndId.label,
                    date,
                    selectedTime: timeAndId.key
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

            } else {
                alert('הייתה בעיה בהזמנת התור');
            }
        } catch (error) {
            console.error('❌ שגיאה בהזמנת תור:', error);
        }
    };

    const handleCancelSlot = async () => {
        if (!selectedAppointmentId) {
            alert('לא נבחר תור לביטול');
            return;
        }

        try {
            // ביטול התור
            const res = await axios.patch(`http://localhost:7002/appointment/cancel/${selectedAppointmentId}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                // עדכון ביומן של האחות
                await axios.patch(`http://localhost:7002/nurseScheduler/cancel-slot`, {
                    date,
                    time: selectedTime
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                alert('התור בוטל בהצלחה');
                // החזרת השעה לרשימת השעות
                setAvailableHours(prev => [...prev, { label: selectedTime, value: selectedTime }]);
                setSelectedTime(null);
            } else {
                alert('הייתה בעיה בביטול');
            }
        } catch (error) {
            console.error('❌ שגיאה בביטול:', error);
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
                                onChange={(e) => {console.log(e); setSelectedTime(e.value)}}
                                options={availableHours}
                                optionLabel="label"
                                className="w-full custom-listbox"
                                listStyle={{ maxHeight: '250px' }}
                                itemTemplate={(option) => (
                                    <>
                                        <div style={{ color: 'black' }}>
                                            {option.key }
                                            -- ❤
                                            {option.label}
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    )}
                    {role === 'Parent' && babies.length > 0 && (   //⭐ תוספת
                        <div className="mt-4 w-full md:w-20rem">
                            <h4>בחר ילד:</h4>
                            <Dropdown
                                value={selectedBaby}
                                options={babies}
                                onChange={(e) => setSelectedBaby(e.value)}
                                placeholder="בחר תינוק"
                                className="w-full"
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
                                onClick={handleCancelSlot}
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