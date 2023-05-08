import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navigation from '../components/Navigation'

/*
    TO DO:
        - Blackjack Live page title
        - Creative background
        - Button that links to create account page
        - Button that links to login page
*/
const LoginPageURL = 'http://localhost:8000/login'
const CreateAccountPageURL = 'http://localhost:8000/create-account'

const LandingPage = () => {
  // State
  const [name, setName] = useState("{insert name}")

  // Hooks
  const navigate = useNavigate()

  // Handlers
  const handleLogin = () => {
    console.log("Landing Page")
    axios.post(LoginPageURL)
      .then(res => {
        console.log(res)
        navigate('/Login')
      }) 
  }

  const handleCreateAccount = () => {
    console.log("Create Account Page")
    axios.post(CreateAccountPageURL)
      .then(res => {
        console.log(res)
        navigate('/create-account')
      }) 
  }
  return (
    <>
      <Navigation/>
      <div className='mt-5 text-center'>
        <h1>Welcome to Blackjack Live</h1>
        <p className='mt-4'>Create a game or join a game to start playing</p>
        <div className='mt-3'>
          <Button variant="outline-primary" onClick={handleCreateAccount}>
            Create Account
          </Button>
          <Button variant="outline-success" className='mx-2' onClick={handleLogin}>
            Login 
          </Button>
        </div>
      </div>
    </>
  )
}

export default LandingPage