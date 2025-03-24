/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function Conduct() {

  const [studentNo, setpupilNo] = useState("");
  const [type_of_conduct, settype_of_conduct] = useState("Positive");
  const [nature_of_incident, setnature_of_incident] = useState("Bullying");
  const [detailed_description, setdetailed_description] = useState("");
  const [action_taken, setaction_taken] = useState("Verbal Warning");
  const [teacher_staff_report, setteacher_staff_report] = useState("");
  const [witness, setwitness] = useState("");
    
  const {id} = useParams();
  const [values, setValues] = useState({
    studentNo: id
  })
  
  useEffect(() => {
    axios.get('http://localhost:8084/read/'+id)
    .then(res => { 
      console.log(res)
      setValues({...values, studentNo:res.data[0].student_id, 
        
      })
    })
    .catch(err => console.log(err))
  }, [id, values])


  return (
    <div>
        <div className='updating-page'>
              
                <div className='updating-form'> 
                    <p>Update Students Conduct Details</p>
                <div className="form">
                  <div className='conduct-form'>
                    <form>
                        <span>
                            <label>Students Number</label>
                            <input
                            onChange={(e) => setpupilNo(e.target.value)} 
                            value= {values.studentNo}
                            type="text" 
                            name="student-id"
                            id="student-id"
                            required
                            disabled
                            />
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Type of Conduct</label>
                        <select name="toc" id="toc" 
                        onChange={(e) => settype_of_conduct(e.target.value)} 
                        value={type_of_conduct}>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="nature-of-incident">Nature of Incident</label>
                        <select name="noi" id="noi"
                        onChange={(e) => setnature_of_incident(e.target.value)}
                        value={nature_of_incident}
                        >
                            <option value="bullying">Bullying</option>
                            <option value="disruptive">Disruptive Behaviour</option>
                            <option value="cheating">Cheating</option>
                            <option value="strike">Inciting Strike</option>
                            <option value="respectfulness">Respectfullness</option>
                            <option value="leadership">Leadership</option>
                        </select>
                        </span>
                        <span>
                            <label htmlFor="description">Detailed Description of Incident</label>
                            <textarea
                            onChange={(e) => setdetailed_description(e.target.value)}
                            value={detailed_description}
                            name="description"
                            id="description"
                            rows="2"
                            ></textarea>
                        </span>
                        <span>
                        <label htmlFor="actions-taken">Actions Taken</label>
                        <select name="ac" id="ac"
                        onChange={(e) => setaction_taken(e.target.value)}
                        value={action_taken}
                        >
                            <option value="vw">Verbal Warning</option>
                            <option value="ww">Written Warning</option>
                            <option value="pn">Parental Notification</option>
                            <option value="dete">Detention</option>
                            <option value="suspe">Suspension</option>
                            <option value="ex">Expulsion</option>
                        </select>
                        </span>
                        <span>
                            <label htmlFor="reporting">Teacher/Staff reporting</label>
                            <textarea
                            onChange={(e) => setteacher_staff_report(e.target.value)}
                            value={teacher_staff_report}
                            name="reporting"
                            id="reporting"
                            rows="2"
                            ></textarea>
                        </span>
                        <span>
                            <label htmlFor="witness">Witness (if any)</label>
                            <textarea
                            onChange={(e) => setwitness(e.target.value)}
                            value={witness}
                            name="witness"
                            id="witness"
                            rows="2"
                            ></textarea>
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
