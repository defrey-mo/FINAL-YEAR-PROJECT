/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


export default function Conduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    student_id: id,
    registration_status: "Fully Registered",
    fee_payment_status: "Fully Paid",
    scholarship_financial_aid: "Yes",
    emotional_wellbeing: "Happy",
    peer_relationship: "Good",
    guardian_contact: ""
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

    const requestConfig2 = {
      method: "post",
      url: "http://localhost:8084/status",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: values
    };

    try {
      await axios.request(requestConfig2);
      console.log("Form submitted successfully");
      // navigate('/system/overview');
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
        <div className='updating-page'>
              
                <div className='updating-form'> 
                    <p>Update Students Status Details</p>
                <div className="form">
                  <div className='status-form'>
                    <form onSubmit={handleSubmit}> 
                    <span>
                            <label>Students Number</label>
                            <input 
                            value= {values.student_id}
                            type="text" 
                            name="student-id"
                            id="student-id"
                            required
                            readOnly
                            />
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Registration Status</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, registration_status: e.target.value })}
                          value={values.registration_status}
                        >
                            <option value="positive">Fully Registered</option>
                            <option value="negative">Pending</option>
                            <option value="never">Not Registered</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Fee Payment Status</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, fee_payment_status: e.target.value })}
                          value={values.fee_payment_status}
                        >
                            <option value="positive">Fully Paid</option>
                            <option value="negative">Partially Paid</option>
                            <option value="never">Not Paid</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Scholarship/Financial Aid?</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, scholarship_financial_aid: e.target.value })}
                          value={values.scholarship_financial_aid}
                        >
                            <option value="positive">Yes</option>
                            <option value="negative">No</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="actions-taken">Emotional Well-being</label>
                        <select name="ac" id="ac"
                          onChange={(e) => setValues({ ...values, emotional_wellbeing: e.target.value })}
                          value={values.emotional_wellbeing}
                        >
                            <option value="vw">Happy</option>
                            <option value="ww">Stressed</option>
                            <option value="pn">Anxious</option>
                            <option value="dete">Depressed</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Peer Relationships</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, peer_relationship: e.target.value })}
                          value={values.peer_relationship}
                        >
                            <option value="positive">Good</option>
                            <option value="negative">Average</option>
                            <option value="never">Poor</option>
                        </select>
                        </span>
                        <span>
                            <label>Parent/Guardian Contact for Registration Issues</label>
                            <input 
                            onChange={(e) => setValues({ ...values, guardian_contact: e.target.value })}
                            value={values.guardian_contact}
                            type="text" 
                            name="student-id"
                            id="student-id"
                            required
                            />
                        </span>
                        <button>SUBMIT</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}