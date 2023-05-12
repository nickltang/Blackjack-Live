import React from 'react'
import Navigation from '../components/Navigation'
import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from "../context/AuthProvider"
import axios from '../api/axios';
const LOGIN_URL = '/api/users/login';

/*
    TO DO:
        - Login Form
            - Text field for username
            - Text field for password
            - Button to log in
                - Should validate login info with api
*/

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();


    await axios.post(LOGIN_URL,
      { 
        email: email, 
        password: pwd },
      {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true
      })
    .then((res)=> {
      console.log(res)
      // Save JWT
      localStorage.setItem('jwt_token', res.data.token)

    })
    .catch((err) => {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    })

  return (
    <>
      <Navigation />
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="/">Go to Home</a>
          </p>
        </section>
      ) : (
        <div id="displayForm">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoFocus
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
            Need an Account?<br />
            <span id="margin0"className="line">
              <a href="/create-account">Sign Up</a>
            </span>
          </p>
          </form>
        </div>
      )}
    </>
  )
}
}

export default LoginPage