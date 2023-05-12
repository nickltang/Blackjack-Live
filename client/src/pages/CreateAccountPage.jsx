import React from 'react'
import Navigation from '../components/Navigation'
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";



const USER_REGEX = /^[A-z][A-z0-9-_]{5,23}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/api/users/create-user';


const CreateAccountPage = () => {
  const navigate = useNavigate()
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user))
  }, [user])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email)

    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    await axios.post(REGISTER_URL, {
        name: user,
        password: pwd,
        email: email
      }, {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true
      })
      .then(res => {
        console.log(res)
        
        // Save jwt
        localStorage.setItem('jwt_token', res.data.token)


        navigate('/lobby')
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
          setErrMsg('Username Taken');
        } else {
          setErrMsg('Registration Failed')
        }
        errRef.current.focus();
      })
  }

  return (
    <>
      <Navigation />
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/">Go to Home</a>
          </p>
        </section>
        <div id="displayForm">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
          <h1 id="M0">Register</h1>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
            </label>
            <input
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Username<br />
              6 to 24 characters.<br />
              Must begin with a letter.<br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Email <br />
              Contains the following ASCII characters. <br />
              Uppercase (A-Z) and lowercase (a-z) English letters.<br />
              Digits (0-9). <br />
              Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other. <br />
              Special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Password <br />
              8 to 24 characters.<br />
              Must include uppercase and lowercase letters, a number and a special character.<br />
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Confirm Password must match the first password input field.
            </p>

            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
            <p id="margin0">
              Already registered?<br />
              <span id="margin0" className="line">
                <Link to="/Login">Login</Link>
              </span>
            </p>
          </form>
        </div>
    </>
  )
}

export default CreateAccountPage
