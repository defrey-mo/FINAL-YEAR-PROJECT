// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import "../CSS/read.css";
import { useParams } from 'react-router-dom';
import axios from "axios";


export default function Read() {
  const {id} = useParams();
  const [students, setStudent] = useState([])
    useEffect(() => {
      axios.get('http://localhost:8084/read/'+id)
      .then(res => { 
        console.log(res)
        setStudent(res.data[0])
      })
      .catch(err => console.log(err))
    }, [id])
  return (
    <div>
      <div className='reading-students'>

        <h2>Students Details</h2>
        <h3>STUDENT NUMBER:  {students.student_id}</h3>
        <h3>FIRST NAME:  {students.firstname}</h3>
      </div>
    </div>
  )
}
