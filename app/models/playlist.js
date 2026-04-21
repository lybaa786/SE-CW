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

    //playlist tags
    
    tags = [];

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

    async getSongs() {
        const sql = `SELECT id, title, artist, album, 
                     duration_secs, genre, spotify_url 
                     FROM songs WHERE playlist_id = ? ORDER BY id`;
        this.songs = await db.query(sql, [this.id]);
        return this.songs;
    }

    async getTags() {
        const sql = `SELECT t.id, t.name FROM tags t
                     JOIN playlist_tags pt ON pt.tag_id = t.id
                     WHERE pt.playlist_id = ?`;
        this.tags = await db.query(sql, [this.id]);
        return this.tags;
    }

    async  updatePlaylistName(title, description) {

        const sql = "UPDATE playlist SET title = ?, description = ? WHERE id = ?";
        await db.query(sql, [title, description, this.id]);

        this.name = title;
        this.decription = description;
    }

    async deletePlaylist() {


        const sql = "DELETE FROM  playlist WHERE id =?";
        await db.query(sql, [this.id]);
    }

    static async createPlaylist(title, description) {

        const sql = "INSERT INTO playlist (title, description) VALUES (?, ?)";
        const result = await db.query(sql, [title, description]);
        return new Playlist(result.insertId);
    }

    static async getAll() {

     const sql = "SELECT * FROM playlist";
     return await db.query(sql);
}
}

module.exports = Playlist;
