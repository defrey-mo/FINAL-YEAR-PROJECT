/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import "../CSS/update.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Update() {
  const {id} = useParams();
  const [values, setValues] = useState({
    studentNo: id,
    firstname: '',
    middlename: '',
    surname: '',
    dob: '',
    gender: '',
    medical_info: '',
    guardian_fullnames: '',
    guardian_phone: '',
    guardian_email: '',
    home_address: ''
  })
  useEffect(() => {
    axios.get('http://localhost:8084/read/'+id)
    .then(res => { 
      console.log(res)
      setValues({...values, student_id:res.data[0].student_id, 
        firstname:res.data[0].firstname,
        middlename:res.data[0].middlename,
        surname:res.data[0].surname,
        medical_info:res.data[0].medical_info,
        gender: res.data[0].gender,
        dob: res.data[0].dob,
        guardian_fullnames:res.data[0].guardian_fullnames,
        guardian_phone:res.data[0].guardian_phone,
        guardian_email:res.data[0].guardian_email,
        home_address:res.data[0].home_address
      })
    })
    .catch(err => console.log(err))
  }, [id])

  const navigate = useNavigate();

  
  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8084/update/'+id, values)
    .then(res => {
      console.log(res)
    }).catch(err => console.log(err));
  }

  


  return (
    <div className='updating-page'>
        <div className='updating-form'> 
            <h2>Update Students Details</h2>
        <div className="form">
          <div className='section'>
            <form onSubmit={handleUpdate}>
              <fieldset>
                <legend>Basic Details</legend>
              <span>
              <label>Students Number</label>
              <input 
              value= {values.student_id}
              onChange={e => setValues({...values, student_id: e.target.value})}
              type="text" 
              name="student-id"
              id="student-id"
              required
              disabled
              />
              </span>
              <span>
              <label>First Name</label>
              <input 
              value= {values.firstname}
              onChange={e => setValues({...values, firstname: e.target.value})}
              type="text" 
              name="firstname"
              id="firstname"
              required
              />
              </span>
              <span>
              <label>Middle Name</label>
              <input 
              value= {values.middlename}
              onChange={e => setValues({...values, middlename: e.target.value})}
              type="text" 
              name="middle-name"
              id="middle-name"
              required
              />
              </span>
              <span>
              <label>Last Name</label>
              <input 
              value= {values.surname}
              onChange={e => setValues({...values, surname: e.target.value})}
              type="text" 
              name="surname"
              id="surname"
              required
              />
              </span>
              <span>
              <label>Date of Birth</label>
              <input 
              value= {values.dob}
              onChange={e => setValues({...values, dob: e.target.value})}
              type="text" 
              name="surname"
              id="surname"
              required
              />
              </span>
              <span>
              <label>Gender</label>
              <input 
              value= {values.gender}
              onChange={e => setValues({...values, gender: e.target.value})}
              type="text" 
              name="gender"
              id="gender"
              required
              disabled
              />
              </span>
              <span>
              <label>Medical Conditions if Any</label>
              <textarea
                value= {values.medical_info}
                onChange={e => setValues({...values, medical_info: e.target.value})}
                name="medical-condition"
                id="medical-condition"
                rows={5}
              ></textarea>
              </span>
              </fieldset>
              <fieldset>
                <legend>Guardian and Address Information</legend>
                <span>
              <label>Full Names</label>
              <input 
              value= {values.guardian_fullnames}
              onChange={e => setValues({...values, guardian_fullnames: e.target.value})}
              type="text" 
              name="surname"
              id="surname"
              required
              />
              </span>
              <span>
              <label>Phone Number</label>
              <input 
              value= {values.guardian_phone}
              onChange={e => setValues({...values, guardian_phone: e.target.value})}
              type="text" 
              name="surname"
              id="surname"
              required
              />
              </span>
              <span>
              <label>Email</label>
              <input 
              value= {values.guardian_email}
              onChange={e => setValues({...values, guardian_email: e.target.value})}
              type="text" 
              name="surname"
              id="surname"
              required
              />
              </span>
              <span>
              <label>Home Address</label>
              <textarea
                value= {values.home_address}
                onChange={e => setValues({...values, home_address: e.target.value})}
                name="medical-condition"
                id="medical-condition"
                rows={3}
              ></textarea>
              </span>
              <button>SUBMIT</button>
              </fieldset>
            </form>
          </div>
         
        </div>
      </div>
    </div>
  )
}
