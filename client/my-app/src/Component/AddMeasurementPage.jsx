import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { useSelector } from 'react-redux';

const AddMeasurementPage = () => {
  const token = useSelector((state) => state.token.token)

  const { babyId } = useParams()
  const navigate = useNavigate()

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const handleAddMeasurement = async () => {
    try {
      await axios.patch('http://localhost:7002/baby', {
        identity: babyId,
        height,
        weight
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      alert('המדידה נוספה בהצלחה!')
      navigate(-1)  // חזרה לעמוד הקודם
    } catch (err) {
      console.error(err)
      alert('שגיאה בהוספת מדידה')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">הוספת מדידה לתינוק</h2>
        <input
          type="number"
          placeholder="גובה (ס״מ)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          placeholder="משקל (ק״ג)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        
        <div className="flex justify-between">
          <Button label="שמור" onClick={handleAddMeasurement} className="p-button-success" />
          <Button label="ביטול" onClick={() => navigate(-1)} className="p-button-secondary" />
          
        </div>
      </div>
    </div>
  )
}

export default AddMeasurementPage
