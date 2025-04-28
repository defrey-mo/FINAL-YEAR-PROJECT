/* eslint-disable no-unused-vars */
import React from 'react'
import '../CSS/login.css'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div>
      <div className="login-box">
        <div className="login-header">
            <header>Login</header>
        </div>
        <div className="input-box">
            <input type="text" className="input-field" placeholder="Email/Username" autoComplete="off" required/>
        </div>
        <div className="input-box">
            <input type="password" className="input-field" placeholder="Password" autoComplete="off" required/>
        </div>
        <div className="forgot">
            <section>
                <input type="checkbox" id="check"/>
                <label htmlFor="check">Remember me</label>
            </section>
            <section>
                <Link>Forgot password</Link>
            </section>
        </div>
        <div className="input-submit">
            <button className="submit-btn" id="submit"></button>
            <label htmlFor="submit">Login</label>
        </div>
    </div>
    </div>
  )
}
