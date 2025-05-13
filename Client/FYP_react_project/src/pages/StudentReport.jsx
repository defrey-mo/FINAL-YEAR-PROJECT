import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/studentReport.css";

export default function StudentReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [recordSource, setRecordSource] = useState(null);
  const [error, setError] = useState("");
  const student_id = location.state?.student_id;

  useEffect(() => {
    if (!student_id) {
      navigate("/");
      return;
    }

    const fetchReports = async () => {
      try {
        // Fetch from active records
        const activeRes = await axios.get(`http://localhost:8084/active/${student_id}`);
        setStudentData(activeRes.data.data);
        setRecordSource("active");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Not found in active, try deleted
          try {
            const deletedRes = await axios.get(`http://localhost:8084/inactive/${student_id}`);
            setStudentData(deletedRes.data.data);
            setRecordSource("deleted");
          } catch (delErr) {
            if (delErr.response?.status === 404) {
              setError("Student not found in both active and deleted records.");
            } else {
              setError("Error fetching deleted student data.");
            }
          }
        } else {
          setError("Error fetching active student data.");
        }
      }
    };

    fetchReports();
  }, [student_id, navigate]);

  if (!student_id) return null;
  if (error) return <div className="report-page"><p style={{ color: "red" }}>{error}</p></div>;
  if (!studentData.length) return <div className="report-page">Loading...</div>;

  const studentInfo = studentData[0]; // Use first row for static info

  return (
    <div className="report-page">
      <h1>Student Report</h1>
      <p><strong>Record Source:</strong> {recordSource === "deleted" ? "Deleted Records" : "Active Records"}</p>

      <h2>Student Info</h2>
      <p><strong>Full Name:</strong> {studentInfo.firstname} {studentInfo.middlename} {studentInfo.surname || "N/A"}</p>
      <p><strong>Date of Birth:</strong> {studentInfo.dob || "N/A"}</p>
      <p><strong>Gender:</strong> {studentInfo.gender || "N/A"}</p>
      <p><strong>Medical Info:</strong> {studentInfo.medical_info || "N/A"}</p>

      <h2>Status Records</h2>
      <p><strong>Registration Status:</strong> {studentInfo.registration_status || "N/A"}</p>
      <p><strong>Peer Relationship:</strong> {studentInfo.peer_relationship || "N/A"}</p>
      <p><strong>Fee Payment Status:</strong> {studentInfo.fee_payment_status || "N/A"}</p>
      <p><strong>Guardian Contact:</strong> {studentInfo.guardian_contact || "N/A"}</p>

      <h2>Conduct Records</h2>
      {studentData.map((record, index) => (
        <div key={index} className="conduct-entry">
          <h3>Incident {index + 1}</h3>
          <p><strong>Type of Conduct:</strong> {record.type_of_conduct || "N/A"}</p>
          <p><strong>Nature of Incident:</strong> {record.nature_of_incident || "N/A"}</p>
          <p><strong>Description of Incident:</strong> {record.detailed_description || "N/A"}</p>
          <p><strong>Action Taken:</strong> {record.action_taken || "N/A"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
