import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../redux/tokenSlice'
import { Menubar } from 'primereact/menubar';
import BookedAppointmentParent from ".//BookedAppointmentParent"
import UseCalendar from './UseCalendar';
import ChatParent from './ChatParent'
import {  Route, Routes } from 'react-router-dom'

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
            label: 'Features',
            icon: 'pi pi-star',
            command: () => {
                navigate('/parent/UseCalendar')
            }
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            command: () => {
                navigate('/parent/BookedAppointmentParent')
            }
        },
        {
            label:'chat with nurse',
            icon: 'pi pi-comments',
            command: () => {
              navigate('/parent/ChatParent');
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

            </Routes>
        </div>
    );
}