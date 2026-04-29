const session = require('express-session');
const express = require("express");
const bcrypt = require("bcrypt");
const Account = require("./models/account");
const fetch = require("node-fetch");
const apiKey = process.env.TICKETMASTER_API_KEY;

require('dotenv').config();

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

// REquire login function
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
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

        // Save songs if provided
        const titles = req.body.song_title;
        if (titles) {
            const songTitles = Array.isArray(titles) ? titles : [titles];
            const artists = [].concat(req.body.song_artist || []);
            const albums = [].concat(req.body.song_album || []);
            const genres = [].concat(req.body.song_genre || []);
            const durations = [].concat(req.body.song_duration || []);
            const spotifyUrls = [].concat(req.body.song_spotify || []);

            for (let i = 0; i < songTitles.length; i++) {
                if (songTitles[i] && songTitles[i].trim()) {
                    await Playlist.addSong(
                        playlist.id,
                        songTitles[i].trim(),
                        artists[i] || null,
                        albums[i] || null,
                        genres[i] || null,
                        durations[i] || null,
                        spotifyUrls[i] || null
                    );
                }
            }
        }

        res.redirect(`/playlists/${playlist.id}`);
    } catch (err) {
        console.log(err);
        res.send("Error creating playlist");
    }
});


// ADD SONG TO PLAYLIST
app.post("/playlists/:id/add-song", async function(req, res) {
    try {
        const { title, artist, album, genre, duration_secs, spotify_url } = req.body;
        if (!title) return res.redirect(`/playlists/${req.params.id}?msg=Song title is required`);
        await Playlist.addSong(
            req.params.id, title, artist, album, genre, duration_secs, spotify_url
        );
        res.redirect(`/playlists/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("Error adding song: " + err.message);
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
    if (req.session.user) return res.redirect("/Homee");
    res.render("Login", { error: null });
});

app.post("/login", async function(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("Login", { error: "All fields are required" });
        }

        const rows = await db.query(
            `
            SELECT 
                Account.AccountID,
                Account.Username,
                Account.Email,
                Account.PasswordHash,
                users.id AS userId,
                users.name AS name
            FROM Account
            LEFT JOIN users 
                ON users.email = Account.Email
            WHERE Account.Email = ?
            LIMIT 1
            `,
            [email]
        );

        if (!rows || rows.length === 0) {
            return res.render("Login", { error: "User not found" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.PasswordHash);

        if (!match) {
            return res.render("Login", { error: "Incorrect password" });
        }

        req.session.user = {
            id: user.userId || user.AccountID,
            accountId: user.AccountID,
            username: user.name || user.Username,
            email: user.Email
        };
        res.redirect("/Homee");
    } catch (err) {
        console.log(err);
        res.render("Login", { error: "Something went wrong" });
    }
});

// HOME PAGE
app.get("/Homee", async function(req, res) {
    if (!req.session.user) {
        return res.redirect("/Login");
    }

    const userId = req.session.user.id;

    try {
        const myPlaylists = await db.query(
            "SELECT * FROM playlist WHERE user_id = ? ORDER BY id DESC",
            [userId]
        );

        const recommendedPlaylists = await db.query(
            "SELECT * FROM playlist WHERE user_id != ? ORDER BY RAND() LIMIT 6",
            [userId]
        );

        res.render("Homee", {
            user: req.session.user,
            myPlaylists: myPlaylists,
            recommendedPlaylists: recommendedPlaylists
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading home page");
    }
});


// LOGOUT
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/welcome");
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

        await db.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [username, email]
        );

        res.redirect("/Login");
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

app.post("/follow/:id", requireLogin, async function(req, res) {
    try {
        const followerId = req.session.user.id;
        const followingId = req.params.id;

        if (Number(followerId) === Number(followingId)) {
            return res.redirect("back");
    }

        await db.query(
            "INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)",
            [followerId, followingId]
    );

        res.redirect("back");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error following user");
    }
});

app.post("/unfollow/:id", requireLogin, async function(req, res) {
    try {
        await db.query(
            "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
            [req.session.user.id, req.params.id]
        );

        res.redirect("back");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error unfollowing user");
    }
});

// PROFILE
app.get("/profile/:username", async function(req, res) {
    try {
        // 1. Get user
        const rows = await db.query(
            "SELECT * FROM users WHERE name = ?",
            [req.params.username]
        );

        if (!rows || rows.length === 0) {
            return res.send("User not found");
        }

        const profileUser = rows[0]; // ✅ YOU WERE MISSING THIS

        // 2. Get playlists
        const userPlaylists = await db.query(
            "SELECT * FROM playlist WHERE user_id = ?",
            [profileUser.id]
        );

        const followerRows = await db.query(
            "SELECT COUNT(*) AS count FROM follows WHERE following_id = ?",
            [profileUser.id]
        );

        const followingRows = await db.query(
            "SELECT COUNT(*) AS count FROM follows WHERE following_id = ?",
            [profileUser.id]
        );

        let isFollowing = false;

        if (req.session.user && req.session.user.id !== profileUser.id) {
            const followRows = await db.query(
                "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
                [req.session.user.id, profileUser.id]
            );

            isFollowing = followRows.length > 0;
        }

        

        // 3. Render page
        res.render("Profile-Page", {
            user: profileUser,
            currentUser: req.session.user,
            userPlaylists,
            followerCount: followerRows[0].count,
            followingCount: followingRows[0].count,
            isFollowing
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// EDIT PROFILE
app.get("/edit-profile", requireLogin, async (req, res) => {
    try {
        const rows = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [req.session.user.id]
        );
    
        res.render("Edit-Profile", {
            user: rows[0]
        });
    } catch (err) {
        console.log(err);
        res.send("Error loading edit profile page ")
    }

});

app.post("/edit-profile", requireLogin, async function(req, res) {
    const { username, email, bio } = req.body;
    
    try {
        await db.query(
            "UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?",
            [username, email, bio, req.session.user.id]
        );

        req.session.user.username = username;
        req.session.user.email = email;
        req.session.user.bio = bio;

        res.redirect(`/profile/${username}`);
    } catch (err) {
        console.log(err);
        res.render("Edit-Profile", {
            user: req.session.user,
            error: "Could not update profile"
        });
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



// MUSIC SEARCH
app.get("/music-search", async function(req, res) {
  const searchTerm = req.query.q || "";

  let songs = [];

  if (searchTerm) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=12`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("URL:", url);
    console.log("Data:", data);

    songs = data.results;
  }

  res.render("music-search", {
    songs,
    searchTerm
  });
});

app.get("/live-music-alert", async function(req, res) {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  const url =
    `https://app.ticketmaster.com/discovery/v2/events.json?` +
    `apikey=${apiKey}&keyword=music&city=London&countryCode=GB&size=10`;

  const response = await fetch(url);
  const data = await response.json();

  console.log ("API KEY:", apiKey);
  console.log("URL:", url);
  console.log("Data:", data);

  const events = data._embedded ? data._embedded.events : [];

  res.render("live-music-alert", {
    events
  });
});

// START
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});