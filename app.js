const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const { requireAuth, checkUser } = require("./middleware/middlewareAutenticaion");
const User = require('./model/schemas/UserSchema'); // Import your User schema

// express app
const app = express();

// socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let people = {};
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on("message", function (data) {
        io.emit('message', data);
    });

    socket.on("join", (username) => {
        people[socket.id] = username;
        io.emit("new user", username + " entered the server.");
    });

    socket.on("entrouChat", (roomName) => {
        socket.join(roomName);  
        socket.emit("entrou", "Entered the chat");
    });
});

// connect to MongoDB
const dbURI = 'mongodb://localhost:27017/TicketSystem';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log("Connection error! " + error);
    });

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use("/public", express.static('./public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// home page
app.get('*', checkUser);
app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => res.render('home'));

app.use(routes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

app.get('/profile', (req, res) => {
    Ticket.find()
        .then((result) => {
            console.log(result);
            res.render('profile', { tickets: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

// Start the server
http.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
