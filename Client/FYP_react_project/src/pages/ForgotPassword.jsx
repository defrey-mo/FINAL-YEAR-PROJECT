import React from 'react'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; 
  
  return (
    <div>
      <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Reset Your Password</h2>
        <form>
          <label htmlFor="email">Enter your email address:</label>
          <input type="email" id="email" name="email" required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
    </div>
  )
}
