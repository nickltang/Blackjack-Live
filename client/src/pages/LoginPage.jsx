import React from 'react'
import Navigation from '../components/Navigation'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom"


/*
    TO DO:
        - Login Form
            - Text field for username
            - Text field for password
            - Button to log in
                - Should validate login info with api
*/

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const LOGIN_URL = '/api/users/login';

const LoginPage = () => {
  const navigate = useNavigate()
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);

    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    await axios.post(LOGIN_URL,
      {
        email: email,
        password: pwd
      },
      {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true
      })
      .then((res) => {
        console.log(res)
        // Save JWT
        localStorage.setItem('jwt_token', res.data.token)
        navigate('/lobby')
      })
      .catch((err) => {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
          console.log(err.response)
          setErrMsg('Wrong Username or Password');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
        } else {
          setErrMsg('Login Failed');
        }
        errRef.current.focus();
      })
  }

  return (
    <>
      <Navigation />
      <div id="displayForm">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <form onSubmit={handleSubmit}>
          <h1 id="M0">Login</h1>
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button>Sign In</button>
          <p id="margin0">
            Don't have a account?<br />
            <span id="margin0" className="line">
              <Link to="/create-account">Create a account</Link>
            </span>
          </p>
        </form>
      </div>
    </>
  )
}

export default LoginPage