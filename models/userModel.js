const db = require("../config/db");

class User {
  static async create(userData) {
    // Safely extract properties with proper names
    const userValues = {
      username: userData.username,
      email: userData.email,
      password: userData.password, // Should be hashed before calling this
      created_at: new Date() // Explicitly set creation date
    };

    const result = await db.promiseQuery(
      `INSERT INTO users SET ?`,
      userValues
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const rows = await db.promiseQuery(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByUsername(username) {
    const rows = await db.promiseQuery(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id) {
    const rows = await db.promiseQuery(
      "SELECT id, username, email, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async update(id, updateData) {
    // Filter allowed fields to update
    const allowedFields = ['username', 'email', 'password'];
    const updateValues = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateValues[field] = updateData[field];
      }
    }

    if (Object.keys(updateValues).length === 0) {
      throw new Error("No valid fields to update");
    }

    await db.promiseQuery(
      "UPDATE users SET ? WHERE id = ?",
      [updateValues, id]
    );
  }

  static async delete(id) {
    await db.promiseQuery(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
  }
}

module.exports = User;