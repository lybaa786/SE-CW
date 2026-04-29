const session = require('express-session');
const express = require("express");
const bcrypt = require("bcrypt");
const Account = require("./models/account");
const fetch = require("node-fetch");

var app = express();
app.use(session({
    secret: "playlistappsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.static("static"));
app.set('view engine', 'pug');
app.set('views', './app/views');
app.use(express.urlencoded({ extended: true }));

const db = require('./services/db');
const Playlist = require("./models/playlist");

// Make currentUser available in ALL templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Helper - get current user ID from session or default to 1
function getCurrentUserId(req) {
    return req.session.user ? req.session.user.id : 1;
}

//root for about page

app.get("/about-us", async function(req, res) {
    res.render ("about-us");

});

// HOME
app.get("/welcome", function(req, res) {
    res.render("welcome");
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
            SELECT p.id, p.title, p.description, p.created_at, p.user_id,
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

// PLAYLIST DETAIL
app.get("/playlists/:id", async function(req, res) {
    try {
        const pl = new Playlist(req.params.id);
        await pl.loadPageData(getCurrentUserId(req));
        res.render("Playlist-Details", {
            pl: pl,
            flashMessage: req.query.msg || ""
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving playlist");
    }
});

// LIKE / UNLIKE
app.post("/playlists/:id/like", async function(req, res) {
    try {
        if (req.body.action === "unlike") {
            await Playlist.unlike(req.params.id, getCurrentUserId(req));
        } else {
            await Playlist.like(req.params.id, getCurrentUserId(req));
        }
        res.redirect(`/playlists/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating like");
    }
});

// SAVE / UNSAVE
app.post("/playlists/:id/save", async function(req, res) {
    try {
        if (req.body.action === "unsave") {
            await Playlist.unsave(req.params.id, getCurrentUserId(req));
        } else {
            await Playlist.save(req.params.id, getCurrentUserId(req));
        }
        res.redirect(`/playlists/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating save");
    }
});

// RATE PLAYLIST
app.post("/playlists/:id/rate", async function(req, res) {
    try {
        const score = Number(req.body.score);
        if (!Number.isInteger(score) || score < 1 || score > 5) {
            return res.redirect(`/playlists/${req.params.id}?msg=Choose%20a%20rating%20from%201%20to%205`);
        }
        await Playlist.rate(req.params.id, getCurrentUserId(req), score);
        res.redirect(`/playlists/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error rating playlist");
    }
});

// COMMENT
app.post("/playlists/:id/comment", async function(req, res) {
    try {
        const comment = (req.body.comment || "").trim();
        if (!comment) {
            return res.redirect(`/playlists/${req.params.id}?msg=Comment%20cannot%20be%20empty`);
        }
        await Playlist.addComment(req.params.id, getCurrentUserId(req), comment);
        res.redirect(`/playlists/${req.params.id}#comments`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding comment");
    }
});

// REPORT
app.post("/playlists/:id/report", async function(req, res) {
    try {
        await Playlist.report(req.params.id, getCurrentUserId(req), req.body.reason || "Inappropriate playlist");
        res.redirect(`/playlists/${req.params.id}?msg=Playlist%20reported`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error reporting playlist");
    }
});

// CREATE PLAYLIST
app.get("/create-playlist", function(req, res) {
    res.render("create-playlist");
});

app.post("/create-playlist", async function(req, res) {
    try {
        const playlist = await Playlist.createPlaylist(
            req.body.title,
            req.body.description,
            getCurrentUserId(req),
            req.body.genre || null
        );
        res.redirect(`/playlists/${playlist.id}`);
    } catch (err) {
        console.log(err);
        res.send("Error creating playlist");
    }
});

// UPDATE PLAYLIST
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

// DELETE PLAYLIST
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

// LOGIN
app.get("/Login", function(req, res) {
    if (req.session.user) return res.redirect("/Browse-Playlist");
    res.render("Login", { error: null });
});

app.post("/login", async function(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render("Login", { error: "All fields are required" });
        }
        const rows = await db.query("SELECT * FROM Account WHERE Email = ?", [email]);
        if (!rows || rows.length === 0) {
            return res.render("Login", { error: "User not found" });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.PasswordHash);
        if (!match) {
            return res.render("Login", { error: "Incorrect password" });
        }
        req.session.user = {
            id: user.AccountID,
            username: user.username,
            email: user.Email
        };
        res.redirect("/Browse-Playlist");
    } catch (err) {
        console.log(err);
        res.render("Login", { error: "Something went wrong" });
    }
});

// LOGOUT
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

// CREATE ACCOUNT
app.get("/create-account", function(req, res) {
    res.render("Create-Account", { error: null });
});

app.post("/create-account", async function(req, res) {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.render("Create-Account", { error: "All fields are required" });
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

// PROFILE
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

// VIBE RATINGS
app.post('/rate/:userId', async function(req, res) {
    try {
        const { score, comment, vibe, happy, playlistId } = req.body;
        const situations = req.body.situation
            ? (Array.isArray(req.body.situation) ? req.body.situation : [req.body.situation])
            : [];

        const fullComment = JSON.stringify({
            vibe: vibe || null,
            happy: happy || 3,
            situations: situations,
            comment: comment || '',
            playlistId: playlistId || null
        });

        const raterId = req.session.user ? req.session.user.id : 1;
        const rateeId = parseInt(req.params.userId) || 1;
        const exchangeId = parseInt(playlistId) || 1;

        await db.query(
            `INSERT INTO ratings (rater_id, ratee_id, exchange_id, score, comment)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE score=VALUES(score), comment=VALUES(comment)`,
            [raterId, rateeId, exchangeId, score || 3, fullComment]
        );

        // Also save to playlist_ratings so the star rating shows on the playlist page
        if (playlistId) {
            await db.query(
                `INSERT INTO playlist_ratings (playlist_id, user_id, score)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE score=VALUES(score)`,
                [parseInt(playlistId), raterId, score || 3]
            );
            return res.redirect(`/playlists/${playlistId}`);
        }
        res.redirect('/ratings');
    } catch (err) {
        console.log('Rating error:', err.message);
        res.send('Error submitting rating: ' + err.message);
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
                    comment: parsed.comment || '',
                    happy: parsed.happy,
                    playlist_id: parsed.playlistId || null
                };
            } catch (e) {
                return { ...r, vibe: null, situations: [], comment: r.comment, happy: null, playlist_id: null };
            }
        });

        const playlistIds = [...new Set(ratings.map(r => r.playlist_id).filter(Boolean))];
        let playlistMap = {};
        if (playlistIds.length) {
            const placeholders = playlistIds.map(() => '?').join(',');
            const playlistRows = await db.query(
                `SELECT id, title FROM playlist WHERE id IN (${placeholders})`, playlistIds
            );
            playlistMap = Object.fromEntries(playlistRows.map(p => [p.id, p.title]));
        }

        const ratingsWithTitles = ratings.map(r => ({
            ...r,
            playlist_title: r.playlist_id ? playlistMap[r.playlist_id] || null : null
        }));

        res.render('ratings', { ratings: ratingsWithTitles });
    } catch (err) {
        console.log(err);
        res.send('Error loading ratings');
    }
});



app.get("/music-search", async (req, res) => {
  const searchTerm = req.query.q || "";

  let songs = [];

  if (searchTerm) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=12`;

    const response = await fetch(url);
    const data = await response.json();

    songs = data.results;
  }

  res.render("music-search", {
    songs,
    searchTerm
  });
});

// START
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
