import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import AddMeasurementPage from "./AddMeasurementPage";
import TestsAndStatistics from "./TestsAndStatistics";
import ReportAbaby from "./ReportAbaby";

export default function QueueSummaryNurse() {
  const [appointments, setAppointments] = useState([]);
  const [babyDetails, setBabyDetails] = useState({});
  const [measurementModalVisible, setMeasurementModalVisible] = useState(false);
  const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.token.user);

  // פונקציה לעדכון סטטוס של תור מסוים
  const updateAppointmentStatus = (appointmentId, updatedStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === appointmentId
          ? { ...appt, status: updatedStatus || "לא ידוע" }
          : appt
      )
    );
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7002/appointment/Nurse/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(response.data);

      const babyData = {};
      for (const appt of response.data) {
        const { baby_id } = appt;
        if (baby_id) {
          const baby = await axios.get(
            `http://localhost:7002/baby/${baby_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then((r) => r.data);
          babyData[baby_id] = baby;
        }
      }
      setBabyDetails(babyData);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAppointments();
    }
  }, [user]);

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "30px",
      justifyItems: "center",
      padding: "30px",
    },
    card: {
      width: "250px",
      height: "350px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "4px solid #90ee90",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      boxSizing: "border-box",
      backgroundColor: "white",
    },
    header: {
      textAlign: "center",
      marginBottom: "16px",
      fontSize: "24px",
    },
    emptyMessage: {
      textAlign: "center",
      fontSize: "18px",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    button: {
      width: "100%",
    },
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={styles.header}>התורים שלי</h2>

      {appointments.length === 0 ? (
        <p style={styles.emptyMessage}>אין תורים להצגה</p>
      ) : (
        <div style={styles.container}>
          {appointments.map((appt) => {
            const baby = babyDetails[appt.baby_id];
            return (
              <div key={appt._id} style={styles.card}>
                <div>
                  <p><strong>תינוק:</strong> {baby?.identity || "לא ידוע"}</p>
                  <p><strong>שעה:</strong> {appt.appointment_time?.time || "לא ידוע"}</p>
                  <p><strong>בדיקה:</strong> {appt.status || "לא ידוע"}</p>
                </div>
                <div style={styles.buttonContainer}>
                  <Button
                    label="גובה/משקל"
                    rounded
                    size="small"
                    style={styles.button}
                    onClick={() => {
                      setSelectedBabyId(baby?._id);
                      setMeasurementModalVisible(true);
                    }}
                  />
                  <Button
                    label="סטטיסטיקות"
                    rounded
                    size="small"
                    style={styles.button}
                    onClick={() => {
                      setSelectedBabyId(baby?._id);
                      setStatisticsModalVisible(true);
                    }}
                  />
                  <Button
                    label="דוח טיפול"
                    rounded
                    size="small"
                    style={styles.button}
                    onClick={() => {
                      setSelectedAppointment(appt);
                      setVisible(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* חלון צף עבור הוספת מדידה */}
      <Dialog
        header="הוספת מדידה"
        visible={measurementModalVisible}
        style={{ width: "50vw" }}
        onHide={() => setMeasurementModalVisible(false)}
      >
        <AddMeasurementPage
          babyId={selectedBabyId}
          onClose={() => setMeasurementModalVisible(false)}
        />
      </Dialog>

      {/* חלון צף עבור סטטיסטיקות */}
      <Dialog
        header="סטטיסטיקות גובה ומשקל"
        visible={statisticsModalVisible}
        style={{ width: "50vw", height: "40vh", borderRadius: "0" }} // הקטנת הרוחב והגובה
        onHide={() => setStatisticsModalVisible(false)}
      >
        <TestsAndStatistics
          babyId={selectedBabyId}
          onClose={() => setStatisticsModalVisible(false)}
        />
      </Dialog>

      {selectedAppointment && (
        <ReportAbaby
          visible={visible}
          setVisible={setVisible}
          babyId={selectedAppointment?.baby_id}
          nurseId={user._id}
          appointmentId={selectedAppointment?._id}
          currentStatus={selectedAppointment?.status || "לא ידוע"}
          updateStatus={updateAppointmentStatus}
        />
      )}
    </div>
  );
}