import { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { getToken } from '../utils/auth';
import { SocketContext } from '../context/SocketContext';
// import { Peer } from 'peerjs';
import { PeerContext } from '../context/PeerContext';
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
    const peer = useContext(PeerContext);

    const [player, setPlayer] = useState({})
    const [activePlayer, setActivePlayer] = useState(true)
    const [betAmount, setBetAmount] = useState(1)
    const [stage, setStage] = useState()
    const [stageMessage, setStageMessage] = useState('')
    const [dealerCards, setDealerCards] = useState([])
    const [playerHandInfo, setPlayerHandInfo] = useState()
    const [hits, setHits] = useState(0)
    const [dealerBusted, setDealerBusted] = useState(false)
    const [playerBusted, setPlayerBusted] = useState(false)
    const [moneyWon, setMoneyWon] = useState(0)
    const otherUserVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const [canCall, setCanCall] = useState(false)


    useEffect(() => {
        // If token expired/not present, send user to home page
        if(tokenState.tokenExpired){
          navigate('/')
        }

        socket.emit('getGameState', tokenState.decodedJWT.id)

        // Listens for game state update
        socket.on('gameState', (roomState, showdown) => {
            console.log('room state', roomState)

            // Save other callers
            const otherCallers = roomState.callers.filter(caller => caller !== tokenState.decodedJWT.id)
            console.log('Other callers', otherCallers)
            if(otherCallers.length > 0)
                setCanCall(true)

            // Check if inactive player
            if(roomState.player.id !== tokenState.decodedJWT.id) {
                setActivePlayer(false)
            }
            // Save current player in game
            setPlayer(roomState.player)

            // Save game stage
            if(showdown === 'showdown' || (roomState.game.hits > 1 && roomState.game.stage === 'player-turn-right'))
                setStage('showdown')
            else
                setStage(roomState.game.stage)


            // Save dealer bust, player bust, dealer blackjack, player blackjack
            setDealerBusted(roomState.game.dealerHasBusted)
            setPlayerBusted(roomState.game.handInfo.right.playerHasBusted)


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
            if(roomState.game.handInfo.right !== {})
                setPlayerHandInfo(roomState.game.handInfo.right.cards)
            

            // const peer = new Peer(tokenState.decodedJWT.id);

            peer.on('call', (call) => {
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            
                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();
                    call.answer(mediaStream)
                    call.on('stream', function(remoteStream) {
                    otherUserVideoRef.current.srcObject = remoteStream
                    otherUserVideoRef.current.play();
                    });
                });
            })
          
            peerInstance.current = peer;

            if(otherCallers.length > 0) {
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();

                    const call = peerInstance.current.call(otherCallers[0], mediaStream)

                    call.on('stream', (remoteStream) => {
                        otherUserVideoRef.current.srcObject = remoteStream
                        otherUserVideoRef.current.play();
                    });
                });
            }
            
        })


        // Listens for new players/specators joining
        socket.on("joinedRoom", (roomId, newCaller) => {
            console.log('New player joinedRoom: ', roomId, newCaller)
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
        const maxBet = player.balance
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

        if(playerHandInfo !== undefined && playerHandInfo !== []) {
            playerHandInfo.forEach((playerCard) => {
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
    const renderPlayers = () => {
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
            <Col className='h-50 py-2'>
                <Row className='my-4'>
                    {renderPlayerHand()}
                </Row>
                <Row>
                    <Col>
                        <h3>{player.name}</h3>
                        <p className='my-1'>Balance: {player.balance}</p>
                    </Col>
                </Row>
                <Row className='mx-auto'>
                    {activePlayer? stageDisplay : <></>}
                </Row>
            </Col>
        )
    }

    // Render's video if other caller is present
    const renderVideo = () => {
        if(canCall) {
            return (
                <>
                    <video ref={currentUserVideoRef} style={{'width':'12rem'}}></video>
                    <video ref={otherUserVideoRef} style={{'width':'12rem'}}></video>    
                </>
            )
        } else {
            return <p className='mt-4'>No callers present. <br/>Share the game ID to chat with a friend!</p>
        }
    }

    return (
        <>
            <Navigation />
            <div className='w-75'>
                <Row className='mt-3 my-auto text-center'>
                    <Alert><b>Share this game ID with your friends: </b> {roomId}</Alert>
                </Row>    
            </div>
            <Container className='mt-3 my-auto text-center justify-content-center'>
                <Row xs={12} md={8}>
                    <Col>
                        <Row className='text-center h-25 w-75 mb-5 mx-auto justify-content-center' >
                            <Col>
                                <h2 className='mb-2'>Dealer</h2>
                                {/* <p className='mb-0'> Stage: {stage}</p> */}
                                <p className='mb-2'>{stageMessage}</p>
                                {renderDealerHand()}
                            </Col>
                        </Row>
                        <Row className='h-25 w-75 mx-auto'>
                            {renderPlayers()}
                        </Row>    
                    </Col>    
                    <Col xs={6} md={4} className='inline-block'>
                        <h3>Video Chat</h3>
                        {renderVideo()}
                    </Col>
                </Row>
                
            </Container>
        </>
    )
}

export default GameRoomPage