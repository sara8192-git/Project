import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useSelector } from 'react-redux'

const AddMeasurementPage = () => {
  const token = useSelector((state) => state.token.token)
  const { babyId } = useParams()
  const navigate = useNavigate()

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const toast = React.useRef(null)

  const handleAddMeasurement = async () => {
    // ולידציות
    if (!height || !weight) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'חובה להכניס גם גובה וגם משקל', life: 3000 })
      return
    }

    if (height <= 0 || weight <= 0) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'הערכים חייבים להיות חיוביים', life: 3000 })
      return
    }

    if (height > 200) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'אי אפשר להכניס גובה יותר מ-200 ס״מ', life: 3000 })
      return
    }

    if (weight > 30) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'אי אפשר להכניס משקל יותר מ-30 ק״ג', life: 3000 })
      return
    }

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
      toast.current.show({ severity: 'success', summary: 'הצלחה', detail: 'המדידה נוספה בהצלחה!', life: 3000 })
      setTimeout(() => navigate(-1), 3000) // חזרה לעמוד הקודם אחרי 3 שניות
    } catch (err) {
      console.error(err)
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בהוספת מדידה', life: 3000 })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toast ref={toast} />
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