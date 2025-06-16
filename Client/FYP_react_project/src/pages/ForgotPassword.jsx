import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/login.css';
import SuccessBox from "../components/SuccessBox"
import ErrorBox from "../components/ErrorBox";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    // Don't get or send token here — user is not logged in
    const response = await axios.put(
      'http://localhost:8084/update-password',
      { username, newPassword }
      // No Authorization header needed here
    );

    if (response.status === 200) {
      // navigate("/login");
      setShowSuccess(true);
      setShowError(false);
    }
  } catch (err) {
    const msg = err.response?.data?.message || JSON.stringify(err.response?.data) || "An unexpected error occurred.";
    setErrorMessage(msg);                    
    setShowError(true);
    setShowSuccess(false);
    console.error("Error:", msg);
    setError(err.response?.data?.message || "Something went wrong.");
  }
};

  return (
    <div>
      <div className="login-page-container">
        <div>
          <div className='app-name'><h1>Student's Misconduct And Behaviour System</h1></div>
          <form onSubmit={handleSubmit}>
            <div className="login-box">
              <div className="login-header">
                <header className='login-logo'><img src="school_logo.jpg" alt="School Logo" /></header>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Username"
                  autoComplete="off"
                  required
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter new Password"
                  autoComplete="off"
                  required
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  className="input-field"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  required
                  name="confirmPassword"  // changed here
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

              <div className="input-submit">
                <button className="submit-btn" id="submit" type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
        {showSuccess && (
                <SuccessBox
                  message="Password updated successfully!"
                  onClose={() => setShowSuccess(false)}
                  onConfirm={() => navigate("/login")}
                />
              )}
        
              {showError && (
                <ErrorBox
                  message={`Password to update! Please try again.\n${errorMessage}`}
                  onClose={() => setShowError(false)}
                  duration={10000}
                />
              )}
    </div>
  )
}
