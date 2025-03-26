import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        identity:"",
        name: "",
        email: "",
        password: "",
        emailDomain: "@gmail.com"
    });
    const toast = useRef(null);


    const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };
    try {
        const response = await axios.post("http://localhost:7000/auth/register", {
            formData
        });

        if (response.status === 200) {
            const token = response.data.token;
            localStorage.setItem("token", token); // 🔒 שמירת הטוקן ב-localStorage
            //להעביר לניתוב של דף הבית או האזור האישי
            navigate("/personal-area"); // ⬅️ מעבר לאזור האישי לאחר התחברות מוצלחת
        }
    } catch (error) {
        setError("שם משתמש או סיסמה שגויים");
    }
    const handleRegister = () => {
        toast.current.show({ severity: "success", summary: "Success", detail: "נרשמת בהצלחה לטיפת חלב!", life: 3000 });
    };

    
    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast} />
            <Card title="הצטרפות לטיפת חלב" className="p-4 w-25">
                <div className="p-fluid">
                <div className="field">
                        <label htmlFor="identity"> תעודת זהות</label>
                        <InputText id="identity" value={formData.identity} onChange={(e) => handleChange(e, "identity")} />
                    </div>
                    <div className="field">
                        <label htmlFor="name">שם מלא</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange(e, "name")} />
                    </div>

                    <div className="field">
                        <label htmlFor="email">אימייל</label>
                        <div className="p-inputgroup">
                            <InputText id="email" value={formData.email} onChange={(e) => handleChange(e, "email")} />
                            <Dropdown value={formData.emailDomain} options={emailDomains.map(domain => ({ label: domain, value: domain }))} onChange={(e) => handleChange(e, "emailDomain")} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="password">סיסמה</label>
                        <Password id="password" value={formData.password} onChange={(e) => handleChange(e, "password")} toggleMask feedback />
                        <small>הסיסמה חייבת לכלול אות גדולה, אות קטנה ומספר</small>
                    </div>

                  
                    <Button label="הצטרפות" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={handleRegister} />
                </div>
            </Card>
        </div>
    );
};

export default Register;
