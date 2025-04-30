import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import BookedAppointmentParent from "./BookedAppointmentParent"
import UseCalendar from './UseCalendar';
import ChatParent from './ChatParent'
import {  Route, Routes } from 'react-router-dom'
import AddBabySecretary from './AddBabySecretary'
import AddScheduleNurse from './AddScheduleNurse'

export default function Parent() {

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
            label: 'AddBabySecretary',
            icon: 'pi pi-star',
            command: () => {
                navigate('/secretary/AddBabySecretary')
            }
        },
        {
            label: 'AddScheduleNurse',
            icon: 'pi pi-search',
            command: () => {
                navigate('/secretary/AddScheduleNurse')
            }
        },
        {
            label:'chat with nurse',
            icon: 'pi pi-comments',
            command: () => {
              navigate('/secretary/ChatParent');
            }
          }
          
    ];

    return (
        <div className="flex flex-column align-items-center">
            <Menubar model={items} />
            <Routes>
                <Route path='/BookedAppointmentParent' element={<BookedAppointmentParent />} />
                <Route path='/UseCalendar' element={<UseCalendar />} />
                <Route path='/ChatParent' element={<ChatParent />} />
                <Route path='/AddBabySecretary' element={<AddBabySecretary />} />
                <Route path='/AddScheduleNurse' element={<AddScheduleNurse />} />

            </Routes>
        </div>
    );
}