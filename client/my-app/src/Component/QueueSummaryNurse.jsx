import { useNavigate } from "react-router-dom";
import { Route, Routes } from 'react-router-dom'
import axios from "axios";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Card } from "primereact/card";

export default function QueueSummaryNurse() {
    const [appointments, setAppointments] = useState([]);
    const token = useSelector((state) => state.token.token);
    const user = useSelector((state) => state.token.user);

    // const formatTime = (time) => {
    //     const hours = Math.floor(time / 60); // חישוב השעות
    //     const minutes = time % 60; // חישוב הדקות
    //     return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`; // מחזיר את השעה בפורמט HH:mm
    // };

    // const formatDate = (date) => {
    //     const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    //     return new Date(date).toLocaleDateString("he-IL", options); // מציג תאריך בפורמט עברי
    // };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(
                `http://localhost:7002/appointment/Nurse/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(response.data);
        } catch (error) {
            console.error("שגיאה בשליפת תורים:", error);
        }
    };

    useEffect(() => {
        console.log(user)
        if (user && user._id) {
            fetchAppointments();
        }
    }, [user]);
    return (
        <div className="p-4">
            <h2>התורים שלי</h2>

            {appointments.length === 0 ? (
                <p>אין תורים להצגה</p>
            ) : (
                <div className="grid">
                    {appointments.map((appt) => (
                        < Card
                            key={appt._id}
                            title={`תור אצל ${appt._id || 'אחות'} `}
                            className="col-12 md:col-6 lg:col-4 p-2"
                        >
                            <p><strong>תאריך:</strong> {appt.appointment_time?.date ? new Date(appt.appointment_time.date).toLocaleDateString('he-IL') : "לא ידוע"}</p>
                            <p><strong>שעה:</strong> {appt.appointment_time?.time || "לא ידוע"}</p>
                            <p><strong>שם התינוק:</strong> {appt.BabyName}</p>
                            <p><strong>בדיקה:</strong> {appt.status}</p>
                        </Card>
                    ))}
                </div>
            )
            }
        </div >
    );
}
