import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../redux/tokenSlice'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים

    const handleLogin = async (e) => {
        e.preventDefault(); // מונע רענון של הדף
        setError(""); // איפוס שגיאות קודמות
        console.log("email"+email);

        try {
            const response = await axios.post("http://localhost:7002/auth/login", {
               email,
                password
            });

            if (response.status === 200) {
                console.log(response.data.token);

                dispatch(setToken({token:response.data.accessToken,user:response.data.user}))
                alert("התחברת בהצלחה!")
                if(response.data.user.role=="Parent"){
                    navigate('/parent')
                }
                else if(response.data.user.role=="Nurse"){
                    navigate('/nurse')
                }
                else if(response.data.user.role=="Secretary"){
                    navigate('/secretary')
                }
              //שליחה לפי תפקיד

            }
        } catch (error) {
            setError("שם משתמש או סיסמה שגויים");
        }
    };

    return (
        <div className="flex flex-column align-items-center">
            <h2>התחברות</h2>
            <form onSubmit={handleLogin} className="p-fluid">
                <div className="p-field">
                    <label>שם משתמש</label>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="p-field">
                    <label>סיסמה</label>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button type="submit" label="התחבר" icon="pi pi-sign-in" />
            </form>
        </div>
    );
}//קבלת הטוקן בכל מקום רצוי
// const accesstoken=useSelector((state)=>state.token.token)

//יציאת משתמש מסקנה: להפעיל רק ע"י כפתור ולא ע"י רפשרוש
// useEffect(()=>{
//     dispatch(logOut())

// },[])
 //חילוץ
//  const decodeToken = (token) => {
//     if (!token) {
//         throw new Error('No token provided');
//     }
    
//     try {
//         const decoded = jwtDecode(token);
//         return decoded; // Returns the content of the token
//     } catch (error) {
//         console.error('Token is invalid or expired', error);
//         return null;
//     }
// };