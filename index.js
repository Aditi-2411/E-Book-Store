var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ebook-store');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Serve the Landing Page (index.html)
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the Main Application Page (landing.html)
app.get("/landing", (req, res) => {
    res.sendFile(__dirname + '/landing.html');
});

// Sign-Up Route
app.post("/sign_up", (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "username": username,
        "email": email,
        "password": password
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            res.status(500).send("Error inserting data");
        } else {
            console.log("Record Inserted Successfully");
            res.status(200).send("Sign Up Successful");
        }
    });
});

// Sign-In Route
app.post("/sign_in", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    db.collection('users').findOne({ username: username, password: password }, (err, user) => {
        if (err) {
            res.status(500).send("Error finding user");
        }
        if (user) {
            // User found, successful sign-in
            res.status(200).send("Sign In Successful");
        } else {
            // User not found or password incorrect
            res.status(401).send("Invalid Credentials");
        }
    });
});

// Start the Server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});




