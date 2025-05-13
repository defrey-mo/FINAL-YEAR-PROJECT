import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


export default function Conduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    student_id: id,
    registration_status: "",
    fee_payment_status: "",
    scholarship_financial_aid: "",
    emotional_wellbeing: "",
    peer_relationship: "",
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
      data: values // Ensure all values in the object are correct and match the backend expectations
    };
  
    try {
      await axios.request(requestConfig2);
      console.log("Form submitted successfully");
      navigate('/system/overview');
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
                        <label htmlFor="type-of-conduct">Perfomance Status</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, registration_status: e.target.value })}
                          value={values.registration_status}
                        >
                            <option>--Enter Students Perfomance--</option>
                            <option>Very Good</option>
                            <option>Good</option>
                            <option>Poor</option>
                            <option>Very Poor</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Fee Payment Status</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, fee_payment_status: e.target.value })}
                          value={values.fee_payment_status}
                        >   <option value="">--Enter payment status--</option>
                            <option>Fully Paid</option>
                            <option>Partially Paid</option>
                            <option>Not Paid</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Scholarship/Financial Aid?</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, scholarship_financial_aid: e.target.value })}
                          value={values.scholarship_financial_aid}
                        >
                            <option value="">--Enter scholarship status--</option>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="actions-taken">Emotional Well-being</label>
                        <select name="ac" id="ac"
                          onChange={(e) => setValues({ ...values, emotional_wellbeing: e.target.value })}
                          value={values.emotional_wellbeing}
                        >
                            <option>--Enter wellbeing--</option>
                            <option>Happy</option>
                            <option>Stressed</option>
                            <option>Anxious</option>
                            <option>Depressed</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Peer Relationships</label>
                        <select name="toc" id="toc"
                          onChange={(e) => setValues({ ...values, peer_relationship: e.target.value })}
                          value={values.peer_relationship}
                        >
                            <option value="">--Enter peer status--</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Poor</option>
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