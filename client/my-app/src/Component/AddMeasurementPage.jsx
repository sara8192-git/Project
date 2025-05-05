import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';

const AddMeasurementPage = ({ babyId, onClose }) => {
  const token = useSelector((state) => state.token.token);

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const toast = React.useRef(null);

  const handleAddMeasurement = async () => {
    if (!height || !weight) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'חובה להכניס גם גובה וגם משקל', life: 3000 });
      return;
    }

    if (height <= 0 || weight <= 0) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'הערכים חייבים להיות חיוביים', life: 3000 });
      return;
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
      });
      toast.current.show({ severity: 'success', summary: 'הצלחה', detail: 'המדידה נוספה בהצלחה!', life: 3000 });
   
    } catch (err) {
      console.error(err);
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בהוספת מדידה', life: 3000 });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>הוספת מדידה לתינוק</h2>
      <input
        type="number"
        placeholder="גובה (ס״מ)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="משקל (ק״ג)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <Button label="שמור" onClick={handleAddMeasurement} />
      <Button label="ביטול" onClick={onClose} />
    </div>
  );
};

export default AddMeasurementPage;