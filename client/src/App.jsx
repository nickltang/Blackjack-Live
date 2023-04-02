import { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';
import GameRoomPage from './pages/GameRoomPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/create-account" element={<CreateAccountPage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/lobby" element={<LobbyPage />}/>
      <Route path="/game-room/:id" element={<GameRoomPage />}/>
      <Route path="*" element={<NotFoundPage />}/>
    </Routes>
  );
}

export default App;
