import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../redux/tokenSlice'
import { Menubar } from 'primereact/menubar';
import QueueSummaryNurse from './/QueueSummaryNurse'
import {  Route, Routes } from 'react-router-dom'

export default function Nurse() {

    const navigate = useNavigate(); // 🔹 מאפשר ניווט לדפים אחרים
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('./Home')
            }
        },
        {
            label: 'QueueSummaryNurse',
            icon: 'pi pi-star',
            command: () => {
                navigate('/nurse/QueueSummaryNurse')
            }
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            command: () => {
                navigate('/nurse/BookedAppointmentParent')
            }
        }
    ];

    return (
        <div className="flex flex-column align-items-center">
            <Menubar model={items} />
            <Routes>
                <Route path='/QueueSummaryNurse' element={<QueueSummaryNurse />} />
            </Routes>
        </div>
    );
}