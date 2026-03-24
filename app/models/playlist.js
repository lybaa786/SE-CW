//Get the functions in the db.js file to use

const db = require('../services/db');

class Playlist {
    //playlist ID
    
    id;

    //Playlist name

    name;

    //playlist description

    decription;

    //playlist songs 

    songs = [];

    constructor(id) {
        this.id = id;
    }


    async getPlaylistName() {

        if (typeof this.name !== 'string') {

            const sql = "SELECT title, description FROM playlist WHERE id = ?";
            const results = await db.query(sql, [this.id]);

            if (results.length > 0) {
                this.name = results[0].title;
                this.decription = results[0].description;
            }
        }
    }

    async  updatePlaylistName(name, description) {

        const sql = "UPDATE playlist SET title = ?, description = ? WHERE id = ?";
        await db.query(sql, [name, description, this.id]);

        this.name = name;
        this.decription = description;
    }

    async deletePlaylist() {


        const sql = "DELETE FROM  playlist WHERE id =?";
        await db.query(sql, [this.id]);
    }

    static async createPlaylist(name, description) {

        const sql = "INSERT INTO playlist (title, description) VALUES (?, ?)";
        const result = await db.query(sql, [name, description]);
        return new Playlist(result.insertId);
    }

    static async getAll() {

     const sql = "SELECT * FROM playlist";
     return await db.query(sql);
}
}

module.exports = Playlist;
