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
            console.log(props);
            const response = await axios.get(
                `http://localhost:7002/user/id/${props}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data._id);
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

            // בדיקה אם התאריך קטן מהתאריך הנוכחי
            if (selectedDate < today.setHours(0, 0, 0, 0)) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "אי אפשר לקבוע שעות ליום שעבר",
                    life: 3000
                });
                return;
            }

            const formattedDate = selectedDate.toLocaleDateString('en-CA'); // תאריך בפורמט ISO עם הזמן המקומי

            console.log("formData.date" + formData.date + "formData.startTime" + formData.startTime + "formData.endTime" + formData.endTime);
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
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast} />
            <Card title="הוספת מערכת שעות לאחות " className="p-4 w-25">
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="identity">תעודת זהות אחות</label>
                        <InputText id="identity" value={formData.identity} onChange={(e) => handleChange(e, "identity")} />
                    </div>

                    <div className="field">
                        <label htmlFor="name">תאריך </label>
                        <Calendar
                            id="date"
                            value={formData.date}
                            onChange={(e) => handleChange(e, "date")}
                            showButtonBar
                            placeholder="בחר או כתוב תאריך"
                            dateFormat="dd/mm/yy"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="startTime">שעת התחלה </label>
                        <div className="p-inputgroup">
                            <InputText id="startTime" value={formData.startTime} onChange={(e) => handleChange(e, "startTime")} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="endTime">שעת סיום </label>
                        <InputText id="endTime" value={formData.endTime} onChange={(e) => handleChange(e, "endTime")} />
                    </div>

                    <Button label="הוסף" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={() => get_idByIndentity(formData.identity)} />
                </div>
            </Card>
        </div>
    );
};

export default AddScheduleNurse;