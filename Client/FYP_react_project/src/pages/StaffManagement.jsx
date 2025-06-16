/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import '../CSS/staff-mgt.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { decode } from 'js-base64';
import axios from 'axios';
import "../CSS/add.css";
import SuccessBox from "../components/SuccessBox"
import ErrorBox from "../components/ErrorBox";


export default function StaffManagement() {


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
      const [showSuccess, setShowSuccess] = useState(false);
      const [showError, setShowError] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
      

       const navigate = useNavigate();
      
      const consist = {
        staff_id,
        firstname,
        middlename,
        surname,
        nationality,
        gender,
        phone,
        email,
        home_address,
        emergency_name,
        emergency_phone,
        emergency_email,
        emergency_address,
        username,
        password,
        role
      }

      const requestConfig = {
        // Configuration for the axios POST request
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8084/new-staff", // API endpoint to register new student
        headers: {
            "content-type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach JWT token
        },
        data: consist,
    };

      const handleSubmit = (e) => {
              // Function to handle form submission
              e.preventDefault(); // Prevent default form submission
      
              const token = localStorage.getItem("token"); // Get JWT token from local storage
      
              if (!token) {
                  // Check if token exists
                  console.log("No token found, please log in again.");
                  navigate("/login"); // Redirect to login if no token
                  return;
              }
      
              try {
                  // Decode the JWT token using js-base64
                  const payload = JSON.parse(decode(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                  const currentTime = Date.now() / 1000; // Get current time in seconds
      
                  if (payload.exp < currentTime) {
                      // Check if token has expired
                      console.log("Token has expired.");
                      localStorage.removeItem("token"); // Remove expired token
                      navigate("/login"); // Redirect to login
                      return;
                  }
      
                  // Make the axios POST request
                  axios
                      .request(requestConfig)
                      .then((res) => {
                        setShowSuccess(true);
                        setShowError(false);
                        console.log(res);
                      })
                      .catch((err) => {
                        const msg = err.response?.data?.message || JSON.stringify(err.response?.data) || "An unexpected error occurred.";
                        setErrorMessage(msg);                    
                        setShowError(true);
                        setShowSuccess(false);
                        console.error("Error:", msg);
                      });
              } catch (error) {
                  // Handle errors during token decoding
                  console.error("Error decoding token:", error);
                  navigate("/login"); // Redirect to login
              }
          };
      

  return (
   <>
    <div className='staff-management'>
      
      <div className="main-form">
        <h1>Staff Registration Form</h1>
        <div className="form">
          <form onSubmit={handleSubmit}>
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
    </div>
    {showSuccess && (
            <SuccessBox
              message="Staff registered successfully!"
              onClose={() => setShowSuccess(false)}
              onConfirm={() => navigate("/system/staff-view")}
            />
          )}
    
          {showError && (
            <ErrorBox
              message={`Registration failed! Please try again.\n${errorMessage}`}
              onClose={() => setShowError(false)}
              duration={10000}
            />
          )}
   </>
  )
}
