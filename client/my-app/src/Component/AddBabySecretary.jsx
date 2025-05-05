import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import { useSelector } from 'react-redux';
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
            toast.current.show({ severity: "error", summary: "Error", detail: error.response.data.message || "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleAddBabySecretary = async (parentId) => {
        try {
            const formattedDate = new Date(formData.dob).toLocaleDateString('en-CA');

            const response = await axios.post(
                `http://localhost:7002/baby`,
                {
                    identity: formData.identity,
                    name: formData.name,
                    dob: formattedDate,
                    parent_id: parentId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
        <div className="register-container">
            <Toast ref={toast} />
            <div className="login-left">
                {/* תמונת רקע */}
            </div>
            <div className="login-right">
                <div className="login-box">
                    <h1>הוספת תינוק</h1>
                    <p>הזן את הפרטים כדי להוסיף תינוק</p>
                    <form onSubmit={(e) => { e.preventDefault(); get_idByIndentity(formData.parent); }} className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="identity">תעודת זהות</label>
                            <InputText
                                id="identity"
                                value={formData.identity}
                                onChange={(e) => handleChange(e, "identity")}
                                placeholder="הזן תעודת זהות"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="name">שם מלא</label>
                            <InputText
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange(e, "name")}
                                placeholder="הזן שם מלא"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="dob">תאריך לידה</label>
                            <Calendar
                                id="dob"
                                value={formData.dob}
                                onChange={(e) => handleChange(e, "dob")}
                                showButtonBar
                                placeholder="בחר תאריך"
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="parent">תעודת זהות הורה</label>
                            <InputText
                                id="parent"
                                value={formData.parent}
                                onChange={(e) => handleChange(e, "parent")}
                                placeholder="הזן תעודת זהות של ההורה"
                            />
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

export default AddBabySecretary;