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
  // set the media stream state for the HCP webcam
  const [localMediaStream, setLocalMediaStream] = useState();

  // socketRef is of type SocketIOClient.Socket
  const socketRef = useRef();
  // localStreamRef is local media stream reference
  const localStreamRef = useRef();
  // send peer connection is RTCPeerConnection
  const sendPCRef = useRef();
  // recieve Peer connections { [socketId: string]: RTCPeerConnection }
  const receivePCsRef = useRef({});
  // a user is export type WebRTCUser = {
  //   id: string;
  //   stream: MediaStream;
  // };
  const [users, setUsers] = useState([]);

  // video element for local media stream
  const localVideoRef = useRef(null);

  const closeReceivePC = useCallback((id) => {
    console.log("REMOVING USER--");
    if (!receivePCsRef.current[id]) return;
    receivePCsRef.current[id].close();
    delete receivePCsRef.current[id];
  }, []);

  const createReceiverOffer = useCallback(
    // sending data using the WebRTC connection with the HCP uid
    async (pc, senderSocketID) => {
      try {
        const sdp = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        console.log("create receiver offer success");
        await pc.setLocalDescription(new RTCSessionDescription(sdp));

        if (!socketRef.current) return;
        console.log(
          "Requesting the SFU server to get the offer object from HCP"
        );
        socketRef.current.emit("receiverOffer", {
          sdp,
          receiverSocketID: socketRef.current.id,
          senderSocketID,
          roomID: liveSessionRoomID,
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const createReceiverPeerConnection = useCallback((socketID) => {
    try {
      const pc = new RTCPeerConnection(pc_config);

      // add pc to peerConnections object
      if (receivePCsRef) {
        receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };
        console.log(
          "creating a peer connection for a particular user in that room and appending it to the recievePCsRef"
        );
      }

      pc.onicecandidate = (e) => {
        if (!(e.candidate && socketRef.current)) return;
        console.log("receiver PC onicecandidate");
        socketRef.current.emit("receiverCandidate", {
          candidate: e.candidate,
          receiverSocketID: socketRef.current.id,
          senderSocketID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              stream: e.streams[0],
            })
        );
      };

      // return pc
      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  const createReceivePC = useCallback(
    (id) => {
      // With the given user id -> id
      // create a recieved peer connection FOR every user that enters the room, including the HCP
      try {
        console.log(`socketID(${id}) user entered`);
        const pc = createReceiverPeerConnection(id);
        if (!(socketRef.current && pc)) return;
        createReceiverOffer(pc, id);
      } catch (error) {
        console.log(error);
      }
    },
    [createReceiverOffer, createReceiverPeerConnection]
  );

  const createSenderOffer = useCallback(async () => {
    try {
      if (!sendPCRef || !sendPCRef.current) {
        console.log("The sender Peer connection Ref is empty");
        return;
      }
      const sdp = await sendPCRef.current.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      console.log("create sender offer success");
      await sendPCRef.current.setLocalDescription(
        new RTCSessionDescription(sdp)
      );

      if (!socketRef || !socketRef.current) return;
      socketRef.current.emit("senderOffer", {
        sdp,
        senderSocketID: socketRef.current.id,
        roomID: liveSessionRoomID,
        hcpUID: user.uid,
      });
      console.log("Sending the HCP Offer to the socket in the server");
      console.log(
        `Double check the user ID: ${user.uid} ${userData.firstName} ${userData.lastName} vs. blah`
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const createSenderPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(pc_config);

    pc.onicecandidate = (e) => {
      if (!(e.candidate && socketRef.current)) return;
      console.log("sender PC onicecandidate");
      socketRef.current.emit("senderCandidate", {
        candidate: e.candidate,
        senderSocketID: socketRef.current.id,
      });
    };

    pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    if (localStreamRef && localStreamRef.current) {
      console.log("add local stream");
      localStreamRef.current.getTracks().forEach((track) => {
        if (!localStreamRef.current) return;
        pc.addTrack(track, localStreamRef.current);
      });
    } else {
      console.log("no local stream");
    }
    if (sendPCRef) sendPCRef.current = pc;
  }, []);

  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      if (localStreamRef) localStreamRef.current = stream;
      if (localVideoRef && localVideoRef.current)
        localVideoRef.current.srcObject = stream;
      if (!socketRef.current) return;

      createSenderPeerConnection();
      await createSenderOffer();

      socketRef.current.emit("joinRoom", {
        id: socketRef.current.id,
        userFirstName: userData.firstName,
        userLastName: userData.lastName,
        uuid: user.uid,
        roomID: liveSessionRoomID,
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, [createSenderOffer, createSenderPeerConnection]);

  useEffect(() => {
    socketRef.current = io.connect(SOCKET_SERVER_URL);
    // Send the local stream to the SFU server i.e. join room
    getLocalStream();

    socketRef.current.on("userEnter", (data) => {
      createReceivePC(data.id);
    });

    socketRef.current.on(
      "allUsers",
      // (data: { users: Array<{ id: string }> }) => {
      (data) => {
        data.users.forEach((user) => createReceivePC(user.id));
      }
    );

    // participant is leaving the room
    socketRef.current.on("userExit", (data) => {
      console.log("participant is leaving the room");
      closeReceivePC(data.id);
      setUsers((users) => users.filter((user) => user.id !== data.id));
    });

    socketRef.current.on(
      "getSenderAnswer",
      // sdp: RTCSessionDescription
      async (data) => {
        try {
          if (!sendPCRef.current) return;
          console.log("get sender answer");
          console.log(data.sdp);
          await sendPCRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp)
          );
        } catch (error) {
          console.log(error);
        }
      }
    );

    socketRef.current.on(
      "getSenderCandidate",
      //  candidate: RTCIceCandidateInit
      async (data) => {
        try {
          if (!(data.candidate && sendPCRef.current)) return;
          console.log("get sender candidate");
          await sendPCRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log("candidate add success");
        } catch (error) {
          console.log(error);
        }
      }
    );

    socketRef.current.on(
      "getReceiverAnswer",
      // { id: string, sdp: RTCSessionDescription }
      async (data) => {
        try {
          console.log(`get socketID(${data.id})'s answer`);
          // pc : RTCPeerConnection
          if (!receivePCsRef) {
            throw Error("For some reason the recieve PC ref is not defined");
          }
          const pc = receivePCsRef.current[data.id];
          if (!pc) return;
          await pc.setRemoteDescription(data.sdp);
          console.log(`socketID(${data.id})'s set remote sdp success`);
        } catch (error) {
          console.log(error);
        }
      }
    );

    socketRef.current.on(
      "getReceiverCandidate",
      // { id: string, candidate: RTCIceCandidateInit }
      async (data) => {
        try {
          console.log(data);
          console.log(`get socketID(${data.id})'s candidate`);
          // pc : RTCPeerConnection
          const pc = receivePCsRef.current[data.id];
          if (!(pc && data.candidate)) return;
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log(`socketID(${data.id})'s candidate add success`);
        } catch (error) {
          console.log(error);
        }
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (sendPCRef.current) {
        sendPCRef.current.close();
      }
      users.forEach((user) => closeReceivePC(user.id));
    };
    // eslint-disable-next-line
  }, [
    closeReceivePC,
    createReceivePC,
    createSenderOffer,
    createSenderPeerConnection,
    getLocalStream,
  ]);

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
      {users.map((user, index) => (
        <Video key={index} stream={user.stream} />
      ))}
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
