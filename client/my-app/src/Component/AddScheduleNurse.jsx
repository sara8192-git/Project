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

import { useDispatch, useSelector } from 'react-redux';

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
                `http://localhost:7002/user/id/${props}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data._id);
            handleAddBabySecretary(response.data._id)
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleAddBabySecretary = async (p) => {
        try {
            const formattedDate = new Date(formData.date).toLocaleDateString('en-CA'); // תאריך בפורמט ISO עם הזמן המקומי

            console.log("formData.date" + formData.date+"formData.startTime"+formData.startTime+"formData.endTime"+formData.endTime);
            const response = await axios.post(
                `http://localhost:7002/nurseScheduler`, {
                identity: p,
                workingDay: formattedDate,
                startTime: formData.startTime,
                endTime: formData.endTime
            }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response) {
                toast.current.show({ severity: "success", summary: "Success", detail: "נרשמת בהצלחה לטיפת חלב!", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: response.message || "שגיאה ברישום", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "שגיאה בחיבור לשרת", life: 3000 });
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
                        />                    </div>

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



                    {/* <Button label="הוסף" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={get_idByIndentity(formData.parent)} /> */}
                    <Button label="הוסף" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={() => get_idByIndentity(formData.identity)} />

                </div>
            </Card>
        </div>
    );
};

export default AddScheduleNurse;
