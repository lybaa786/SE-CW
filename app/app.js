const session = require('express-session')
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

//  HOME 
app.get("/", function(req, res) {
    res.render("index");
});

// BROWSE PLAYLISTS 
app.get("/Browse-Playlist", async function(req, res) {
    try {
        const selectedTag = req.query.tag || "";
        const sort = req.query.sort || "newest";
        const search = req.query.search || "";

        let orderBy = "p.created_at DESC";
        if (sort === "title") orderBy = "p.title ASC";
        else if (sort === "oldest") orderBy = "p.created_at ASC";

        let sql = `
            SELECT 
                p.id, p.title, p.description, p.created_at, p.user_id,
                u.name AS username,
                GROUP_CONCAT(t.name SEPARATOR ',') AS tags
            FROM playlist p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN playlist_tags pt ON p.id = pt.playlist_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE 1=1
        `;

        const params = [];

        if (search) {
            sql += ` AND (p.title LIKE ? OR p.description LIKE ?) `;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (selectedTag) {
            sql += `
                AND p.id IN (
                    SELECT pt2.playlist_id FROM playlist_tags pt2
                    JOIN tags t2 ON pt2.tag_id = t2.id
                    WHERE t2.name = ?
                )
            `;
            params.push(selectedTag);
        }

        sql += ` GROUP BY p.id, p.title, p.description, p.created_at, p.user_id, u.name ORDER BY ${orderBy}`;

        const playlists = await db.query(sql, params);
        const allTags = await db.query(`SELECT id, name FROM tags ORDER BY name ASC`);

        res.render("Browse-Playlist", {
            playlists: playlists || [],
            allTags: allTags || [],
            selectedTag: selectedTag || "",
            sort: sort || "newest",
            search: search || ""
        });
    } catch (err) {
        console.log("Browse playlist error:", err);
        res.send("Error retrieving playlists");
    }
});

//  PLAYLIST DETAIL
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
app.get("/Home", function(req, res) { res.render("Home-Page"); });
app.get("/welcome", function(req, res) { res.render("welcome-Page"); });
app.get("/Homee", function(req, res) { res.render("Homee"); });

//  ACCOUNT
app.get("/create-account", function(req, res) {
    res.render("Create-Account");
});

app.post("/create-account", async function(req, res) {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.render("Create-Account", { error: "All fields are required"});
        }
        if (password !== confirmPassword) {
            return res.render("Create-Account", { error: "Passwords do not match" });
        }

        const existing = await db.query(
            "SELECT * FROM Account WHERE Email = ? OR Username = ?",
            [email, username]
        );
        if (existing.length > 0) {
            return res.render("Create-Account", { error: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO Account (Username, Email, PasswordHash) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );
        res.redirect("/Login");
    } catch (err) {
        console.log(err);
        res.send(err.message);
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

app.get("/Login", function(req, res) { res.render("Login"); });
app.get("/Account", function(req, res) { res.render("Account"); });

//  PROFILE
app.get("/profile/:username", async function(req, res) {
    try {
        const rows = await db.query(
            "SELECT * FROM Account WHERE Username = ?",
            [req.params.username]
        );
        if (!rows || rows.length === 0) return res.send("User not found");
        res.render("Profile-Page", { user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//  RATINGS 
app.post('/rate/:userId', async function(req, res) {
    try {
        const { score, comment, vibe, happy } = req.body;
        const situations = req.body.situation
            ? (Array.isArray(req.body.situation) ? req.body.situation : [req.body.situation])
            : [];

        const fullComment = JSON.stringify({
            vibe: vibe || null,
            happy: happy || 3,
            situations: situations,
            comment: comment || ''
        });

        await db.query(
            `INSERT INTO ratings (rater_id, ratee_id, exchange_id, score, comment)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE score=VALUES(score), comment=VALUES(comment)`,
            [1, req.params.userId, 1, score, fullComment]
        );
        res.redirect('/ratings');
    } catch (err) {
        console.log(err);
        res.send('Error submitting rating');
    }
});

app.get('/ratings', async function(req, res) {
    try {
        const rawRatings = await db.query(`
            SELECT r.*,
                   u1.name as rater_name,
                   u2.name as ratee_name
            FROM ratings r
            JOIN users u1 ON u1.id = r.rater_id
            JOIN users u2 ON u2.id = r.ratee_id
            ORDER BY r.created_at DESC
        `);

        const ratings = rawRatings.map(r => {
            try {
                const parsed = JSON.parse(r.comment);
                return {
                    ...r,
                    vibe: parsed.vibe,
                    situations: parsed.situations || [],
                    comment: parsed.comment,
                    happy: parsed.happy
                };
            } catch(e) {
                return { ...r, vibe: null, situations: [], comment: r.comment };
            }
        });

        res.render('ratings', { ratings });
    } catch (err) {
        console.log(err);
        res.send('Error loading ratings');
    }
});

//  START
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});