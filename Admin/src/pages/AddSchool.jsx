/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "../CSS/add.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddSchool({  setActivePage }) {
  setActivePage("add-student");
    
  
    const randNum = Math.floor(Math.random() * 1000);
    
    const [school_id, setschool_id] = useState("Sch-" + randNum);
    const [school_name, setschool_name] = useState("");
    const [school_type, setschool_type] = useState("");
    const [school_system, setschool_system] = useState("");
    const [phone_number, setphone_number] = useState("");
    const [email, setemail] = useState("");
    const [physical_address, setphysical_address] = useState("");
    const [mailing_address, setmailing_address] = useState("");
    
    const consent = {
      "school_id": school_id,
      "school_name": school_name,
      "school_type": school_type,
      "school_system": school_system,
      "phone_number": phone_number,
      "email": email,
      "physical_address": physical_address,
      "mailing_address": mailing_address
    }
    const requestConfigure = {
      method: "post",
      maxBodyLength: Infinity,
      url:'http://localhost:8084/schools',
      headers:{
        "content-type":"application/json",
        accept:"application/json"
      },
      data: consent
    }

    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      axios.request(requestConfigure)
        .then(res => {
          console.log(res);
          navigate('/system/overview')
        })  
        .catch(err => console.log(err));
    };
    
  
  return (
    <>
      <div className="main-form">
        <h1>School Registration Form</h1>
        <div className="form">
          <div className="schoolform">
          <form onSubmit={handleSubmit}>
            <section>
              <fieldset>
                <legend>School Identification & Basic Information</legend>
                <span>
                  <label>School ID</label>
                  <input
                    onChange={(e) => setschool_id(e.target.value)}
                    value={school_id}
                    type="text"
                    name="school-id"
                    id="school-id"
                    required
                    readOnly
                  />
                </span> 

                <span>
                  <label>School Name</label>
                  <input
                    onChange={(e) => setschool_name(e.target.value)}
                    value={school_name}
                    type="text"
                    name="school-name"
                    id="school-name"
                    required
                  />
                </span>                

                <span>
                  <label>School type</label>
                  <input
                    onChange={(e) => setschool_type(e.target.value)}
                    value={school_type}
                    type="text"
                    name="school-name"
                    id="school-name"
                    required
                  />
                </span> 

                <span>
                  <label>School system</label>
                  <input
                    onChange={(e) => setschool_system(e.target.value)}
                    value={school_system}
                    type="text"
                    name="school-name"
                    id="school-name"
                    required
                  />
                </span>               
                <fieldset>
                <legend>Contact Information</legend>
                <span>
                  <label>Phone Number</label>
                  <input
                    onChange={(e) => setphone_number(e.target.value)}
                    value={phone_number}
                    type="text"
                    name="phone"
                    id="phone"
                    required
                  />
                </span>
                <span>
                  <label>Physical Address</label>
                  <input
                    onChange={(e) => setphysical_address(e.target.value)}
                    value={physical_address}
                    type="text"
                    name="address"
                    id="address"
                    required
                  />
                </span>
                <span>
                  <label>Email</label>
                  <input
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                    type="text"
                    name="email"
                    id="email"
                    required
                  />
                </span>
                <span>
                  <label>Mailing Address</label>
                  <input
                    onChange={(e) => setmailing_address(e.target.value)}
                    value={mailing_address}
                    type="text"
                    name="mailing"
                    id="mailing"
                  />
                </span> 
              </fieldset>



            <div className="registering-buttons">
                  
                  <div className="save">
                    <button type="submit">Save</button>
                  </div>
                </div>
              </fieldset>
              
              
            </section>
          </form>

          </div>
        </div>
      </div>
    </>
  );
}
