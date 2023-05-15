import { getToken } from "../utils/auth";
import { Peer } from "peerjs"
import React from "react";

const tokenState = getToken()
let peerInstance = new Peer()
if(tokenState.decodedJWT !== null)
    peerInstance = new Peer(tokenState.decodedJWT.id)

const PeerContext = React.createContext();

export {peerInstance, PeerContext}