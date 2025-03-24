/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


export default function Conduct() {
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
                    <p>Update Students Status Details</p>
                <div className="form">
                  <div className='status-form'>
                    <form>
                    <span>
                            <label>Students Number</label>
                            <input 
                            value= {values.studentNo}
                            type="text" 
                            name="student-id"
                            id="student-id"
                            required
                            readOnly
                            />
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Registration Status</label>
                        <select name="toc" id="toc">
                            <option value="positive">Fully Registered</option>
                            <option value="negative">Pending</option>
                            <option value="never">Not Registered</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Fee Payment Status</label>
                        <select name="toc" id="toc">
                            <option value="positive">Fully Paid</option>
                            <option value="negative">Partially Paid</option>
                            <option value="never">Not Paid</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Scholarship/Financial Aid?</label>
                        <select name="toc" id="toc">
                            <option value="positive">Yes</option>
                            <option value="negative">No</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="actions-taken">Emotional Well-being</label>
                        <select name="ac" id="ac">
                            <option value="vw">Happy</option>
                            <option value="ww">Stressed</option>
                            <option value="pn">Anxious</option>
                            <option value="dete">Depressed</option>
                        </select>
                        </span>
                        <span>
                        <label htmlFor="type-of-conduct">Peer Relationships</label>
                        <select name="toc" id="toc">
                            <option value="positive">Good</option>
                            <option value="negative">Average</option>
                            <option value="never">Poor</option>
                        </select>
                        </span>
                        <span>
                            <label>Parent/Guardian Contact for Registration Issues</label>
                            <input 
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