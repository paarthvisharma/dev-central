const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const limit = require('express-rate-limit');
const {rateLimit} = limit;

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const {MONGO_URL} = require('./config');
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10000,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(express.json());

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));

app.use(limiter);


morgan.token('user', (req, res) => {
    return req.session?.currentUser?.username || 'No User';
});

morgan.token('body', (req, res) => {
    if (req.body && Object.keys(req.body).length) {
        const body = {...req.body}; 
        if (body.password) {
            body.password = '***'; 
        }
        try {
            return JSON.stringify(body);
        } catch (error) {
            return 'Invalid body data'; 
        }
    }
    return '{}'; 
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan(':method :url :status :response-time ms - :user :body', { stream: accessLogStream }));

app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const userController = require("./controller/user");
const reportedPost = require("./controller/reportedPost");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/user", userController);
app.use("/reportedPost", reportedPost);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server