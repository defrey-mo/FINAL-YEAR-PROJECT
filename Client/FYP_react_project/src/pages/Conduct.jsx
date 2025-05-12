/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Conduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    student_id: id,
    type_of_conduct: "--Select Type--",
    nature_of_incident: "Bullying",
    detailed_description: "",
    action_taken: "Verbal Warning",
    teacher_staff_report: "",
    witness: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:8084/read/${id}`)
      .then(res => {
        if (res.data.length > 0) {
          setValues(prev => ({
            ...prev,
            student_id: res.data[0].student_id
          }));
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestConfig = {
      method: "post",
      url: "http://localhost:8084/conduct",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: values
    };

    try {
      await axios.request(requestConfig);
      console.log("Form submitted successfully");
      // navigate('/system/overview');
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const positiveIncidents = [
    "Respectfulness",
    "Leadership",
    "Helping"
  ];

  const negativeIncidents = [
    "Bullying",
    "Disruptive Behaviour",
    "Cheating Exams",
    "Inciting Strike"
  ];

  const getIncidentOptions = () => {
    if (values.type_of_conduct === "Positive") return positiveIncidents;
    if (values.type_of_conduct === "Negative") return negativeIncidents;
    return [];
  };

  return (
    <div className="updating-page">
      <div className="updating-form">
        <p>Update Student Conduct Details</p>
        <div className="form">
          <div className="conduct-form">
            <form onSubmit={handleSubmit}>
              <span>
                <label>Student Number</label>
                <input
                  value={values.student_id}
                  type="text"
                  name="student_id"
                  id="student-id"
                  readOnly
                />
              </span>
              <span>
              <label htmlFor="type-of-conduct">Type of Conduct</label>
                <select
                  id="type-of-conduct"
                  onChange={(e) =>
                    setValues({...values, type_of_conduct: e.target.value, nature_of_incident: ""})
                  }
                  value={values.type_of_conduct}
                >
                  <option value="">--Select Type--</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </span>
              <span>
              <label htmlFor="nature-of-incident">Nature of Incident</label>
                <select
                  id="nature-of-incident"
                  onChange={(e) =>
                    setValues({ ...values, nature_of_incident: e.target.value })
                  }
                  value={values.nature_of_incident}
                  disabled={!values.type_of_conduct}
                >
                  <option value="">--Select Nature--</option>
                  {getIncidentOptions().map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </span>
              <span>
                <label htmlFor="description">Detailed Description of Incident</label>
                <textarea
                  onChange={(e) => setValues({ ...values, detailed_description: e.target.value })}
                  value={values.detailed_description}
                  id="description"
                  rows="2"
                ></textarea>
              </span>
              <span>
                <label htmlFor="actions-taken">Actions Taken</label>
                <select
                  id="actions-taken"
                  onChange={(e) => setValues({ ...values, action_taken: e.target.value })}
                  value={values.action_taken}
                >
                  <option value="Verbal Warning">Verbal Warning</option>
                  <option value="Written Warning">Written Warning</option>
                  <option value="Parental Notification">Parental Notification</option>
                  <option value="Detention">Detention</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Expulsion">Expulsion</option>
                  <option value="Awarded Certificate of Merit">Awarded Certificate of Merit</option>
                </select>
              </span>
              <span>
                <label htmlFor="reporting">Teacher/Staff Reporting</label>
                <textarea
                  onChange={(e) => setValues({ ...values, teacher_staff_report: e.target.value })}
                  value={values.teacher_staff_report}
                  id="reporting"
                  rows="2"
                ></textarea>
              </span>
              <span>
                <label htmlFor="witness">Witness (if any)</label>
                <textarea
                  onChange={(e) => setValues({ ...values, witness: e.target.value })}
                  value={values.witness}
                  id="witness"
                  rows="2"
                ></textarea>
              </span>
              <button type="submit">SUBMIT</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
