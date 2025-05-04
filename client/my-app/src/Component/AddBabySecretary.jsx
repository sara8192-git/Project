import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';

const AddBabySecretary = () => {
    const [formData, setFormData] = useState({
        identity: "",
        name: "",
        dob: "",
        parent: "",
    });
    const toast = useRef(null);
    const token = useSelector((state) => state.token.token);

    const get_idByIndentity = async (props) => {
        try {
            console.log(token);
            const response = await axios.get(
                `http://localhost:7002/user/id/${props}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            handleAddBabySecretary(response.data._id)
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.response.data.message || "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleAddBabySecretary = async (p) => {
        try {

            console.log("p" + p);
            console.log(formData.identity + "   " + formData.name + "  " + formData.dob);
            const formattedDate = new Date(formData.dob).toLocaleDateString('en-CA'); // תאריך בפורמט ISO עם הזמן המקומי

            const response = await axios.post(
                `http://localhost:7002/baby`, {
                identity: formData.identity,
                name: formData.name,
                dob: formattedDate,
                parent_id: p
            }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            if (response) {
                toast.current.show({ severity: "success", summary: "Success", detail: "תינוק חדש נוצר", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: response.message || "שגיאה ברישום", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.response.data.message || "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast} />
            <Card title="הוספת תינוק" className="p-4 w-25">
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="identity">תעודת זהות</label>
                        <InputText id="identity" value={formData.identity} onChange={(e) => handleChange(e, "identity")} />
                    </div>

                    <div className="field">
                        <label htmlFor="name">שם מלא</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange(e, "name")} />
                    </div>

                    <div className="field">
                        <label htmlFor="dob">תאריך לידה </label>
                        <Calendar
                            id="dob"
                            value={formData.dob}
                            onChange={(e) => handleChange(e, "dob")}
                            showButtonBar
                            placeholder="בחר תאריך"
                            dateFormat="dd/mm/yy"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="parent">תז הורה</label>
                        <InputText id="parent" value={formData.parent} onChange={(e) => handleChange(e, "parent")} />
                    </div>



                    {/* <Button label="הוסף" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={get_idByIndentity(formData.parent)} /> */}
                    <Button label="הוסף" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={() => get_idByIndentity(formData.parent)} />

                </div>
            </Card>
        </div>
    );
};

export default AddBabySecretary;
