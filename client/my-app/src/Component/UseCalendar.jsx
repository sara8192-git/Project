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
    const [NurseDetails, setNurseDetails] = useState([]);
    const [BabyDetails, setBabyDetails] = useState([]);

    const role = useSelector((state) => state.token.user.role)
    const token = useSelector((state) => state.token.token)
    const parentId = useSelector((state) => state.token.user._id)

    //  **שליפת השעות הפנויות מהשרת עבור תאריך שנבחר**
    const fetchAvailableHours = async (selectedDate) => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // תאריך בפורמט YYYY-MM-DD
        console.log("formattedDate" + selectedDate);

        if (!token) {
            console.error("❌ לא נמצא טוקן, יש להתחבר!");
            return;
        }
        try {
            const res = await axios.get(`http://localhost:7002/nurseScheduler/${formattedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                const availableSlots = res.data.flatMap((schedule, index) =>
                    schedule.available_slots.map((slot, i) => ({
                        key: slot.time,
                        value: (index + 1) * (i + 48),
                        label: schedule.identity
                    }))
                );

                if (availableSlots.length == 0) {
                    alert("אין שעות עבודה ביום זה😮‍💨")
                } else {
                    setAvailableHours(availableSlots); // השעות הפנויות נשמרות במצב
                }
            }
        } catch (error) {
            console.error("❌ שגיאה בשליפת השעות הפנויות:", error);
        }
    };

    const getNameNurse = async (NurseId) => {
        try {
            console.log("NurseId" + NurseId);
            const response = await axios.get(
                `http://localhost:7002/user/${NurseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("שגיאה בשליפת האחות:", error);
        }
    };

    const getNameBaby = async (BabyId) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/baby/${BabyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("BabyId" + response.data.name);

            return response.data.name;
        } catch (error) {
            console.error("שגיאה בשליפת התינוק:", error);
        }
    };

    //  **כאשר המשתמש לוחץ על תאריך בלוח השנה → מופעלת הפונקציה הזו**
    const handleDateChange = (e) => {
        setDate(e.value);            // שמירת התאריך שנבחר
        console.log("e.value" + e.value);

        setAvailableHours([]);       // ניקוי השעות של היום הקודם
        setSelectedTime(null);       // ניקוי הבחירה של היום הקודם
        fetchAvailableHours(e.value); // קריאה לפונקציה שמביאה שעות פנויות
    };

    // תוספת - שליפת התינוקות של ההורה
    useEffect(() => {
        const fetchBabies = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7002/user/my-babies/${parentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("res" + res);
                if (res.status === 200) {
                    const babyOptions = res.data.map(b => ({
                        label: b,
                        value: b
                    }));
                    setBabies(babyOptions);
                }
            } catch (err) {
                console.error("❌ שגיאה בשליפת תינוקות:", err);
            }
        };

        const fetchBabiesName = async () => {
            const BabyData = {};
            await Promise.all(babies.map(async (slot) => {
                const baby = await getNameBaby(slot.label);
                if (baby) BabyData[slot.label] = baby; // עדכון המידע
            }));
            setBabyDetails(BabyData); // עדכון עם כל הנתונים
        };

        const fetchNurses = async () => {
            const nurseData = {};
            await Promise.all(availableHours.map(async (slot) => {
                const nurse = await getNameNurse(slot.label);
                if (nurse) nurseData[slot.label] = nurse; // עדכון המידע
            }));
            setNurseDetails(nurseData); // עדכון עם כל הנתונים
        };

        // שינוי הסדר: טעינת תינוקות לפני אחיות
        fetchBabies()
            .then(() => fetchBabiesName())
            .then(() => fetchNurses());
    }, [availableHours]);

    // 🟡 **פונקציה להזמנת תור**
    const handleBookSlot = async () => {
        console.log("התחלת תהליך הזמנת תור");
    
        if (!selectedTime) {
            alert('אנא בחר שעה');
            return;
        }
    
        try {
            const timeAndId = availableHours.find((e) => e.value == selectedTime);
    
            const appointmentData = {
                time: timeAndId.key,
                date: new Date(date) // המרת המשתנה date לאובייקט תאריך
            };
    
            console.log("נתוני תור נבחרו:", appointmentData);
    
            const res = await axios.post('http://localhost:7002/appointment/', {
                appointment_time: appointmentData,
                baby_id: selectedBaby,   //⭐ תוספת של התינוק
                nurse_id: timeAndId.label
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            if (res.status === 201) {
                alert('הזמנת התור בוצעה בהצלחה');
    
                setAvailableHours(availableHours.filter(hour => hour.value !== selectedTime));
                setSelectedAppointmentId(res.data._id); // שמירת ה-ID
    
                const formattedDate = new Date(date).toLocaleDateString('en-CA');
                console.log("formattedDate", formattedDate);
    
                await axios.put('http://localhost:7002/nurseScheduler/book-slot', {
                    nurseId: timeAndId.label,
                    date: formattedDate,
                    selectedTime: timeAndId.key
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            } else {
                alert('הייתה בעיה בהזמנת התור');
            }
        } catch (error) {
            // טיפול בשגיאות מהשרת
            if (error.response && error.response.status) {
                alert(error.response.data.message || 'אירעה שגיאה בתהליך הזמנת התור.');
            } else {
                console.error('❌ שגיאה בהזמנת תור:', error);
                alert('שגיאה לא ידועה התרחשה.');
            }
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
                                onChange={(e) => { setSelectedTime(e.value) }}
                                options={availableHours}
                                optionLabel="label"
                                className="w-full custom-listbox"
                                listStyle={{ maxHeight: '250px' }}
                                itemTemplate={(option) => (
                                    <>
                                        <div style={{ color: 'black' }}>
                                            {option.key}
                                            -- ❤
                                            {NurseDetails[option.label]?.name || "לא ידוע"}
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
                                options={babies.map((baby) => ({
                                    label: BabyDetails[baby.value] || baby.value,
                                    value: baby.value
                                }))}
                                onChange={(e) => setSelectedBaby(e.value)}
                                placeholder="בחר תינוק"
                                className="w-full"
                            />
                        </div>
                    )}
                    {selectedTime && (
                        <div className="mt-4">
                            <h4>
                                בחרת את השעה:
                                <span style={{ color: 'gold' }}>
                                    {(() => {
                                        const selectedSlot = availableHours.find((slot) => slot.value === selectedTime);
                                        if (selectedSlot) {
                                            return new Date(`1970-01-01T${selectedSlot.key}`).toLocaleTimeString('he-IL', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });
                                        } else {
                                            return "שעה לא נבחרה או אינה תקינה";
                                        }
                                    })()}
                                </span>
                            </h4>
                            <Button
                                label="הזמן תור"
                                icon="pi pi-calendar-plus"
                                className="p-button-warning mr-2"
                                onClick={handleBookSlot}
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