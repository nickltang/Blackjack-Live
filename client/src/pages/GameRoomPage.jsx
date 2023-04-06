import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navigation from '../components/Navigation'

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
const GameRoomPage = () => {
    const { id } = useParams()
    // players, activePlayers, cards, balance, gameFinished
    const [players, setPlayers] = useState()
    const [cards, setCards] = useState()
    const [balance, setBalance] = useState()


    // if player is registered (JWT token)


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
                <h1>Game Room</h1>
            </div>
        </>
    )
}

export default GameRoomPage