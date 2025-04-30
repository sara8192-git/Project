import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import AddMeasurementPage from "./AddMeasurementPage";
import ReportAbaby from "./ReportAbaby";

export default function QueueSummaryNurse() {
    const [appointments, setAppointments] = useState([]);
    const token = useSelector((state) => state.token.token);
    const user = useSelector((state) => state.token.user); // nurseId
    const [BabyDetails, setBabyDetails] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedBabyId, setSelectedBabyId] = useState(null);

    const navigate = useNavigate();

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

            const babyData = {};
            await Promise.all(response.data.map(async (appt) => {
                if (appt.baby_id) {
                    const baby = await getIDBaby(appt.baby_id);
                    if (baby) {
                        babyData[appt.baby_id] = baby;
                    }
                }
            }));

            setBabyDetails(babyData);

        } catch (error) {
            console.error("שגיאה בשליפת תורים:", error);
        }
    };

    const getIDBaby = async (BabyId) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/baby/${BabyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("שגיאה בשליפת התינוק:", error);
        }
    };

    useEffect(() => {
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
                        <Card key={appt._id} className="col-12 md:col-6 lg:col-4 p-2">
                            <Button
                                label="עדכן גובה/משקל"
                                rounded
                                onClick={() => navigate(`/AddMeasurementPage/${BabyDetails[appt.baby_id]?._id}`)}
                            />

                            <Button
                                label="הצג סטטיסטיקות "
                                rounded
                                onClick={() => navigate(`/TestsAndStatistics/${BabyDetails[appt.baby_id]?._id}`)}
                            />
                            <Button
                                label="דוח על טיפול "
                                rounded
                                onClick={() => {
                                    setSelectedBabyId(BabyDetails[appt.baby_id]?._id); // קביעת ID של התינוק
                                    setVisible(true); // פתיחת הדיאלוג
                                }}
                            />
                              <p><strong>שעה:</strong> {appt.appointment_time?.time || "לא ידוע"}</p>
                            <p><strong>תז התינוק:</strong> {BabyDetails[appt.baby_id]?.identity || "לא ידוע"}</p>
                            <p><strong>בדיקה:</strong> {appt.status}</p>
                        </Card>
                    ))}
                </div>
            )}

            {/* קומפוננטה של הדיאלוג */}
            <ReportAbaby
                visible={visible}
                setVisible={setVisible}
                babyId={selectedBabyId} // העברת ID של התינוק
                nurseId={user._id}     // העברת ID של האחות
            />
        </div>
    );
}