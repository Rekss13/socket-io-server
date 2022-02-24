const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = {
        "success": true,
        "messageType": 1,
        "volume": Math.floor(Math.random() * 101),
        "maxVolume": 100,
        "muted": false,
        "AUX": false,
        "random": false,
        "playback": Math.floor(Math.random() * 2) ? "stop" : "play",
        "sleep": false,
        "usbFolders": [],
        "lanFolders": [],
        "indexing": false,
        "name": "URRI Receiver",
        "presets": [
            {
                "index": "0",
                "name": "Русское Радио",
                "editable": true
            },
            {
                "index": "1",
                "name": "Русское кино [Русское Радио]",
                "editable": true
            },
            {
                "index": "2",
                "name": "Too Nu [PromoDJ FM]",
                "editable": true
            },
            {
                "index": "3",
                "name": "ABC Lounge",
                "editable": true
            }
        ],
        "indexString": "",
        "mac": "02:42:a0:3c:e8:cd",
        "broadcastMode": false,
        "updating": false,
        "source": {
            "sourceType": 0,
            "id": 48,
            "name": "ABC Lounge",
            "mqUrl": true,
            "currentStream": "medium"
        },
        "smarthouse": {
            "protocols": [
                {
                    "name": "nooLite",
                    "enable": false
                },
                {
                    "name": "KNX",
                    "enable": false
                },
                {
                    "name": "Inputs",
                    "enable": true
                }
            ],
            "favoriteAccessories": []
        }
    }
    // Emitting a new message. Will be consumed by the client
    socket.emit("status", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));