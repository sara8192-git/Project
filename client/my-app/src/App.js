import logo from './logo.svg';
import './App.css';

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
import UseCalendar from './Component/UseCalender'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Login from "./Component/Login"; // קומפוננטת ההתחברות
import { Button } from "primereact/button";
import Register from "./Component/Register"; // יבוא קומפוננטת הרישום



function App() {

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
);

const navigate = useNavigate();

const items = [
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Features',
        icon: 'pi pi-star',
        command: () => {
            navigate('./UseCalendar')}
    },
    {
        label: 'Projects',
        icon: 'pi pi-search',
        
    },
    {
        label: 'Contact',
        icon: 'pi pi-envelope',
        badge: 3,
        template: itemRenderer
    }
];
const personalAreaButton = (
    <div className="flex gap-2">
        <Button 
            label="כניסה לאזור האישי" 
            icon="pi pi-user" 
            className="p-button-outlined" 
            onClick={() => navigate("/login")} 
        />
        <Button 
            label="הצטרפות לטיפת חלב" 
            icon="pi pi-user-plus" 
            className="p-button-primary" 
            onClick={() => navigate("/register")} 
        />
    </div>
);

const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
const end = (
    <div className="flex align-items-center gap-2">
        <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
    </div>
);

return (
         <div className="App">
        <div className="card">
         <Menubar model={items} end={personalAreaButton} />

        </div>
            <Routes> 
                <Route path='/UseCalendar' element={<UseCalendar/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* נתיב חדש להרשמה */}

            </Routes>
  
    </div>
)
}

export default App;
