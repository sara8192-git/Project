import logo from './logo.svg';
import './App.css';
import './flags.css'
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import React, { useState } from "react";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // או תנסה ערכה אחרת
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Login from "./Component/Login"; // קומפוננטת ההתחברות
import { Button } from "primereact/button";
import Register from "./Component/Register"; // יבוא קומפוננטת הרישום
import Home from "./Component/Home";
import Parent from './Component/Parent'
import Nurse from "./Component/Nurse"
import Secretary from './Component/Secretary'
import AddMeasurementPage from "./Component/AddMeasurementPage"
import TestsAndStatistics from "./Component/TestsAndStatistics"
function App() {


    return (
        <div className="App">
            <div className="card">

            </div>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path='/Home' element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* נתיב חדש להרשמה */}
                <Route path="/parent/*" element={<Parent />} /> {/* נתיב חדש להרשמה */}
                <Route path="/Nurse/*" element={<Nurse />} /> {/* נתיב חדש להרשמה */}
                <Route path='/TestsAndStatistics/:id' element={<TestsAndStatistics />} />

                <Route path="/Secretary/*" element={<Secretary />} /> {/* נתיב חדש להרשמה */}
                <Route path="/AddMeasurementPage/:babyId" element={<AddMeasurementPage />} />
            </Routes>

        </div>
    )
}

export default App;
