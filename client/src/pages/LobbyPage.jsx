import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navigation from '../components/Navigation'
import { getToken } from '../utils/auth';
import { v4 as uuidv4 } from 'uuid';
import Form from 'react-bootstrap/Form';
import {SocketContext} from '../context/SocketContext';


const getUserInfoURL = 'http://localhost:8000/api/users/get-user-info'

const LobbyPage = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate()
  const tokenState = getToken()

  const [name, setName] = useState("")
  const [gameId, setGameId] = useState('')
  const [error, setError] = useState('')


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
    }).catch((error) => {
      console.log(error)
    }) 

    // Socket Listeners
    socket.on("roomOpenResponse", (res) => {
      console.log('roomOpenres', res)
      socket.emit('joinRoom', res, tokenState.decodedJWT?.id)
    })

    socket.on("createRoomResponse", (res) => {
      console.log('create room', res)
      console.log('id', tokenState.decodedJWT?.id)
      socket.emit('joinRoom', res, tokenState.decodedJWT?.id)
    })

    socket.on("joinedRoom", (roomId, newPlayer) => {
      console.log('joinedRoom', roomId, newPlayer)
      navigate(`/game-room/${roomId}`)
    })

    socket.on('error', res => {
      console.log('error: ', res)
      setError(res)
    })
  }, [])


  // Handlers
  const handleIdChange = (e) => {
    setGameId(e.target.value)
  }

  const handleCreate = () => {
    const createdId = uuidv4()
    socket.emit('createRoom', createdId)
  }

  const handleJoin = () => {
    socket.emit('roomOpen', gameId)
  }

  return (
    <>
      <Navigation/>
      <div className='mt-5 text-center'>
        <h1>Welcome to Blackjack Live, {name}!</h1>
        <p className='mt-4'>Choose an option below to start playing or spectating</p>
        <Form className='mt-3 w-25'>
          <Button variant="outline-primary" className='my-3' onClick={handleCreate}>
            Play Game
          </Button>
          <h4>OR</h4>
          <Form.Control 
            placeholder="Game ID"
            aria-label="Game ID"
            onChange={handleIdChange}
          />
          <Button variant="outline-success" className='my-3' onClick={handleJoin}>
            Spectate Game
          </Button>
          <p>{error}</p>
        </Form>
      </div>
    </>
  )
}

export default LobbyPage