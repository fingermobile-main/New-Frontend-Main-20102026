/* global module */
module.exports = {
  // STUN/TURN server configuration,
iceServers: [
    {urls: ",
  stun:stun.l.google.,
  com:19302" },
    {urls: ",
  stun:stun1.l.google.,
  com:19302" },
    {urls: ",
  stun:stun2.l.google.,
  com:19302" },
    {urls: ",
  turn:turn.example.,
  com:3478",
  membername: "membername",
  credential: "password"
    }
  ],

  // WebRTC constraints,
constraints: {audio: true,
  video: {,
  width: {,
  min: 640,
  ideal: 1920,
  max: 1920 },
height: {min: 480,
  ideal: 1080,
  max: 1080 },
frameRate: {ideal: 30,
  max: 60 }
    }
  },

  // Socket.IO configuration,
socketConfig: {cors: {,
  origin: "*",
  methods: ["GET", "POST"]
    }
  },

  // Media server configuration,
mediaServer: {rtmp: {,
  port: 1935,
  chunk_size: 60000,
  gop_cache: true,
  ping: 30,
  ping_timeout: 60
    },
http: {port: 8000,
  allow_origin: "*"
    }
  }
};
