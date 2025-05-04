import React, { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import axios from "axios";

export default function ReportAbaby({ visible, setVisible, babyId, nurseId, appointmentId, currentStatus, updateStatus }) {
  const token = useSelector((state) => state.token.token);
  const [testDate, setTestDate] = useState(null);
  const [result, setResult] = useState('');

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
      result: result,
    };

    try {
      // שליחת הדוח לשרת
      await axios.post('http://localhost:7002/testResults', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // עדכון הסטטוס בשרת
      const response = await axios.patch('http://localhost:7002/appointment/update-status', {
        _id: appointmentId,
        status: "עודכן",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
console.log(response.data.status);
      // עדכון ה-state של ההורה כדי לגרום לסטטוס להתעדכן מיד
      const updatedStatus = response.data.status || "completed"; // בדוק אם השרת מחזיר סטטוס מעודכן
      updateStatus(appointmentId, updatedStatus); // קריאה לפונקציה שמעדכנת את ה-state המקומי

      setVisible(false); // סגירת הדיאלוג
    } catch (err) {
      alert(`Error: ${err.message}`);
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
          />
        </div>
      </div>
      <Button label="שמור" icon="pi pi-check" onClick={handleSubmit} />
    </Dialog>
  );
}