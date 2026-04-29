const db = require('../services/db');

class Playlist {
  id;
  name;
  description;
  createdAt;
  ownerId;
  ownerName;
  genre;

  songs = [];
  tags = [];
  comments = [];
  stats = {
    likesCount: 0,
    commentsCount: 0,
    savesCount: 0,
    avgRating: null,
    ratingsCount: 0
  };
  viewerState = {
    liked: false,
    saved: false,
    rating: 0
  };

  constructor(id) {
    this.id = id;
  }

  async getDetails() {
    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.created_at,
        p.user_id,
        p.genre,
        u.name AS owner_name
      FROM playlist p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      LIMIT 1
    `;

    const rows = await db.query(sql, [this.id]);

    if (!rows.length) {
      throw new Error("Playlist not found");
    }

    const row = rows[0];
    this.name = row.title;
    this.description = row.description;
    this.createdAt = row.created_at;
    this.ownerId = row.user_id;
    this.ownerName = row.owner_name;
    this.genre = row.genre;
  }

  async getSongs() {
    const sql = `
      SELECT id, title, artist, album, duration_secs, genre, spotify_url
      FROM songs
      WHERE playlist_id = ?
      ORDER BY id ASC
    `;
    this.songs = await db.query(sql, [this.id]);
    return this.songs;
  }

  async getTags() {
    const sql = `
      SELECT t.id, t.name
      FROM tags t
      JOIN playlist_tags pt ON pt.tag_id = t.id
      WHERE pt.playlist_id = ?
      ORDER BY t.name ASC
    `;
    this.tags = await db.query(sql, [this.id]);
    return this.tags;
  }

  async getComments() {
    const sql = `
      SELECT
        pc.id,
        pc.body,
        pc.created_at,
        u.name AS user_name
      FROM playlist_comments pc
      JOIN users u ON pc.user_id = u.id
      WHERE pc.playlist_id = ?
      ORDER BY pc.created_at DESC, pc.id DESC
    `;
    this.comments = await db.query(sql, [this.id]);
    return this.comments;
  }

  async getStats() {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM playlist_likes WHERE playlist_id = ?) AS likesCount,
        (SELECT COUNT(*) FROM playlist_comments WHERE playlist_id = ?) AS commentsCount,
        (SELECT COUNT(*) FROM playlist_saves WHERE playlist_id = ?) AS savesCount,
        (SELECT ROUND(AVG(score), 1) FROM playlist_ratings WHERE playlist_id = ?) AS avgRating,
        (SELECT COUNT(*) FROM playlist_ratings WHERE playlist_id = ?) AS ratingsCount
    `;

    const rows = await db.query(sql, [
      this.id,
      this.id,
      this.id,
      this.id,
      this.id
    ]);

    this.stats = rows[0] || this.stats;
    return this.stats;
  }

  async getViewerState(userId) {
    if (!userId) {
      this.viewerState = { liked: false, saved: false, rating: 0 };
      return this.viewerState;
    }

    const sql = `
      SELECT
        EXISTS(
          SELECT 1 FROM playlist_likes
          WHERE playlist_id = ? AND user_id = ?
        ) AS liked,
        EXISTS(
          SELECT 1 FROM playlist_saves
          WHERE playlist_id = ? AND user_id = ?
        ) AS saved,
        (
          SELECT score FROM playlist_ratings
          WHERE playlist_id = ? AND user_id = ?
          LIMIT 1
        ) AS rating
    `;

    const rows = await db.query(sql, [
      this.id, userId,
      this.id, userId,
      this.id, userId
    ]);

    const row = rows[0] || {};
    this.viewerState = {
      liked: !!row.liked,
      saved: !!row.saved,
      rating: row.rating || 0
    };

    return this.viewerState;
  }

  async loadPageData(userId) {
    await this.getDetails();

    const [songs, tags, comments, stats, viewerState] = await Promise.all([
      this.getSongs(),
      this.getTags(),
      this.getComments(),
      this.getStats(),
      this.getViewerState(userId)
    ]);

    this.songs = songs;
    this.tags = tags;
    this.comments = comments;
    this.stats = stats;
    this.viewerState = viewerState;
  }

  async updatePlaylistName(title, description) {
    const sql = "UPDATE playlist SET title = ?, description = ? WHERE id = ?";
    await db.query(sql, [title, description, this.id]);
    this.name = title;
    this.description = description;
  }

  async deletePlaylist() {
    const sql = "DELETE FROM playlist WHERE id = ?";
    await db.query(sql, [this.id]);
  }

  static async createPlaylist(title, description, userId = 1, genre = null) {
    const sql = `
      INSERT INTO playlist (title, description, user_id, genre)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(sql, [title, description, userId, genre]);
    return new Playlist(result.insertId);
  }

  static async like(playlistId, userId) {
    await db.query(
      `INSERT IGNORE INTO playlist_likes (playlist_id, user_id) VALUES (?, ?)`,
      [playlistId, userId]
    );
  }

  static async unlike(playlistId, userId) {
    await db.query(
      `DELETE FROM playlist_likes WHERE playlist_id = ? AND user_id = ?`,
      [playlistId, userId]
    );
  }

  static async save(playlistId, userId) {
    await db.query(
      `INSERT IGNORE INTO playlist_saves (playlist_id, user_id) VALUES (?, ?)`,
      [playlistId, userId]
    );
  }

  static async unsave(playlistId, userId) {
    await db.query(
      `DELETE FROM playlist_saves WHERE playlist_id = ? AND user_id = ?`,
      [playlistId, userId]
    );
  }

  static async addComment(playlistId, userId, body) {
    const cleanBody = (body || "").trim();
    if (!cleanBody) return;

    await db.query(
      `INSERT INTO playlist_comments (playlist_id, user_id, body) VALUES (?, ?, ?)`,
      [playlistId, userId, cleanBody]
    );
  }

  // adding songs to the playlist!
  static async addSong(playlistId, title, artist, album, genre, duration_secs, spotify_url) {
    const sql = `INSERT INTO songs (playlist_id, title, artist, album, genre, duration_secs, spotify_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [
        playlistId,
        title,
        artist || null,
        album || null,
        genre || null,
        duration_secs || null,
        spotify_url || null
    ]);
}
  
  static async rate(playlistId, userId, score) {
    await db.query(
      `
      INSERT INTO playlist_ratings (playlist_id, user_id, score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        updated_at = CURRENT_TIMESTAMP
      `,
      [playlistId, userId, score]
    );
  }

  static async report(playlistId, userId, reason) {
    await db.query(
      `
      INSERT INTO playlist_reports (playlist_id, user_id, reason)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        reason = VALUES(reason),
        created_at = CURRENT_TIMESTAMP
      `,
      [playlistId, userId, reason || "Reported from playlist detail page"]
    );
  }

  static async getAll() {
    return await db.query("SELECT * FROM playlist");
  }
}

module.exports = Playlist;