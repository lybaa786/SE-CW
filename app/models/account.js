const db = require("../services/db");

class Account {
  static async create(username, email, passwordHash) {
    const sql = `
      INSERT INTO Account (Username, Email, PasswordHash)
      VALUES (?, ?, ?)
    `;
    return await db.query(sql, [username, email, passwordHash]);
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM Account WHERE Email = ?`;
    const rows = await db.query(sql, [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const sql = `SELECT * FROM Account WHERE Username = ?`;
    const rows = await db.query(sql, [username]);
    return rows[0];
  }
}

module.exports = Account;