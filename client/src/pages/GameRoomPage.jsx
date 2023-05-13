import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation'
import axios from 'axios'
import { getToken } from '../utils/auth';
import { SocketContext } from '../context/SocketContext';

/*
    TO DO:
        - Game Display
            - Show countdown
            - Show dealer deck
        - Actions
            - Buttons to change bet amount
            - Buttons to hit and stand
            - Button to double (if you can double)
            - Button to split
            - Button to leave game
        - User Box (for each user)
            - Show user's cards
            - Show whose turn it is (highlight/shade)
            - Show amount of money that user has
            - Show username
            - Button to turn on/off my video
            - Button to turn on/off other users' videos
        - Miscellaneous
            - Show game rules
*/

const getUserInfoURL = 'http://localhost:8000/api/users/get-user-info'


const GameRoomPage = () => {
    const [name, setName] = useState("")
    const [playerId, setPlayerId] = useState("")
    
    // players, activePlayers, cards, balance, gameFinished
    const [players, setPlayers] = useState()
    const [cards, setCards] = useState()
    const [balance, setBalance] = useState()

    const navigate = useNavigate()
    const tokenState = getToken()
    const { roomId } = useParams()

    const socket = useContext(SocketContext);




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
            // Set current player's information
            // Add other fields
            setName(res.data.name)
            setPlayerId(res.data.id)
    
        }).catch((error) => {
            console.log(error)
        }) 

        socket.emit('getGameState')

        // Socket Listeners
        socket.on('gameState', res => {
            console.log('game state', res)
        })


      }, [])
    

    // join/leave
    const handleJoin = () => {

    }

    const handleLeave = () => {

    }


    // game change handlers
    const handleBet = () => {
        // emit handle bet
    }

    const handleFold = () => {

    }

    const handleCheck = () => {

    }

    const handleRaise = () => {

    }

    const getMaxBet = () => {
        
    } 


    // game related functions
    const canCheck = () => {

    }

    const canRaise = () => {
        
    }


    return (
        <>
            <Navigation />
            <div className='mt-5 my-auto text-center'>
                <p>Game ID: {roomId}</p>
                <div className='gameContainer'>
                    <div className='dealerHand'>

                    </div>
                </div>
            </div>
        </>
    )
}

export default GameRoomPage