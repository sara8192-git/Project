import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

export default function BookedAppointmentParent() {
    const [babies, setBabies] = useState([]);  //⭐ תוספת - מערך תינוקות
    const [babyDetails, setBabyDetails] = useState({});
    const token = useSelector((state) => state.token.token)
    const parentId = useSelector((state) => state.token.user._id)
    const [appointments, setAppointments] = useState([]);  // סטייט לשמירת התורים

    const formatDate = (isoString) => {
        if (!isoString) return "תאריך לא ידוע"; // טיפול במקרה של ערך ריק
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0'); // הוספת אפסים למספר ימים
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // חודשים מתחילים מ-0
        const year = date.getFullYear();
        return `${day}\\${month}\\${year}`; // פורמט מותאם
    };

    const getAppointmentsByBabyId = async (babyId) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/appointment/Baby/${babyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;  // התורים של התינוק
        } catch (error) {
            console.error("שגיאה בשליפת התורים:", error);
            return [];
        }
    };
    // פונקציה לשלוף את כל התורים של כל התינוקות
    const fetchAppointments = async () => {
        const allAppointments = {};
        await Promise.all(
            Object.keys(babyDetails).map(async (babyId) => {
                const appointments = await getAppointmentsByBabyId(babyId);
                allAppointments[babyId] = appointments;
            })
        );
        setAppointments(allAppointments);
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
            return response.data.name;
        } catch (error) {
            console.error("שגיאה בשליפת התינוק:", error);
        }
    };

    useEffect(() => {
        console.log("jjjjjjj");
        // שליפת התינוקות של ההורה
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
        fetchBabies();
    }, [parentId, token]); // קריאה תתבצע רק אם ה-token או ה-parentId משתנים

    useEffect(() => {
        if (babies.length > 0) {
            // רק אם יש תינוקות נבצע את שליפת השמות
            const fetchBabiesName = async () => {
                const BabyData = {};
                await Promise.all(babies.map(async (slot) => {
                    const baby = await getNameBaby(slot.label); // קבלת פרטי התינוק
                    if (baby) {
                        BabyData[slot.label] = baby; // עדכון המידע
                    }
                }));
                setBabyDetails(BabyData); // עדכון עם כל הנתונים
            };
            fetchBabiesName();
        }
    }, [babies]);  // קריאה זו תתבצע כש-babies משתנה

    useEffect(() => {
        if (Object.keys(babyDetails).length > 0) {  // לוודא ש-babyDetails נטען
            fetchAppointments();  // שליפת התורים כש-babyDetails נטען
        }
    }, [babyDetails]);  // קריאה זו תתבצע כש-babyDetails משתנה

    return (
        <div>
            <h2>תורים</h2>
            {Object.keys(appointments).map((babyId) => (
                <div key={babyId}>
                    <h3>{babyDetails[babyId]}</h3>
                    <ul>
                        {/* {appointments[babyId]?.map((appointment, index) => (
                            <li key={index}>
                                {appointment.appointment_time.date} - {appointment.appointment_time.time}
                            </li>
                        ))} */}
                        {appointments[babyId]?.map((appointment, index) => {
                            // בדיקה אם הנתונים תקינים לפני הגישה
                            if (!appointment || !appointment.appointment_time) {
                                console.warn("Invalid appointment data:", appointment);
                                return null; // דלג על ערכים לא תקינים
                            }
                            return (
                                <li key={index}>
                                    {formatDate(appointment.appointment_time.date) || "תאריך לא ידוע"} - {appointment.appointment_time.time || "שעה לא ידועה"}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}
