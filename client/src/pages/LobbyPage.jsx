import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navigation from '../components/Navigation'
import { getToken } from '../utils/auth';


const createGameURL = 'http://localhost:8000/users/create-game'
const joinGameURL = 'http://localhost:8000/users/join-game'
const getUserInfoURL = 'http://localhost:8000/api/users/get-user-info'

const LobbyPage = ({socket}) => {
  // Hooks
  const navigate = useNavigate()
  const tokenState = getToken()

  // State
  const [name, setName] = useState("")
  const [id, setId] = useState("")

  // Component did mount
  useEffect(() => {
    // If token expired/not present, send user to home page
    if(tokenState.tokenExpired){
      navigate('/')
    }
    
    // Get user info
    axios.get(getUserInfoURL, {
      headers: {
        'Authorization': `Bearer ${tokenState.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setName(res.data.name)
      setId(res.data.setId)

    }).catch((error) => {
      console.log(error)
    }) 
  }, [])


  // Handlers
  const handleCreate = () => {
    console.log("Creating game")
    socket.emit('createTable')

    // axios.post(createGameURL)
    //   .then(res => {
    //     console.log(res)
    //     navigate('/game-room')
    //   }) 
  }

  const handleJoin = () => {
    console.log("Joining game")
    socket.emit('joinTable')

    // axios.post(joinGameURL)
    //   .then(res => {
    //     console.log(res)
    //     navigate('/game-room')
    //   }) 
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