/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/add.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decode } from 'js-base64'; // Import the decode function from js-base64 library

export default function AddStudent({ setActivePage }) {
    setActivePage("add-student");

    // State variables to store form input values
    const [student_id, setstudent_id] = useState("");
    const [firstname, setfirstname] = useState("");
    const [middlename, setmiddlename] = useState("");
    const [surname, setsurname] = useState("");
    const [guardian_email, setguardian_email] = useState("");
    const [guardian_fullnames, setguardian_fullnames] = useState("");
    const [medical_info, setmedical_info] = useState("");
    const [gender, setgender] = useState("male");
    const [dob, setdob] = useState("");
    const [guardian_phone, setguardian_phone] = useState("");
    const [home_address, sethome_address] = useState("");
    const [prev_school, setprev_school] = useState("");
    const [existingStudentIds, setExistingStudentIds] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading state

    const navigate = useNavigate(); // Hook to navigate between routes

    useEffect(() => {
        // Fetching existing student IDs from the backend when component mounts
        axios
            .get("http://localhost:8084/students/ids") // API endpoint to get student IDs
            .then((res) => {
                setExistingStudentIds(res.data); // Update state with fetched IDs
                generateUniqueStudentId(res.data); // Generate a unique student ID
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((err) => {
                console.error("Error fetching student IDs:", err);
                setLoading(false);
            });
    }, []); // Empty dependency array means this effect runs only once

    const generateUniqueStudentId = (existingIds) => {
        // Function to generate a unique student ID
        let newId;
        let isUnique = false;

        while (!isUnique) {
            const randNum = Math.floor(Math.random() * 100000); // Generate a random number
            newId = "STU-" + randNum; // Create a student ID string
            if (!existingIds.includes(newId)) {
                // Check if the generated ID is unique
                isUnique = true;
            }
        }
        setstudent_id(newId); // Set the generated ID to the state
    };

    function clearBtn(e) {
        // Function to clear form input fields
        e.preventDefault(); // Prevent default form submission
        setfirstname("");
        setmiddlename("");
        setsurname("");
        setguardian_email("");
        setguardian_fullnames("");
        setmedical_info("");
        setgender("");
        setdob("");
        setguardian_phone("");
        sethome_address("");
        setprev_school("");
    }

    const content = {
        // Object containing form data
        student_id,
        firstname,
        middlename,
        surname,
        dob,
        gender,
        medical_info,
        guardian_fullnames,
        guardian_phone,
        guardian_email,
        home_address,
        prev_school,
        school_id: localStorage.getItem("school_id"), // Get school ID from local storage
    };

    const requestConfig = {
        // Configuration for the axios POST request
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8084/students", // API endpoint to register new student
        headers: {
            "content-type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach JWT token
        },
        data: content,
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
                    console.log(res);
                    navigate("/system/overview"); // Redirect to overview page
                })
                .catch((err) => {
                    console.error("Error:", err.response.data);
                });
        } catch (error) {
            // Handle errors during token decoding
            console.error("Error decoding token:", error);
            navigate("/login"); // Redirect to login
        }
    };

  return (
    <>
      <div className="main-form">
        <h1>Student Registration Form</h1>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <section>
              <fieldset>
                <legend>Basic Details</legend>

                <span>
                  <label>Student Number</label>
                  <input
                    onChange={(e) => setstudent_id(e.target.value)}
                    value={student_id}
                    type="text"
                    name="student-id"
                    id="student-id"
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
                  <label>Date of Birth</label>
                  <input
                    onChange={(e) => setdob(e.target.value)}
                    value={dob}
                    type="date"
                    name="dob"
                    id="dob"
                    placeholder="dd/mm/yyyy"
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
                    <legend className="medical">Medical Information</legend>
                    <label>Medical Conditions if Any</label>
                    <textarea
                      onChange={(e) => setmedical_info(e.target.value)}
                      value={medical_info}
                      style={{ maxWidth: "95%" }}
                      name="medical-condition"
                      id="medical-condition"
                      rows="10"
                    ></textarea>
                  </fieldset>
                </span>
              </fieldset>
            </section>

            <aside>
              <fieldset>
                <legend>Guardian Contact Information</legend>
                <span>
                  <label>Full Names</label>
                  <input
                    onChange={(e) => setguardian_fullnames(e.target.value)}
                    value={guardian_fullnames}
                    type="text"
                    name="emergency-phone"
                    id="emergency-phone"
                    required
                  />
                </span>
                <span>
                  <label>Phone Number</label>
                  <input
                    onChange={(e) => setguardian_phone(e.target.value)}
                    value={guardian_phone}
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                  />
                </span>
                <span>
                  <label>Email </label>
                  <input
                    onChange={(e) => setguardian_email(e.target.value)}
                    value={guardian_email}
                    type="email"
                    name="email"
                    id="email"
                    required
                  />
                </span>

                <span>
                  <label>Home Address</label>
                  <textarea
                    onChange={(e) => sethome_address(e.target.value)}
                    value={home_address}
                    name="address"
                    id="address"
                    rows="4"
                    required
                  ></textarea>
                </span>

                <fieldset>
                  <legend>Previous school if any</legend>

                  <span>
                    <label>School Name</label>
                    <input
                      onChange={(e) => setprev_school(e.target.value)}
                      value={prev_school}
                      type="text"
                      name="emergency-name"
                      id="emergency-name"
                    />
                  </span>
                </fieldset>
                <div className="registering-buttons">
                  <div>
                    <button onClick={clearBtn} type="reset">
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
