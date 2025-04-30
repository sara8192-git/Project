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

    //צריך להפוך את הדגל לשלילה במערך
    const deleteAppointment = async (appointmentId, babyId) => {
        try {
            await axios.delete(
                `http://localhost:7002/appointment/${appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // עדכון הסטייט לאחר המחיקה
            setAppointments((prevAppointments) => {
                const updatedAppointments = { ...prevAppointments };
                updatedAppointments[babyId] = updatedAppointments[babyId].filter(
                    (appointment) => appointment._id !== appointmentId
                );
                return updatedAppointments;
            });
            console.log("התור נמחק בהצלחה");
        } catch (error) {
            console.error("שגיאה במחיקת התור:", error);
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
    }, [parentId, token]);

    useEffect(() => {
        if (babies.length > 0) {
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
    }, [babies]);

    useEffect(() => {
        if (Object.keys(babyDetails).length > 0) {
            fetchAppointments();
        }
    }, [babyDetails]);

    return (
        <div>
            <h2>תורים</h2>
            {Object.keys(appointments).map((babyId) => (
                <div key={babyId}>
                    <h3>{babyDetails[babyId]}</h3>
                    <ul>
                        {appointments[babyId]?.map((appointment, index) => {
                            if (!appointment || !appointment.appointment_time) {
                                console.warn("Invalid appointment data:", appointment);
                                return null;
                            }
                            return (
                                <li key={index}>
                                    {formatDate(appointment.appointment_time.date) || "תאריך לא ידוע"} - {appointment.appointment_time.time || "שעה לא ידועה"}
                                    <button
                                        onClick={() => deleteAppointment(appointment._id, babyId)}
                                        style={{
                                            marginLeft: "10px",
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        מחק
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}