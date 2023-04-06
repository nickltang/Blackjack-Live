import { UNSAFE_convertRoutesToDataRoutes } from '@remix-run/router';
import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const loggedInHome = "http://localhost:3000/lobby"
const loggedOutHome = "http://localhost:3000/"

const Navigation = () => {
    const [loggedIn, setLoggedIn] = useState(true)

    const loggedInNav = <Nav.Link href="/account">Account</Nav.Link>
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