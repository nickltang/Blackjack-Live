import React from 'react'
import socketio from "socket.io-client";

// Establish socketio connection
export const socket = socketio.connect('http://localhost:8000/');
export const SocketContext = React.createContext();