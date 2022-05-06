import React, { useState, useEffect, useRef } from "react";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase/clientApp";
import styles from "../../../styles/PlaygroundWebRTCDemo.module.scss";
import WebcamVideo from "./WebcamVideo";

export default function PlaygroundWebRTCDemo({ room }) {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    if (servers) {
      console.log("Given stun server is valid, initializing PC instance...");
      const peerConnectionObj = new RTCPeerConnection(servers);
      setPCObj(peerConnectionObj);
      console.log(peerConnectionObj);
    }
    // Rest of your logic here
  }, []);
  // The Three states plus the stun server:

  // Global State
  const [pcObj, setPCObj] = useState(null);
  const [localStreamObj, setLocalStreamObj] = useState(null);
  const [remoteStreamObj, setRemoteStreamObj] = useState(null);

  const [toggleTab, setToggleTab] = useState(true);

  return (
    <div className={`${styles.outline}`}>
      <h1>This is the room you reside in: {room}</h1>
      {toggleTab ? (
        <div className="h-44 w-full">
          {/* {(room, pc, userID, remoteStream)} */}
          <WebcamVideo room={room} pc={pcObj} remoteStream={remoteStreamObj} />
        </div>
      ) : (
        <div>
          <div className="font-bold mb-10 text-lg">Not webcam</div>
          <div className="h-96">None</div>
        </div>
      )}
      <button onClick={() => setToggleTab(!toggleTab)}>Toggle webcam</button>
    </div>
  );
}
