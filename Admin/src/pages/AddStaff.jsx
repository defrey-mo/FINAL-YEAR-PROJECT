/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/check.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


// eslint-disable-next-line react/prop-types
export default function CheckStudent({ setActivePage }) {
  setActivePage("add-staff");
    
    const randNum = Math.floor(Math.random() * 1000);
        
    const [staff_id, setstaff_id] = useState("STF-" + randNum);
    const [firstname, setfirstname] = useState("");
    const [middlename, setmiddlename] = useState("");
    const [surname, setsurname] = useState("");
    const [nationality, setnationality] = useState("");
    const [gender, setgender] = useState("Male");
    const [school_id, setschool_id] = useState("");
    const [phone, setphone] = useState("");
    const [email, setemail] = useState("");
    const [home_address, sethome_address] = useState("");
    const [emergency_name, setemergency_name] = useState("");
    const [emergency_phone, setemergency_phone] = useState("");
    const [emergency_email, setemergency_email] = useState("");
    const [emergency_address, setemergency_address] = useState("");
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [role, setrole] = useState("Admin");
    const [schools, setSchools] = useState([]);
    
    const consist = {
      "staff_id": staff_id,
      "firstname": firstname,
      "middlename": middlename,
      "surname": surname,
      "nationality": nationality,
      "gender": gender,
      "school_id": school_id,
      "phone": phone,
      "email": email,
      "home_address": home_address,
      "emergency_name": emergency_name,
      "emergency_phone": emergency_phone,
      "emergency_email": emergency_email,
      "emergency_address": emergency_address,
      "username": username,
      "password": password,
      "role": role
    }
    const requestConfiguration = {
      method: "post",
      maxBodyLength: Infinity,
      url:'http://localhost:8084/staffs',
      headers:{
        "content-type":"application/json",
        accept:"application/json"
      },
      data: consist
    }

    useEffect(() => {
      axios.get("http://localhost:8084/school")
        .then(response => {
          setSchools(response.data);
        })
        .catch(error => console.error("Error fetching school IDs:", error));
    }, []);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      axios.request(requestConfiguration)
        .then(res => {
          console.log(res);
          // navigate('/system/overview')
        })  
        .catch(err => console.log(err));
    };

  return (
    <>
      <div className="main-form">
        <h1>Staff Registration Form</h1>
        <div className="form">
          <form onSubmit={handleSubmit} autoComplete="off">
            <section>
              <fieldset>
                <legend>Personal Information</legend>
                <span>
                  <label>Staff ID</label>
                  <input
                    onChange={(e) => setstaff_id(e.target.value)}
                    value={staff_id}
                    type="text"
                    name="school-id"
                    id="school-id"
                    required
                    readOnly
                  />
                </span> 
                <span>
                  <label>First Name</label>
                  <input
                    onChange={(e) => setfirstname(e.target.value)}
                    value={firstname}
                    type="text"
                    name="first-name"
                    id="first-name"
                    required
                  />
                </span>

                <span>
                  <label>Middle Name</label>
                  <input
                    onChange={(e) => setmiddlename(e.target.value)}
                    value={middlename}
                    type="text"
                    name="middle-name"
                    id="middle-name"
                  />
                </span>

                <span>
                  <label>Surname</label>
                  <input
                    onChange={(e) => setsurname(e.target.value)}
                    value={surname}
                    type="text"
                    name="surname"
                    id="surname"
                    required
                  />
                </span>

                <span>
                  <label>Nationality</label>
                  <input
                    onChange={(e) => setnationality(e.target.value)}
                    value={nationality}
                    type="text"
                    name="surname"
                    id="surname"
                    required
                  />
                </span>

                <span>
                  <label>Gender</label>
                  <select
                    onChange={(e) => setgender(e.target.value)}
                    value={gender}
                    name="gender"
                    id="gender"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </span>
                <span>
                  <label>School ID</label>
                  <select onChange={(e) => setschool_id(e.target.value)} value={school_id} required>
                    <option value="">Select a School</option>
                    {schools.map((school) => (
                      <option key={school.school_id} value={school.school_id}>{school.school_id}</option>
                    ))}
                  </select>
                </span>

                <span>
                  <fieldset>
                    <legend className="medical">Account credentials & Role</legend>
                    <span>
                    <label>Username</label>
                    <input
                      onChange={(e) => setusername(e.target.value)}
                      value={username}
                      type="text"
                      name="emergency-name"
                      id="emergency-name"
                    />
                  </span>
                  <span>
                    <label>Password</label>
                    <input
                      onChange={(e) => setpassword(e.target.value)}
                      value={password}
                      type="password"
                      name="emergency-name"
                      id="emergency-name"
                    />
                  </span>
                  <span>
                  <label>Role</label>
                  <select
                    onChange={(e) => setrole(e.target.value)}
                    value={role}
                    name="role"
                    id="role"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </span>
                  </fieldset>
                </span>
              </fieldset>
            </section>
            <aside>
              <fieldset>
                <legend>Contact Information</legend>
                <span>
                  <label>Phone Number</label>
                  <input
                    onChange={(e) => setphone(e.target.value)}
                    value={phone}
                    type="text"
                    name="phone"
                    id="phone"
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
                  <label>Home Address</label>
                  <input
                    onChange={(e) => sethome_address(e.target.value)}
                    value={home_address}
                    type="text"
                    name="email"
                    id="email"
                    required
                  />
                </span>
                <span>
                  <label>Emergency Contact Fullname</label>
                  <input
                    onChange={(e) => setemergency_name(e.target.value)}
                    value={emergency_name}
                    type="text"
                    name="email"
                    id="email"
                  />
                </span>
                <span>
                  <label>Emergency Contact Phone</label>
                  <input
                    onChange={(e) => setemergency_phone(e.target.value)}
                    value={emergency_phone}
                    type="text"
                    name="email"
                  />
                </span>
                <span>
                  <label>Emergency Contact Email</label>
                  <input
                    onChange={(e) => setemergency_email(e.target.value)}
                    value={emergency_email}
                    type="text"
                    name="email"
                    id="email"
                  />
                </span>
                <span>
                  <label>Emergency Contact Address</label>
                  <input
                    onChange={(e) => setemergency_address(e.target.value)}
                    value={emergency_address}
                    type="text"
                    name="email"
                    id="email"
                  />
                </span>
                <div className="registering-buttons">
                  <div>
                    <button type="reset">
                      Clear
                    </button>
                  </div>
                  <div className="save">
                    <button type="submit">Save</button>
                  </div>
                </div>
              </fieldset>
            </aside>
          </form>
        </div>
      </div>
    </>
  );
}
