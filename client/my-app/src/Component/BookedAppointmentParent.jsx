import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

export default function BookedAppointmentParent() {
    const [babies, setBabies] = useState([]);
    const [babyDetails, setBabyDetails] = useState({});
    const token = useSelector((state) => state.token.token);
    const parentId = useSelector((state) => state.token.user._id);
    const [appointments, setAppointments] = useState({});

    const formatDate = (isoString) => {
        if (!isoString) return "תאריך לא ידוע";
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}\\${month}\\${year}`;
    };

    const getAppointmentsByBabyId = async (babyId) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/appointment/Baby/${babyId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error("שגיאה בשליפת התורים:", error);
            return [];
        }
    };

    const deleteAppointment = async (appointmentId, babyId) => {
        try {
            await axios.delete(
                `http://localhost:7002/appointment/${appointmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAppointments(prev => {
                const updated = { ...prev };
                updated[babyId] = updated[babyId].filter(a => a._id !== appointmentId);
                return updated;
            });
        } catch (error) {
            console.error("שגיאה במחיקת התור:", error);
        }
    };

    const fetchAppointments = async () => {
        const all = {};
        await Promise.all(
            Object.keys(babyDetails).map(async babyId => {
                all[babyId] = await getAppointmentsByBabyId(babyId);
            })
        );
        setAppointments(all);
    };

    const getNameBaby = async (BabyId) => {
        try {
            const res = await axios.get(
                `http://localhost:7002/baby/${BabyId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data.name;
        } catch (error) {
            console.error("שגיאה בשליפת התינוק:", error);
        }
    };

    useEffect(() => {
        const fetchBabies = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7002/user/my-babies/${parentId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.status === 200) {
                    setBabies(res.data.map(b => ({ label: b, value: b })));
                }
            } catch (err) {
                console.error("❌ שגיאה בשליפת תינוקות:", err);
            }
        };
        fetchBabies();
    }, [parentId, token]);

    useEffect(() => {
        if (babies.length) {
            const fetchNames = async () => {
                const names = {};
                await Promise.all(babies.map(async slot => {
                    const name = await getNameBaby(slot.label);
                    if (name) names[slot.label] = name;
                }));
                setBabyDetails(names);
            };
            fetchNames();
        }
    }, [babies]);

    useEffect(() => {
        if (Object.keys(babyDetails).length) fetchAppointments();
    }, [babyDetails]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">התורים שלי</h2>
            {Object.keys(appointments).map(babyId => (
                <div key={babyId} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-purple-700">
                        {babyDetails[babyId]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {appointments[babyId]?.map((appointment, idx) => {
                            if (!appointment?.appointment_time) return null;
                            return (
                                <div
                                    key={idx}
                                    className="border border-purple-300 rounded-xl p-4 shadow-sm flex flex-col justify-between bg-white"
                                >
                                    <span className="text-right text-sm text-gray-700 mb-4">
                                        {formatDate(appointment.appointment_time.date)} -{" "}
                                        {appointment.appointment_time.time}
                                    </span>
                                    <button
                                        onClick={() => deleteAppointment(appointment._id, babyId)}
                                        style={{
                                            marginTop: "auto",
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
