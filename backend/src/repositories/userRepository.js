const db = require('../config/db');

class UserRepository {
  async findByUsername(username) {
    const sql = `
      SELECT id, username, password, created_at
      FROM memo_stack_users
      WHERE username = $1
    `;
    const result = await db.execute(sql, [username]);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return {
        id: row.ID || row.id,
        username: row.USERNAME || row.username,
        password: row.PASSWORD || row.password,
        createdAt: row.CREATED_AT || row.created_at
      };
    }
    return null;
  }

  async create(username, hashedPassword, connection = null) {
    const sql = `
      INSERT INTO memo_stack_users (username, password)
      VALUES ($1, $2)
      RETURNING id
    `;
    
    const params = [username, hashedPassword];

    let result;
    if (connection) {
      result = await connection.execute(sql, params);
    } else {
      result = await db.execute(sql, params);
    }

    const row = result.rows[0];
    const newId = row.ID || row.id;
    return newId;
  }

  async count() {
    const sql = `SELECT COUNT(*) AS cnt FROM memo_stack_users`;
    const result = await db.execute(sql);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      const countVal = row.CNT || row.cnt || row.count || 0;
      return Number(countVal);
    }
    return 0;
  }
}

module.exports = new UserRepository();
