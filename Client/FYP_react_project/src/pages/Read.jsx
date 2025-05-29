import React, { useEffect, useState } from 'react'
import "../CSS/read.css";
import { useParams } from 'react-router-dom';
import axios from "axios";

export default function Read() {
  const { id } = useParams();
  const [students, setStudent] = useState({});
  const [conductRecords, setConductRecords] = useState([]);


 useEffect(() => {
  axios.get('http://localhost:8084/staff-reading/' + id)
    .then(res => {
      const rows = res.data;

      // Set student and status data from first row
      setStudent({
        student_id: rows[0].student_id,
        firstname: rows[0].firstname,
        middlename: rows[0].middlename,
        surname: rows[0].surname,
        dob: rows[0].dob,
        gender: rows[0].gender,
        medical_info: rows[0].medical_info,
        registration_status: rows[0].registration_status,
        peer_relationship: rows[0].peer_relationship,
        fee_payment_status: rows[0].fee_payment_status,
        guardian_contact: rows[0].guardian_contact
      });

      // Extract distinct conduct records (filter out null conduct entries)
      const conductData = rows
        .filter(row => row.type_of_conduct !== null) // Only if conduct exists
        .map(row => ({
          type_of_conduct: row.type_of_conduct,
          nature_of_incident: row.nature_of_incident,
          detailed_description: row.detailed_description,
          action_taken: row.action_taken
        }));

      setConductRecords(conductData);
    })
    .catch(err => console.log(err));
}, [id]);



  return (
    <div>
      <div className='reading-students'>
        <h2>Student Info</h2>
      <p><strong>Student Number:</strong> {students.student_id || "N/A"}</p>
      <p><strong>Full Name:</strong> {students.firstname} {students.middlename} {students.surname || "N/A"}</p>
      <p><strong>Date of Birth:</strong> {students.dob || "N/A"}</p>
      <p><strong>Gender:</strong> {students.gender || "N/A"}</p>
      <p><strong>Medical Info:</strong> {students.medical_info || "N/A"}</p>

      <h2>Status Records</h2>
      <p><strong>Registration Status:</strong> {students.registration_status || "N/A"}</p>
      <p><strong>Peer Relationship:</strong> {students.peer_relationship || "N/A"}</p>
      <p><strong>Fee Payment Status:</strong> {students.fee_payment_status || "N/A"}</p>
      <p><strong>Guardian Contact:</strong> {students.guardian_contact || "N/A"}</p>

      <h2>Conduct Records</h2>
      {conductRecords.map((record, index) => (
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
    </div>
  );
}
