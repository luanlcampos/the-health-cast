import React, { useState, useRef, useEffect } from "react";
import Loading from "@/components/Loading";
export default function LiveSessionStage() {
  const videoEl = useRef(null);
  console.log("SHould not infinetly loop");
  useEffect(() => {
    if (!videoEl) {
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      let video = videoEl.current;
      video.srcObject = stream;
      video.play();
    });
  }, [videoEl]);

  return <video className="w-1/2" ref={videoEl} />;
}

// const LiveSessionStage = ({ liveSessionRoomID }) => {
//   const [loading, setLoading] = useState(true);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const getUserMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           console.log("initialized");
//           setLoading(false);
//         }
//         // const peer = createPeer();
//         // stream.getTracks().forEach((track) => peer.addTrack(track, stream));
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getUserMedia();
//   }, [videoRef]);

//   function createPeer() {
//     const peer = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: "stun:stun.stunprotocol.org",
//         },
//       ],
//     });
//     peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

//     return peer;
//   }

//   async function handleNegotiationNeededEvent(peer) {
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     const payload = {
//       sdp: peer.localDescription,
//     };

//     const { data } = await axios.post("/broadcast", payload);
//     const desc = new RTCSessionDescription(data.sdp);
//     peer.setRemoteDescription(desc).catch((e) => console.error(e));
//   }
//   console.log("Should not be printing infinetly!")
//   return (
//     <div className="outline outline-cyan-500 ">
//       <h1>Live Session Stage</h1>
//       <h1>The Live Session Room: {liveSessionRoomID}</h1>
//       {loading ? (
//         <Loading></Loading>
//       ) : (
//         <video ref={videoRef} autoPlay id="video"></video>
//       )}
//     </div>
//   );
// };

// export default LiveSessionStage;

// /*
// async function init() {
//   window.onload = () => {
//     document.getElementById("my-button").onclick = () => {
//       init();
//     };
//   };
//   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   document.getElementById("video").srcObject = stream;
//   const peer = createPeer();
//   stream.getTracks().forEach((track) => peer.addTrack(track, stream));
// }

// function createPeer() {
//   const peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:stun.stunprotocol.org",
//       },
//     ],
//   });
//   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

//   return peer;
// }

// async function handleNegotiationNeededEvent(peer) {
//   const offer = await peer.createOffer();
//   await peer.setLocalDescription(offer);
//   const payload = {
//     sdp: peer.localDescription,
//   };

//   const { data } = await axios.post("/broadcast", payload);
//   const desc = new RTCSessionDescription(data.sdp);
//   peer.setRemoteDescription(desc).catch((e) => console.log(e));
// }

// */
