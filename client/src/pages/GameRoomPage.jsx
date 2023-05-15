import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { getToken } from '../utils/auth';
import { SocketContext } from '../context/SocketContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../index.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import imgs from '../components/cardImages'
import Alert from 'react-bootstrap/Alert';


const GameRoomPage = () => {
    const navigate = useNavigate()
    const tokenState = getToken()
    const { roomId } = useParams()
    const socket = useContext(SocketContext);

    const [playerIndex, setPlayerIndex] = useState()
    const [players, setPlayers] = useState({})
    const [betAmount, setBetAmount] = useState(1)
    const [stage, setStage] = useState()
    const [stageMessage, setStageMessage] = useState('')
    const [dealerCards, setDealerCards] = useState([])
    const [playerHandInfo, setPlayerHandInfo] = useState()
    const [hits, setHits] = useState(0)
    const [dealerBusted, setDealerBusted] = useState(false)
    const [playerBusted, setPlayerBusted] = useState(false)
    const [moneyWon, setMoneyWon] = useState(0)
    const [spectators, setSpectators] = useState()


    useEffect(() => {
        // If token expired/not present, send user to home page
        if(tokenState.tokenExpired){
          navigate('/')
        }

        socket.emit('getGameState', tokenState.decodedJWT.id)

        // Listens for game state update
        socket.on('gameState', (roomState, showdown) => {
            console.log('room state', roomState)

            // Save game stage
            if(showdown === 'showdown' || (roomState.game.hits > 1 && roomState.game.stage === 'player-turn-right'))
                setStage('showdown')
            else
                setStage(roomState.game.stage)


            // Save dealer bust, player bust, dealer blackjack, player blackjack
            setDealerBusted(roomState.game.dealerHasBusted)
            setPlayerBusted(roomState.game.handInfo.right.playerHasBusted)


            // Save current players in game
            const stateObj = roomState.players.reduce((stateObj, cur, i) => { 
                return { ...stateObj, [i]: cur };     
            }, {})
            setPlayers(stateObj)

            // Determine which player is current user
            roomState.players.forEach((player, i) => {
                if(tokenState.decodedJWT.id === player.id) {
                    setPlayerIndex(i)
                    return
                }
            })

            // Save hits
            setHits(roomState.game.hits)

            // Save money won
            setMoneyWon(roomState.game.wonOnRight)

            // Save dealer's cards
            const dealerHand = roomState.game.dealerCards
            if(showdown === 'showdown' || (roomState.game.hits > 1 && roomState.game.stage === 'player-turn-right'))
                dealerHand.push(roomState.game.dealerHoleCard)
            setDealerCards(dealerHand)

            // Save curent player's cards
            setPlayerHandInfo(roomState.game.handInfo)
        })


        // Listens for new players/specators joining
        socket.on("joinedRoom", () => {
            socket.emit('getGameState')
        })

    }, [])

    useEffect(() => {
        switch(stage) {
            case 'ready':
                setStageMessage('Click deal cards to being playing')
                break
            case 'player-turn-right':
                setStageMessage('Make a bet')
                break
            case 'showdown':
                setStageMessage('Hit or stand')
                break
            case 'dealer-turn':
                setStageMessage('Press continue for dealer to hit')
                break
            case 'done':
                if(playerBusted)
                    setStageMessage('Round Lost: you busted! Press next round to continue')
                else if (dealerBusted)
                    setStageMessage('Round Won: dealer busted! Press next round to continue')
                else if (moneyWon)
                    setStageMessage('You won! Press next round to continue')
                else
                    setStageMessage('You lost. Press next round to continue')
                break
            default:
            }
    }, [stage])
    


    const handleChangeBet = (sign) => {
        const maxBet = players[playerIndex].balance
        if(sign === '+') {
            if(betAmount*10 + 1 <= maxBet) {
                setStageMessage('Make a bet')
                setBetAmount(betAmount + 1)
            } else {
                setStageMessage('Maxiumum bet amount exceeded. Please lower your bet.')
            }
        } else {
            if(betAmount*10 - 1 > 0) {
                setStageMessage('Make a bet')
                setBetAmount(betAmount - 1)
            } else {
                setStageMessage('Must make a bet larger than 0. Please increase your bet')
                setBetAmount(1)
            }
        }
    }

    const handleDeal = () => {
        console.log('Deal')
        socket.emit('deal')
    }

    const handleBet = () => {
        if(betAmount <= 0) {
            setStageMessage('Must make a bet larger than 0. Please increase your bet')
            setBetAmount(1)
            return
        }
        console.log(`Bet ${betAmount}`)
        socket.emit('bet', betAmount, tokenState.decodedJWT.id)
    }

    const handleHit = () => {
        console.log('Hit')
        socket.emit('hit', tokenState.decodedJWT.id)
    }

    const handleStand = () => {
        console.log('Stand')
        socket.emit('stand', tokenState.decodedJWT.id)
    }

    const handleNextRound = () => {
        console.log('Next Round')
        socket.emit('nextRound',tokenState.decodedJWT.id)
    }



    // Renders dealer's cards onto the table
    const renderDealerHand = () => {
        // Maps dealer's cards in game state to dealer cards array
        const dealerCardNames = []
        if(dealerCards !== undefined) {
            dealerCards.forEach((card, index) => {
                dealerCardNames.push(card.text + card.suite)
            })    
        }

        if (stage === "ready") {
            return <img className='card' src={imgs['facedown']} alt='Facedown card'/>    
        }
        else if(stage === "player-turn-right" && hits < 2) {
            if(dealerCards.length < 2) {
                return (
                    <div className='display-cards'>
                        <img className='card' src={imgs[dealerCardNames[0]]} alt={dealerCardNames[0]}/>    
                        <img className='card' src={imgs['facedown']} alt='Facedown card'/>    
                    </div>
                )
            } else {
                return <div className='display-cards'>
                        <img className='card' src={imgs[dealerCardNames[0]]} alt={dealerCardNames[0]}/>    
                        <img className='card' src={imgs['facedown']} alt='Facedown card'/>    
                </div>
            }
        }
        else {
            return <div className='display-cards'>
                { dealerCardNames.map((cardName, i) => {
                        return (<img key={i} className='card' src={imgs[cardName]} alt={cardName} />  ) 
                    })
                }
            </div>   

        }
    }
        
    // Render's player's cardson screen based on stage and game state
    const renderPlayerHand = () => {
        // Map player cards in game state to player cards array
        const playerCardNames = []

        if(playerHandInfo.right.cards !== undefined) {
            const allCards = playerHandInfo.right.cards
            allCards.forEach((playerCard, index) => {
                playerCardNames.push(playerCard.text + playerCard.suite)
            })    
        }
        

        if (stage === "ready") {
            return (
                <div>
                    <img className='card' src={imgs['facedown']} alt='Facedown card'/>    
                    <img className='card' src={imgs['facedown']} alt='Facedown card'/>    
                </div>
            )
        } else {
            return (
                <div className='display-cards'>
                    { playerCardNames.map(cardName => {
                            return (<img className='card' src={imgs[cardName]} alt={cardName}/>   ) 
                        })
                    }
                </div>    
            )
        }
    }

    // Renders player's display
    const renderPlayers = Object.keys(players).map((keyname, i) => {
        // Stage display shows input fields/buttons based on game stage
        let stageDisplay = <></>
        if (stage === 'ready') {
            stageDisplay = 
                <Col>
                    <Button variant='success' size='sml' onClick={handleDeal}>
                        Deal Cards
                    </Button> 
                </Col>     
        } else if (stage === 'player-turn-right') {
            stageDisplay = (
                <Col className='px-2 my-3'>      
                    <div className='d-flex justify-content-center'>
                        <Form.Control type="text" placeholder="Bet Amount" className='w-25 mx-2' style={{'fontSize': '14px'}} readOnly value={betAmount*10}/>
                        <Button className='mx-2'  variant='secondary' onClick={() => handleChangeBet('-')}> - </Button>
                        <Button  variant='secondary' onClick={() => handleChangeBet('+')}> + </Button>
                    </div>             
                    <div className='mt-4'>
                        <Button variant='success' size='sml' onClick={handleBet}>Make Bet</Button>
                    </div>             
                </Col>
            )
        } else if (stage === 'showdown') {
            stageDisplay = (
                <>
                    <Col>
                        <Button size='sml' onClick={handleStand}>Stand</Button>
                    </Col>
                    <Col>
                        <Button size='sml' onClick={handleHit}>Hit</Button>
                    </Col>
                </> 
            )
        } else if (stage === 'done') {
            stageDisplay = (
                <Col>
                    <Button variant='success' size='sml' onClick={handleNextRound}>
                        Next Round
                    </Button> 
                </Col>
            )
        }

        return (
            <Col key={i} className='h-50 py-2'>
                <Row className='my-4'>
                    {renderPlayerHand(i)}
                </Row>
                <Row>
                    <Col>
                        <h3>{players[keyname].name}</h3>
                        <p className='my-1'>Balance: {players[keyname].balance}</p>
                    </Col>
                </Row>
                <Row className='mx-auto'>
                    {stageDisplay}
                </Row>
            </Col>
        )
    })


    return (
        <>
            <Navigation />
            <div className='w-75'>
                <Row className='mt-3 my-auto text-center'>
                    <Alert><b>Share this game ID with your friends: </b> {roomId}</Alert>
                </Row>    
            </div>
            <Container className='mt-3 my-auto text-center justify-content-center'>
                <Row className='text-center h-25 w-75 mb-5 mx-auto justify-content-center' >
                    <Col>
                        <h2 className='mb-2'>Dealer</h2>
                        <p className='mb-0'> Stage: {stage}</p>
                        <p className='mb-2'>{stageMessage}</p>
                        {renderDealerHand()}
                    </Col>
                </Row>
                <Row className='h-25 w-75 mx-auto'>
                    {renderPlayers}
                </Row>
            </Container>
        </>
    )
}

export default GameRoomPage