import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/tokenSlice';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:7002/auth/login", {
                email,
                password
            });

            if (response.status === 200) {
                dispatch(setToken({ token: response.data.accessToken, user: response.data.user }));
                alert("התחברת בהצלחה!");
                if (response.data.user.role === "Parent") {
                    navigate('/parent');
                } else if (response.data.user.role === "Nurse") {
                    navigate('/nurse');
                } else if (response.data.user.role === "Secretary") {
                    navigate('/secretary');
                }
            }
        } catch (error) {
            setError("שם משתמש או סיסמה שגויים");
        }
    };


    return (
        <div className="login-container">
            <div className="login-left">
                {/* תמונת רקע */}
            </div>
            <div className="login-right">
                <div className="login-box">
                    <h1>כניסה לאזור אישי</h1>
                    <p>אזור אישי ללקוחות מקוון בלבד</p>
                    <form onSubmit={handleLogin} className="p-fluid">
                        <div className="p-field">
                            <label>כתובת מייל </label>
                            <InputText
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="הזן תעודת זהות"
                            />
                        </div>
                        <div className="p-field">
                            <label>סיסמה</label>
                            <Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="הזן סיסמה"
                                feedback={false}
                            />
                        </div>
                        {error && <p style={{ color: "black" }}>{error}</p>}
                        <Button
                            type="submit"
                            label="התחברות"
                            className="login-button"
                        />
                    </form>
                    <div className="forgot-password">
                    </div>
                    <div className="extra-links">
                         עדיין לא רשומים? <a href="http://localhost:3000/register">הרשמו עכשיו</a>
                    </div>
                </div>
            </div>
        </div>
    );
}