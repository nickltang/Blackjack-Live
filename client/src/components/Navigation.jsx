import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const tokenState = getToken()
    const navigate = useNavigate()

    const[loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        if(!tokenState.tokenExpired){
            setLoggedIn(true)
        }
    })

    const handleLogout = () => {
        localStorage.removeItem("jwt_token")
        navigate('/')
    }

    const loggedInNav = <>
        {/* <Nav.Link href="/account">Account</Nav.Link> */}
        <Button onClick={handleLogout}>Log out</Button>
    </>
    const loggedOutNav = <>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/login">Log In</Nav.Link>
                        </>

    return (
        <Navbar bg="light" expand="md">
        <Container>
            <Navbar.Brand href={loggedIn ? "/lobby" : "/"}>Blackjack Live</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-0">
                {loggedIn ? loggedInNav : loggedOutNav}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default Navigation