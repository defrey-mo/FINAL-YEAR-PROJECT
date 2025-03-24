import React from 'react'
import '../CSS/login.css'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div>
      <div class="login-box">
        <div class="login-header">
            <header>Login</header>
        </div>
        <div class="input-box">
            <input type="text" class="input-field" placeholder="Email/Username" autocomplete="off" required/>
        </div>
        <div class="input-box">
            <input type="password" class="input-field" placeholder="Password" autocomplete="off" required/>
        </div>
        <div class="forgot">
            <section>
                <input type="checkbox" id="check"/>
                <label for="check">Remember me</label>
            </section>
            <section>
                <Link>Forgot password</Link>
            </section>
        </div>
        <div class="input-submit">
            <button class="submit-btn" id="submit"></button>
            <label for="submit">Login</label>
        </div>
    </div>
    </div>
  )
}
