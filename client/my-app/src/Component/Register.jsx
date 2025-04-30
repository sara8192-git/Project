import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FileUpload } from "primereact/fileupload";

const Register = () => {
    const [formData, setFormData] = useState({
        identity: "",
        name: "",
        email: "",
        password: "",
        role: "",
        emailDomain: "@gmail.com",
        profilePicture: null // שמירת התמונה שהועלתה
    });
    const toast = useRef(null);

    const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleFileUpload = (e) => {
        if (e.files && e.files.length > 0) {
            setFormData({ ...formData, profilePicture: e.files[0] });
            toast.current.show({ severity: "info", summary: "Success", detail: "תמונה הועלתה בהצלחה!" });
        }
    };

    const handleRegister = async () => {
        try {
            // יצירת אובייקט FormData
            const formDataToSend = new FormData();
            formDataToSend.append("identity", formData.identity);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email + formData.emailDomain);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("role", formData.role);

            if (formData.profilePicture) {
                formDataToSend.append("profilePicture", formData.profilePicture);
            }

            const response = await fetch("http://localhost:7002/auth/register", {
                method: "POST",
                body: formDataToSend // שליחת הנתונים כ-FormData
            });

            const data = await response.json();
            if (response.ok) {
                toast.current.show({ severity: "success", summary: "Success", detail: "נרשמת בהצלחה לטיפת חלב!", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message || "שגיאה ברישום", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "שגיאה בחיבור לשרת", life: 3000 });
        }
    };

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <Toast ref={toast} />
            <Card title="הצטרפות לטיפת חלב" className="p-4 w-25">
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

                    <div className="field">
                        <label htmlFor="profilePicture">תמונת פרופיל</label>
                        <FileUpload
                            name="profilePicture"
                            accept="image/*"
                            maxFileSize={1000000}
                            customUpload
                            uploadHandler={handleFileUpload}
                            auto
                        />
                    </div>

                    <Button label="הצטרפות" icon="pi pi-user-plus" className="p-button-success w-full mt-3" onClick={handleRegister} />
                </div>
            </Card>
        </div>
    );
};

export default Register;