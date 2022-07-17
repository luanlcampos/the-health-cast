import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/firebase/auth";
import io from "socket.io-client";
import Video from "./Video";

const pc_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
const SOCKET_SERVER_URL = "http://localhost:8080";

const LiveSessionStage = ({ liveSessionRoomID }) => {
  // obtain user data from Auth
  const { user, userData } = useAuth();
  // Refs
  const videoEl = useRef(null);

  async function handleNegotiationNeededEvent(peer) {
    // const { test } = await fetch(`http://localhost:8080/api`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: "jack", // Use your own property name / key
    //     text: "HULLO", // Use your own property name / key
    //   }),
    //   method: "POST",
    // });
    // console.log(test);
    // const testTwo = await test.json();
    fetch(`http://localhost:8080/api`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "jack", // Use your own property name / key
        text: "HULLO", // Use your own property name / key
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => console.log(e));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
      sdp: peer.localDescription,
    };

    // const { data } = await fetch(`http://localhost:8080/broadcast`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: {
    //     name: payload, // Use your own property name / key
    //   },
    //   method: "POST",
    // });

    fetch(`http://localhost:8080/broadcast`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e) => console.log(e));
      });
  }

  useEffect(() => {
    if (!videoEl) {
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      let video = videoEl.current;
      video.srcObject = stream;
      video.play();
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org",
          },
        ],
      });

      peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    });
  }, [videoEl]);

  return <video ref={videoEl} />;
};
export default LiveSessionStage;
