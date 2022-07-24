let http = require("http");
let express = require("express");
let cors = require("cors");
let wrtc = require("wrtc");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});



server.listen(process.env.PORT || 8080, () => {
  console.log("server running on 8080");
});