const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const webrtc = require("wrtc");
const cors = require("cors");

let senderStream;

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/consumer", async ({ body }, res) => {
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  senderStream
    .getTracks()
    .forEach((track) => peer.addTrack(track, senderStream));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
});

app.post("/broadcast", async ({ body }, res) => {
  console.log(body);

  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  peer.ontrack = (e) => handleTrackEvent(e, peer);
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  console.log("sensed something");
  res.status(201).json(payload);
});

function handleTrackEvent(e, peer) {
  senderStream = e.streams[0];
}

var messageId = 2;
var messages = { 1: { name: "Bruce Lee", text: "Don't think - feel!!" } };

app.post("/api", function (request, response) {
  console.log(request.body.text);
  messages[messageId] = { name: "test", text: request.body.text };
  return response.status(201).json({ name: "test", text: request.body.text });
});

app.listen(8080, () => console.log("server started"));
