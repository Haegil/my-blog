const db = require('../config/db');
const oracledb = require('oracledb');

class UserRepository {
  async findByUsername(username) {
    const sql = `
      SELECT id, username, password, created_at
      FROM memo_stack_users
      WHERE username = :username
    `;
    const result = await db.execute(sql, { username });
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
      VALUES (:username, :password)
      RETURNING id INTO :id
    `;
    
    const binds = {
      username,
      password: hashedPassword,
      id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    };

    let result;
    if (connection) {
      result = await connection.execute(sql, binds);
    } else {
      result = await db.execute(sql, binds, { autoCommit: true });
    }

    const newId = result.outBinds.id[0];
    return newId;
  }

  async count() {
    const sql = `SELECT COUNT(*) AS cnt FROM memo_stack_users`;
    const result = await db.execute(sql);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return row.CNT || row.cnt || 0;
    }
    return 0;
  }
}

module.exports = new UserRepository();
