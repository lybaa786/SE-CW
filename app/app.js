// Import express.js
const express = require("express");

//create bycrypt
const bcrypt = require("bcrypt");

//Account import
const Account = require("./models/account");

// Create express app
var app = express();

// Use static files in the static directory
app.use (express.static ("static"));

//use the pug templating engine 

app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Get the Models
const  student  = require( "./models/student" );
const playlist = require("./models/playlist");


// Create a route for root - /
app.get("/", function(req, res) {
      
    res.render("index");

});

//create a route for root -/

app.get("/", function(req, res) {
    res.send("hello world");
});

//create a route for browse playlist.

app.get("/Browse-Playlist", async function(req, res) {

    try {
        const playlists= await playlist.getAll();
        res.render("Browse-Playlist", {playlists: playlists});
    } catch (err) {
        console.log(err);
        res.send("Error retrieving playlists");
    }

});

//create a route  for Home-page
app.get( "/Home", function (req, res){
    res.render("Home-Page");

});

//create route for profile.

app.get("/Profile", function(req, res) {
    res.render("Profile");
});

//create a route Account.

app.get("/Account", function(req, res){
    res.render("Account");
});

//create a route for welcome-Page.
app.get("/welcome", function(req, res){
    res.render("welcome-Page");
});

// create a route create account.
app.get("/create-account", function(req, res){
    res.render("Create-Account");
});

//create a route for login.

app.get("/Login", function(req, res){
    res.render("Login");
});

// create a route for homee

app.get("/Homee", function(req, res){
    res.render("Homee");

}); 


//create a route for playlist details

app.get("/playlists/:id", async function(req, res) {

    res.render("Playlist-Details", {playlist: new playlist(req.params.id)});

});

//create a route for creating a playlist.

app.get("/create-playlist", function(req, res) {

    res.render("create-playlist");

});


//send create account form data to the server
app.use(express.urlencoded({extended: true}));

app.post("/create-account", async function (req, res) {

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

//function to delete account
app.get("/delete-account", async function(req, res) {

    try {
        const email = req.query.email;
        const sql = "DELETE FROM users WHERE email = ?";
        await db.query(sql, [email]);
        res.redirect("/create-account");
    } catch (err) {
        console.log(err);
        res.send("Error deleting account");
    }       
});


//function to Get Email and Username from Database

app.get("/profile/:username", async function (req, res) {
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


//show one playlsts

app.get("/playlist/:id", async function(req, res) {
    try {
        const playlist = new Playlist(req.params.id);
        await playlist.getPlaylistDetails();
        res.render("Playlist-Details", {playlist: playlist});
    } catch (err) {
        console.log(err);
        res.send("Error retrieving playlist");
    }
});

//Function to create a new playlist

app.post ("/create-playlist", async function(req, res) {

    await Playlist.createPlaylist(req.body.name, req.body.description);

    res.redirect("/Browse-Playlist");
});

//Function to update a playlist

app.post("/playlist/:id/update", async function(req, res) {

    try {
        const playlist = new Playlist(req.params.id);
        await playlist.updatePlaylistName(req.body.name, req.body.description);
        res.redirect(`/playlist/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("Error updating playlist");
    }
});


//Function to delete a playlist by id

app.get("/playlist/:id/delete", async function(req, res) {
    try {
        const playlist = new Playlist(req.params.id);
        await playlist.deletePlaylist();
        res.redirect("/Browse-Playlist");
    } catch (err) {
        console.log(err);
        res.send("Error deleting playlist");        
    }
});

// Task 1 JSON formatted listing of students
app.get("/all-students", function(req, res) {
    var sql = 'select * from Students';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});

// Task 2 display a formatted list of students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-students template
    	    // The rows will be in a variable called data
        res.render('all-students', {data: results});
    });
});

// Single student page.  Show the students name, course and modules
app.get("/student-single/:id", async function (req, res) {
    var stId = req.params.id;
    console.log(stId);
    // Query to get the required results from the students table.  
    // We need this to get the programme code for this student.
    var stSql = "SELECT s.name as student, ps.name as programme, \
    ps.id as pcode from Students s \
    JOIN Student_Programme sp on sp.id = s.id \
    JOIN Programmes ps on ps.id = sp.programme \
    WHERE s.id = ?";

    var stResult = await db.query(stSql, [stId]);
    console.log(stResult);
    var pCode = stResult[0]['pcode'];
    
    // Get the modules for this student using the programme code from 
    // the query above
    var modSql = "SELECT * FROM Programme_Modules pm \
    JOIN Modules m on m.code = pm.module \
    WHERE programme = ?";

    var modResult = await db.query(modSql, [pCode]);
    console.log(modResult);

    // Send directly to the browser for now as a simple concatenation of strings
    res.send(JSON.stringify(stResult) + JSON.stringify(modResult));
    });


// JSON output of all programmes
app.get("/all-programmes", function(req, res) {
    var sql = 'select * from Programmes';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});

// Single programme page (no formatting or template)
app.get("/programme-single/:id", async function (req, res) {
    var pCode = req.params.id;
    var pSql = "SELECT * FROM Programmes WHERE id = ?";
    var results = await db.query(pSql, [pCode]);
    //Now call the database for the modules
    //Why do you think that the word modules is coming in before the name of the programme??
    var modSql = "SELECT * FROM Programme_Modules pm \
    JOIN Modules m on m.code = pm.module \
    WHERE programme = ?";
    var modResults = await db.query(modSql, [pCode]);
    // String the results together, just for now.  Later we will push this
    // through the template
    res.send(JSON.stringify(results) + JSON.stringify(modResults));  
});



// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    var sql = 'select * from test_table';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    
    db.query(sql).then(results => {
        console.log(results);
        res.json(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request.

app.get("/Student/:name/:id", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Name: " + req.params.name + ", User ID: " + req.params.id);
});

//html version of the above route
app.get ("/Student/:name/:id/:Age/html", function(req, res) {

    res.send(`
        <table border="1">
            <tr>
                <th>Name</th>
                <th>User ID</th>
                <th>Age</th>
            </tr>
            <tr>
                <td>${req.params.name}</td>
                <td>${req.params.id}</td>
                <td>${req.params.Age}</td>
            </tr>
        </table> 
        `);
    });
    

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});