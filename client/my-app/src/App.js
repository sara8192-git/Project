import React from 'react';
import './App.css';
import './flags.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Component/Login"; // קומפוננטת ההתחברות
import Register from "./Component/Register"; // קומפוננטת הרישום
import Home from "./Component/Home"; 
import Parent from './Component/Parent';
import Nurse from "./Component/Nurse";
import Secretary from './Component/Secretary';
import AddMeasurementPage from "./Component/AddMeasurementPage";
import TestsAndStatistics from "./Component/TestsAndStatistics";
import ChatParent from './Component/ChatParent'; // קובץ הצ'אט להורה
import ChatNurse from './Component/ChatNurse'; // קובץ הצ'אט לאחות

function App() {
    return (
        <div className="App">
            <Routes>
                {/* ניווט ברירת מחדל */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* נתיבים לקומפוננטות הקיימות */}
                <Route path="/Home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/parent/*" element={<Parent />} />
                <Route path="/Nurse/*" element={<Nurse />} />
                <Route path='/TestsAndStatistics/:id' element={<TestsAndStatistics />} />
                <Route path="/Secretary/*" element={<Secretary />} />
                <Route path="/AddMeasurementPage/:babyId" element={<AddMeasurementPage />} />

                {/* נתיבים חדשים לצ'אט */}
                <Route path="/parent-chat" element={<ChatParent />} /> {/* צ'אט להורה */}
                <Route path="/nurse-chat" element={<ChatNurse />} /> {/* צ'אט לאחות */}
            </Routes>
        </div>
    );
}

export default App;