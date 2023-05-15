import React from 'react'
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

const LandingPage = () => {
  // State

  // Hooks
  const navigate = useNavigate()

  // Handlers
  const handleLogin = () => {
    console.log("Landing Page")
    navigate('/login')
  }

  const handleCreateAccount = () => {
    console.log("Navigate to Create Account Page")
    navigate('/create-account')
  }
  return (
    <>
      <Navigation />
      <div className='mt-5 text-center'>
        <h1>Welcome to Blackjack Live</h1>
        <div className='landingContainer'>
        <div className='landingContainer__text'>
          <div className='ruleText text-center'>
            <h2> Simple rule</h2>
            <p id='padtext'>The goal is to get a hand total as close to 21 as possible without going over.
              Players are dealt two cards and can choose to receive additional cards or
              stay with their current hand. The dealer also plays and must follow specific rules.
              The player wins if their hand total is higher than the dealer's without exceeding 21.
              Getting an Ace and a 10-value card initially results in a blackjack and an automatic win,
              unless the dealer also has a blackjack.</p>
          </div>
          <p className='mt-4'>Create a game or join a game to start playing</p>
          <Button variant="outline-primary" onClick={handleCreateAccount}>
            Create Account
          </Button>
          <Button variant="outline-success" className='mx-2' onClick={handleLogin}>
            Login
          </Button> 
        </div>
        <div className='landingContainer_video'>
        <iframe width="560" height="315" 
          src="https://www.youtube.com/embed/eyoh-Ku9TCI" 
          title="YouTube video player" frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; 
          encrypted-media; gyroscope; picture-in-picture;" 
          allowFullScreen></iframe>
        </div>
        </div>
      </div>
    </>

  )
}

export default LandingPage