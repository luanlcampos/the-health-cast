let http = require("http");
let express = require("express");
let cors = require("cors");
let wrtc = require("wrtc");

const app = express();
const server = http.createServer(app);
// forward the broadcast stream to the consumers: 
let senderStream;
app.use(cors());

let receiverPCs = {};
let senderPCs = {};
let users = {};
let socketToRoom = {};

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

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  socket.on("broadcast", async (data) => {
    try {
      const peer = new wrtc.RTCPeerConnection(pc_config);
      peer.ontrack = (e) => handleTrackEvent(e, peer);
      const desc = new webrtc.RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
          sdp: peer.localDescription
      }
      socket.emit("to all users", payload);
     // res.json(payload);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("joinRoom", async (data) => {
    try {
      const peer = new wrtc.RTCPeerConnection(pc_config);
      const desc = new webrtc.RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
      senderStream
        .getTracks()
        .forEach((track) => peer.addTrack(track, senderStream));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription,
      };

      // res.json(payload);
      socket.emit("accept viewing", payload);
    } catch (error) {
      console.log(error);
    }
  });
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};

server.listen(process.env.PORT || 8080, () => {
  console.log("server running on 8080");
});

// io.sockets.on("connection", (socket) => {
//   socket.emit("me", socket.id);

//   socket.on("disconnect", () => {
//     socket.broadcast.emit("callEnded");
//   });

//   socket.on("callUser", (data) => {
//     io.to(data.userToCall).emit("callUser", {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name,
//     });
//   });

//   socket.on("answerCall", (data) => {
//     io.to(data.to).emit("callAccepted", data.signal);
//   });
// });
