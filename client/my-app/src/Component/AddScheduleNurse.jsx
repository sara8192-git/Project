import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import { Calendar } from 'primereact/calendar';

import { useSelector } from 'react-redux';

const AddScheduleNurse = () => {
    const [formData, setFormData] = useState({
        identity: "",
        date: "",
        startTime: "",
        endTime: "",
    });
    const toast = useRef(null);
    const token = useSelector((state) => state.token.token);

    const get_idByIndentity = async (props) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/user/id/${props}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            handleAddBabySecretary(response.data._id);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "שגיאה בחיבור לשרת";
            toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
        }
    };

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleAddBabySecretary = async (p) => {
        try {
            const today = new Date();
            const selectedDate = new Date(formData.date);

            if (selectedDate < today.setHours(0, 0, 0, 0)) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "אי אפשר לקבוע שעות ליום שעבר",
                    life: 3000
                });
                return;
            }

            const formattedDate = selectedDate.toLocaleDateString('en-CA');

            const response = await axios.post(
                `http://localhost:7002/nurseScheduler`,
                {
                    identity: p,
                    workingDay: formattedDate,
                    startTime: formData.startTime,
                    endTime: formData.endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response) {
                toast.current.show({ severity: "success", summary: "Success", detail: "מערכת שעות נוצרה בהצלחה!", life: 3000 });
            } else {
                const errorMessage = response.data?.message || "שגיאה ברישום";
                toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "שגיאה בחיבור לשרת";
            toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
        }
    };

    return (
        <div className="register-container">
            <Toast ref={toast} />
            <div className="login-left">
                {/* תמונת רקע */}
            </div>
            <div className="login-right">
                <div className="login-box">
                    <h1>הוספת מערכת שעות לאחות</h1>
                    <p>הזן את הפרטים כדי להוסיף מערכת שעות</p>
                    <form onSubmit={(e) => { e.preventDefault(); get_idByIndentity(formData.identity); }} className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="identity">תעודת זהות אחות</label>
                            <InputText id="identity" value={formData.identity} onChange={(e) => handleChange(e, "identity")} placeholder="הזן תעודת זהות" />
                        </div>

                        <div className="p-field">
                            <label htmlFor="date">תאריך</label>
                            <Calendar
                                id="date"
                                value={formData.date}
                                onChange={(e) => handleChange(e, "date")}
                                showButtonBar
                                placeholder="בחר או כתוב תאריך"
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="startTime">שעת התחלה</label>
                            <InputText id="startTime" value={formData.startTime} onChange={(e) => handleChange(e, "startTime")} placeholder="הזן שעת התחלה" />
                        </div>

                        <div className="p-field">
                            <label htmlFor="endTime">שעת סיום</label>
                            <InputText id="endTime" value={formData.endTime} onChange={(e) => handleChange(e, "endTime")} placeholder="הזן שעת סיום" />
                        </div>

                        <Button
                            type="submit"
                            label="הוסף"
                            className="login-button"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddScheduleNurse;