import React from 'react'
import { useParams } from 'react-router-dom'

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
    return (
        <>
            <h1>Game Room: {id}</h1>
        </>
    )
}

export default GameRoomPage