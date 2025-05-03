import React, { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import axios from "axios";

export default function ReportAbaby({ visible, setVisible, babyId, nurseId ,appoitmentId}) {
    const token = useSelector((state) => state.token.token);
    const [testDate, setTestDate] = useState(null);
    const [result, setResult] = useState('');

    // Toolbar configuration without the Heading (header) options
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // Text styling
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
        [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript/Superscript
        [{ 'indent': '-1' }, { 'indent': '+1' }], // Indentation
        [{ 'direction': 'rtl' }], // Text direction
        [{ 'size': ['small', false, 'large', 'huge'] }], // Font size
        [{ 'color': [] }, { 'background': [] }], // Text color and background
        [{ 'align': [] }], // Alignment
        ['link', 'code-block'], // Links and code blocks
        ['clean'] // Remove formatting
    ];

    useEffect(() => {
        if (babyId) {
            setTestDate(null);
            setResult('');
        }
    }, [babyId]);

    const handleSubmit = async () => {
        const payload = {
            baby_id: babyId,
            nurse_id: nurseId,
            test_date: {
                time: new Date().toLocaleTimeString(),
                day: testDate
            },
            result: result

        };

        try {
            const response = await fetch('http://localhost:7002/testResults', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                alert("Test result saved successfully: " + JSON.stringify(data));
                setVisible(false); // Close the dialog
            } else {
                const error = await response.json();
                alert("Error saving test result: " + error.message);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
console.log("appoitmentId"+appoitmentId);

        try {
            const response = await axios.patch('http://localhost:7002/appointment/update-status',{
                _id: appoitmentId,
            } ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert("v: " + data.message);

            } else {
                const error = await response.json();
                alert("Error saving test result: " + error.message);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <Dialog header="הוספת דוח חדש" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="testDate">תאריך הבדיקה</label>
                    <Calendar id="testDate" value={testDate} onChange={(e) => setTestDate(e.value)} dateFormat="dd/mm/yy" />
                </div>
                <div className="field">
                    <label htmlFor="result">תוצאה</label>
                    <Editor
                        id="result"
                        value={result}
                        onTextChange={(e) => setResult(e.htmlValue)}
                        style={{ height: '200px' }}
                        modules={{
                            toolbar: toolbarOptions, // Custom toolbar without Heading
                        }}
                    />
                </div>
            </div>
            <Button label="שמור" icon="pi pi-check" onClick={handleSubmit} />
        </Dialog>
    );
}