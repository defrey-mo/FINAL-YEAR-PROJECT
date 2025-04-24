import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/studentReport.css";

export default function StudentReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");

  // Get student number from location state (passed from CheckStudent)
  const student_id = location.state?.student_id;

  useEffect(() => {
    if (!student_id) {
      navigate("/"); // Navigate back to CheckStudent if no student number
      return;
    }

    const fetchReport = async () => {
      try {
        // Make a GET request to fetch report data using student number
        const res = await axios.get(`http://localhost:8084/report/${student_id}`);

        if (res.data.length === 0) {
          setError("Student number not found in the database.");
        } else {
          setReportData(res.data); // Set report data
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching report.");
      }
    };

    fetchReport();
  }, [student_id, navigate]);

  if (!student_id) return null; // Prevent rendering if no student number

  return (
    <div className="report-page">
      <h1>Student Report</h1>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {reportData.length > 0 && (
        <div className="report">
          <h2>Student Info</h2>
          <p><strong>Full Name:</strong> {reportData[0].firstname} {reportData[0].middlename} {reportData[0].surname}</p>
          <p><strong>Date of birth:</strong> {reportData[0].dob}</p>
          <p><strong>Gender:</strong> {reportData[0].gender}</p>
          <p><strong>Medical Info:</strong> {reportData[0].medical_info}</p>

          
          <h2>Conduct Records</h2>
            {reportData.map((record, index) => (
              <div key={index} className="conduct-entry">
                <h3>Incident {index + 1}</h3>
                <p><strong>Type of Conduct:</strong> {record.type_of_conduct}</p>
                <p><strong>Nature of Incident:</strong> {record.nature_of_incident}</p>
                <p><strong>Description of incident:</strong> {record.detailed_description}</p>
                <p><strong>Action Taken:</strong> {record.action_taken}</p>
                <hr />
              </div>
            ))} 

          <h2>Status Records</h2>
          <p><strong>Registration status:</strong> {reportData[0].registration_status}</p>
          <p><strong>Peer Relationship:</strong> {reportData[0].peer_relationship}</p>
          <p><strong>Fee payment status:</strong> {reportData[0].fee_payment_status}</p>
          <p><strong>Guardian Contact:</strong> {reportData[0].guardian_contact}</p>
          
        </div>
      )}
    </div>
  );
}
