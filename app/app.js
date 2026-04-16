const express = require("express");
const bcrypt = require("bcrypt");
const Account = require("./models/account");

var app = express();

app.use(express.static("static"));
app.set('view engine', 'pug');
app.set('views', './app/views');
app.use(express.urlencoded({extended: true}));

const db = require('./services/db');
const Playlist = require("./models/playlist");

// Home
app.get("/", function(req, res) {
    res.render("index");
});

// BROWSE PLAYLISTS
app.get("/Browse-Playlist", async function(req, res) {
    try {
        const playlists = await Playlist.getAll();
        res.render("Browse-Playlist", { playlists: playlists });
    } catch (err) {
        console.log(err);
        res.send("Error retrieving playlists");
    }
});

// PLAYLIST DETAIL 
app.get("/playlists/:id", async function(req, res) {
    try {
        const pl = new Playlist(req.params.id);
        await pl.getPlaylistName();
        await pl.getSongs();
        await pl.getTags();
        res.render("Playlist-Details", { pl: pl });
    } catch (err) {
        console.log(err);
        res.send("Error retrieving playlist");
    }
});

//  CREATE PLAYLIST 
app.get("/create-playlist", function(req, res) {
    res.render("create-playlist");
});

app.post("/create-playlist", async function(req, res) {
    try {
        await Playlist.createPlaylist(req.body.title, req.body.description);
        res.redirect("/Browse-Playlist");
    } catch (err) {
        console.log(err);
        res.send("Error creating playlist");
    }
});

//  UPDATE PLAYLIST 
app.post("/playlists/:id/update", async function(req, res) {
    try {
        const pl = new Playlist(req.params.id);
        await pl.updatePlaylistName(req.body.title, req.body.description);
        res.redirect(`/playlists/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("Error updating playlist");
    }
});

//  DELETE PLAYLIST 
app.get("/playlists/:id/delete", async function(req, res) {
    try {
        const pl = new Playlist(req.params.id);
        await pl.deletePlaylist();
        res.redirect("/Browse-Playlist");
    } catch (err) {
        console.log(err);
        res.send("Error deleting playlist");
    }
});

//  PAGES 
app.get("/Home", function(req, res) {
    res.render("Home-Page");
});

app.get("/welcome", function(req, res) {
    res.render("welcome-Page");
});

app.get("/Homee", function(req, res) {
    res.render("Homee");
});

//  ACCOUNT 
app.get("/create-account", function(req, res) {
    res.render("Create-Account");
});

app.post("/create-account", async function(req, res) {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.send("All fields are required");
        }

        const existing = await db.query(
            "SELECT * FROM Account WHERE Email = ? OR Username = ?",
            [email, username]
        );

        if (existing.length > 0) {
            return res.send("Username or email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO Account (Username, Email, PasswordHash) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.redirect("/Login");
    } catch (err) {
        console.log(err);
        res.send("Error creating account");
    }
});

app.get("/delete-account", async function(req, res) {
    try {
        const email = req.query.email;
        await db.query("DELETE FROM Account WHERE Email = ?", [email]);
        res.redirect("/create-account");
    } catch (err) {
        console.log(err);
        res.send("Error deleting account");
    }
});

app.get("/Login", function(req, res) {
    res.render("Login");
});

app.get("/Account", function(req, res) {
    res.render("Account");
});

//  PROFILE 
app.get("/profile/:username", async function(req, res) {
    try {
        const rows = await db.query(
            "SELECT * FROM Account WHERE Username = ?",
            [req.params.username]
        );

        if (!rows || rows.length === 0) {
            return res.send("User not found");
        }

        res.render("Profile-Page", { user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//  START 
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});