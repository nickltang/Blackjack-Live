import './App.css';
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';
import GameRoomPage from './pages/GameRoomPage';
import NotFoundPage from './pages/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountPage from './pages/AccountPage';
import {SocketContext, socket} from './context/SocketContext';
import { PeerContext } from './context/PeerContext';
import { peerInstance } from './context/PeerContext';

function App() {
  return (
    <PeerContext.Provider value={peerInstance}>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/create-account" element={<CreateAccountPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/lobby" element={<LobbyPage />}/>
          <Route path="/game-room/:roomId" element={<GameRoomPage />}/>
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>
        </SocketContext.Provider>
    </PeerContext.Provider>
  );
}

export default App;
