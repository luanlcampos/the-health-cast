import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/firebase/auth";
import io from "socket.io-client";
import Peer from "simple-peer";

import Video from "./Video";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";

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

const LiveSessionStage = ({ liveSessionRoomID, hcpCreatorInfo }) => {
  // obtain user data from Auth
  const { user, userData } = useAuth();
  // check if current user is the creator or not:
  let creatorStatus = hcpCreatorInfo.uid === user.uid;

  // Refs
  // video element for local media stream
  const localVideoRef = useRef(null);
  // localStream is local media stream reference
  const [localStream, setLocalStream] = useState();
  // socketRef is of type SocketIOClient.Socket
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect(SOCKET_SERVER_URL);
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);
        // const peer = createPeer();
        // stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
    initializeReadySignalToBroadcast();
  }, [localVideoRef]);

  // console.log(creatorStatus)
  // console.log(hcpCreatorInfo);
  // console.log(user);
  // console.log(userData);

  function initializeReadySignalToBroadcast() {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: localStream,
    });

    peer.on("signal", (data) => {
      socketRef.current.emit("broadcast", {
        currentLiveSessionRoom: liveSessionRoomID,
        broadcaster: hcpCreatorInfo,
        sdp: data
        //signalData: data,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socketRef.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  return (
    <div>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      {/* {users.map((user, index) => (
         <Video key={index} stream={user.stream} />
       ))} */}
    </div>
  );
};

export default LiveSessionStage;

// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// const pc_config = {
//   iceServers: [
//     // {
//     //   urls: 'stun:[STUN_IP]:[PORT]',
//     //   'credentials': '[YOR CREDENTIALS]',
//     //   'username': '[USERNAME]'
//     // },
//     {
//       urls: "stun:stun.l.google.com:19302",
//     },
//   ],
// };
// const SOCKET_SERVER_URL = "http://localhost:8080";

// const LiveSessionStage = ({ liveSessionRoomID }) => {
//   // obtain user data from Auth
//   const { user, userData } = useAuth();
//   // set the media stream state for the HCP webcam
//   const [localMediaStream, setLocalMediaStream] = useState();

//   const socketRef = useRef();
//   const pcRef = useRef();
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   useEffect(() => {
//     async function setupWebcamVideo() {
//       if (!localMediaStream) {
//         await setupLocalMediaStream();
//       } else {
//         const videoCurr = localVideoRef.current;
//         if (!videoCurr) return;
//         const video = videoCurr;
//         if (!video.srcObject) {
//           video.srcObject = localMediaStream;
//         }
//       }
//     }
//     setupWebcamVideo();
//   }, [localMediaStream]);

//   async function setupLocalMediaStream() {
//     try {
//       const ms = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//         audio: true,
//       });
//       setLocalMediaStream(ms);
//     } catch (e) {
//       alert("Camera is disabled");
//       throw e;
//     }
//   }

//   const setVideoTracks = async () => {
//     try {
//       //   const stream = await navigator.mediaDevices.getUserMedia({
//       //     video: true,
//       //     audio: true,
//       //   });
//       //   if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       if (!(pcRef.current && socketRef.current)) {
//         console.log("set Video Tracks NOT rendering");
//         return;
//       }
//       if (localVideoRef.current && localMediaStream) {
//         console.log(localMediaStream);
//         console.log("set Video Tracks rendering");
//         localMediaStream.getTracks().forEach((track) => {
//           if (!pcRef.current) return;
//           pcRef.current.addTrack(track, localMediaStream);
//         });
//       }
//       pcRef.current.onicecandidate = (e) => {
//         if (e.candidate) {
//           if (!socketRef.current) return;
//           console.log("onicecandidate");
//           socketRef.current.emit("candidate", e.candidate);
//         }
//       };
//       pcRef.current.oniceconnectionstatechange = (e) => {
//         console.log(e);
//       };
//       pcRef.current.ontrack = (ev) => {
//         console.log("add remotetrack success");
//         if (remoteVideoRef && remoteVideoRef.current) {
//           console.log("Should be rendering the remote stream");
//           remoteVideoRef.current.srcObject = ev.streams[0];
//         }
//       };
//       socketRef.current.emit("join_room", {
//         room: liveSessionRoomID,
//         userUID: user.uid,
//         userData: userData,
//       });
//       console.log("set Video Tracks finished rendering");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const createOffer = async () => {
//     console.log("create offer");
//     if (!(pcRef.current && socketRef.current)) return;
//     try {
//       const sdp = await pcRef.current.createOffer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: true,
//       });
//       await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
//       socketRef.current.emit("offer", sdp);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const createAnswer = async (sdp) => {
//     if (!(pcRef.current && socketRef.current)) return;
//     try {
//       await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
//       console.log("answer set remote description success");
//       const mySdp = await pcRef.current.createAnswer({
//         offerToReceiveVideo: true,
//         offerToReceiveAudio: true,
//       });
//       console.log("create answer");
//       await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
//       socketRef.current.emit("answer", mySdp);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   console.log("Constantly rendering");
//   useEffect(() => {
//     socketRef.current = io(SOCKET_SERVER_URL);
//     pcRef.current = new RTCPeerConnection(pc_config);

//     // socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
//     socketRef.current.on("all_users", (allUsers) => {
//       if (allUsers.length > 0) {
//         createOffer();
//       }
//     });

//     socketRef.current.on("getOffer", (sdp) => {
//       //console.log(sdp);
//       console.log("get offer");
//       createAnswer(sdp);
//     });

//     socketRef.current.on("getAnswer", (sdp) => {
//       console.log("get answer");
//       if (!pcRef.current) return;
//       pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
//       //console.log(sdp);
//     });

//     socketRef.current.on(
//       "getCandidate",
//       //async (candidate: RTCIceCandidateInit) => {
//       async (candidate) => {
//         if (!pcRef.current) return;
//         await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//         console.log("candidate add success");
//       }
//     );

//     setVideoTracks();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//       if (pcRef.current) {
//         pcRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <video
//         style={{
//           width: 240,
//           height: 240,
//           margin: 5,
//           backgroundColor: "black",
//         }}
//         muted
//         ref={localVideoRef}
//         autoPlay
//       />
//       <video
//         id="remotevideo"
//         style={{
//           width: 240,
//           height: 240,
//           margin: 5,
//           backgroundColor: "black",
//         }}
//         ref={remoteVideoRef}
//         autoPlay
//       />
//     </div>
//   );
// };

// export default LiveSessionStage;
