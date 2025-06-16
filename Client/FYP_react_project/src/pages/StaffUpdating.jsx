import React, { useEffect, useState } from 'react';
import '../CSS/staff-mgt.css';
import { useParams, useNavigate } from 'react-router-dom';
import { decode } from 'js-base64';
import axios from 'axios';
import SuccessBox from "../components/SuccessBox"
import ErrorBox from "../components/ErrorBox";

export default function StaffManagement() {
  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    staff_id: '',
    firstname: '',
    middlename: '',
    surname: '',
    nationality: '',
    gender: 'male',
    phone: '',
    email: '',
    home_address: '',
    emergency_name: '',
    emergency_phone: '',
    emergency_email: '',
    emergency_address: '',
    username: '',
    password: '',
    role: 'Admin'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }
    axios.get(`http://localhost:8084/read-staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const fetchedStaff = res.data;
      fetchedStaff.password = ''; // Don't pre-fill the password field
      setStaff(fetchedStaff);
    })
    .catch(err => {
      console.error('Fetch error:', err);
    });
  }, [id, navigate]);

  // This function handles all input changes for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff(prevStaff => ({
      ...prevStaff,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      navigate("/login");
      return;
    }

    const payload = JSON.parse(decode(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return navigate("/login");
    }

    axios.put(`http://localhost:8084/update-staff/${id}`, staff, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setShowSuccess(true);
      setShowError(false);
      console.log(res.data);
    })
    .catch(err => {
      const msg = err.response?.data?.message || JSON.stringify(err.response?.data) || "An unexpected error occurred.";
      setErrorMessage(msg);                    
      setShowError(true);
      setShowSuccess(false);
      console.error("Error:", msg);
      console.error("Update error:", err)
    });
  };

  return (
    <div className='staff-management'>
      <div className="main-form">
        <h1>Staff Registration Form</h1>
        <div className="form">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <section>
              <fieldset>
                <legend>Personal Information</legend>
                <span>
                  <label>Staff ID</label>
                  <input
                    onChange={handleChange}
                    value={staff.staff_id}
                    type="text"
                    name="staff_id"
                    id="staff_id"
                    required
                    readOnly
                  />
                </span> 
                <span>
                  <label>First Name</label>
                  <input
                    onChange={handleChange}
                    value={staff.firstname}
                    type="text"
                    name="firstname"
                    id="firstname"
                    required
                  />
                </span>

                <span>
                  <label>Middle Name</label>
                  <input
                    onChange={handleChange}
                    value={staff.middlename}
                    type="text"
                    name="middlename"
                    id="middlename"
                  />
                </span>

                <span>
                  <label>Surname</label>
                  <input
                    onChange={handleChange}
                    value={staff.surname}
                    type="text"
                    name="surname"
                    id="surname"
                    required
                  />
                </span>

                <span>
                  <label>Nationality</label>
                  <input
                    onChange={handleChange}
                    value={staff.nationality}
                    type="text"
                    name="nationality"
                    id="nationality"
                    required
                  />
                </span>

                <span>
                  <label>Gender</label>
                  <select
                    onChange={handleChange}
                    value={staff.gender}
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
                        onChange={handleChange}
                        value={staff.username}
                        type="text"
                        name="username"
                        id="username"
                      />
                    </span>
                    <span>
                      <label>Password</label>
                      <input
                        onChange={handleChange}
                        value={staff.password}
                        type="password"
                        name="password"
                        id="password"
                      />
                    </span>
                    <span>
                      <label>Role</label>
                      <select
                        onChange={handleChange}
                        value={staff.role}
                        name="role"
                        id="role"
                      >
                        <option value="Admin">Admin</option>
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
                    onChange={handleChange}
                    value={staff.phone}
                    type="text"
                    name="phone"
                    id="phone"
                    required
                  />
                </span>
                <span>
                  <label>Email</label>
                  <input
                    onChange={handleChange}
                    value={staff.email}
                    type="email"
                    name="email"
                    id="email"
                    required
                  />
                </span>
                <span>
                  <label>Home Address</label>
                  <input
                    onChange={handleChange}
                    value={staff.home_address}
                    type="text"
                    name="home_address"
                    id="home_address"
                    required
                  />
                </span>
                <span>
                  <label>Emergency Contact Fullname</label>
                  <input
                    onChange={handleChange}
                    value={staff.emergency_name}
                    type="text"
                    name="emergency_name"
                    id="emergency_name"
                  />
                </span>
                <span>
                  <label>Emergency Contact Phone</label>
                  <input
                    onChange={handleChange}
                    value={staff.emergency_phone}
                    type="text"
                    name="emergency_phone"
                    id="emergency_phone"
                  />
                </span>
                <span>
                  <label>Emergency Contact Email</label>
                  <input
                    onChange={handleChange}
                    value={staff.emergency_email}
                    type="email"
                    name="emergency_email"
                    id="emergency_email"
                  />
                </span>
                <span>
                  <label>Emergency Contact Address</label>
                  <input
                    onChange={handleChange}
                    value={staff.emergency_address}
                    type="text"
                    name="emergency_address"
                    id="emergency_address"
                  />
                </span>

                <div className="registering-buttons">
                  <div>
                    <button
                      type="button"
                      onClick={() => setStaff({
                        staff_id: '',
                        firstname: '',
                        middlename: '',
                        surname: '',
                        nationality: '',
                        gender: 'male',
                        phone: '',
                        email: '',
                        home_address: '',
                        emergency_name: '',
                        emergency_phone: '',
                        emergency_email: '',
                        emergency_address: '',
                        username: '',
                        password: '',
                        role: 'admin'
                      })}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="save">
                    <button type="submit">Save</button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate('/system/staff-view')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </fieldset>
            </aside>
          </form>
        </div>
      </div>
      {showSuccess && (
              <SuccessBox
                message="Staff updated successfully!"
                onClose={() => setShowSuccess(false)}
                onConfirm={() => navigate("/system/staff-view")}
              />
            )}
      
            {showError && (
              <ErrorBox
                message={`Updating failed! Please try again.\n${errorMessage}`}
                onClose={() => setShowError(false)}
                duration={10000}
              />
            )}
    </div>
  );
}
