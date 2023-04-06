import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navigation from '../components/Navigation'

/*
    TO DO:
        - Lobby page title
        - Button to create game
        - Button to join game
*/
const createGameURL = 'http://localhost:8000/create-game'


const LobbyPage = () => {
  // State
  const [name, setName] = useState("{insert name}")

  // Hooks
  const navigate = useNavigate()

  // Handlers
  const handleCreate = () => {
    console.log("Creating game")
    axios.post('')
      .then(res => {
        console.log(res)
        navigate('/game-room')
      }) 
  }

  const handleJoin = () => {
    axios.post('')
      .then(res => {
        console.log(res)
        navigate('/game-room')
      }) 
  }

  return (
    <>
      <Navigation/>
      <div className='mt-5 text-center'>
        <h1>Welcome to Blackjack Live, {name}!</h1>
        <p className='mt-4'>Create a game or join a game to start playing</p>
        <div className='mt-3'>
          <Button variant="outline-primary" onClick={handleCreate}>
            Create Game
          </Button>
          <Button variant="outline-success" className='mx-2' onClick={handleJoin}>
            Join Game
          </Button>
        </div>
      </div>
    </>
  )
}

export default LobbyPage