import { useRef, useState, useEffect } from "react";

export default function WebcamVideo({ room, pc }) {
  const [localMediaStream, setLocalMediaStream] = useState();
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const videoRef = useRef(null);

  console.log("HERE ARE THE ITEMS");
  console.log(room);
  console.log(pc);
  console.log(remoteMediaStream);
  console.log("==================");

  useEffect(() => {
    async function setupWebcamVideo() {
      if (!localMediaStream) {
        await setupLocalMediaStream();
      } else {
        console.log("local stream is valid");
        // Push tracks from local stream to peer connection
        localMediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });

        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };
        const videoCurr = videoRef.current;
        if (!videoCurr) return;
        const video = videoCurr;
        if (!video.srcObject) {
          video.srcObject = localMediaStream;
        }
      }
    }
    setupWebcamVideo();
  }, [localMediaStream]);

  async function setupLocalMediaStream() {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      setLocalMediaStream(ms);
      const rms = new MediaStream();
      setRemoteMediaStream(rms);
    } catch (e) {
      alert("Camera is disabled");
      throw e;
    }
  }
  return (
    <div className="w-full h-full relative z-0">
      <video className="h-full w-full mx-auto" ref={videoRef} autoPlay muted />
    </div>
  );
}
