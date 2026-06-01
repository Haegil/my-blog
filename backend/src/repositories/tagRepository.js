const db = require('../config/db');

class TagRepository {
  async findByName(name) {
    const sql = `SELECT id, name FROM tags WHERE name = $1`;
    const result = await db.execute(sql, [name]);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return { 
        id: row.ID || row.id, 
        name: row.NAME || row.name 
      };
    }
    return null;
  }

  async create(name, connection = null) {
    const sql = `
      INSERT INTO tags (name)
      VALUES ($1)
      RETURNING id
    `;
    const params = [name];

    let result;
    if (connection) {
      result = await connection.execute(sql, params);
    } else {
      result = await db.execute(sql, params);
    }
    
    const row = result.rows[0];
    return row.ID || row.id;
  }

  async findByPostId(postId) {
    const sql = `
      SELECT t.id, t.name
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = $1
      ORDER BY t.name ASC
    `;
    const result = await db.execute(sql, [postId]);
    return result.rows.map(row => ({
      id: row.ID || row.id,
      name: row.NAME || row.name
    }));
  }

  async findAllWithCount() {
    const sql = `
      SELECT t.id, t.name, COUNT(pt.post_id) AS cnt
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id, t.name
      ORDER BY cnt DESC, t.name ASC
    `;
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      id: row.ID || row.id,
      name: row.NAME || row.name,
      count: Number(row.CNT || row.cnt || row.count || 0)
    }));
  }

  async deleteOrphanTags(connection = null) {
    const sql = `
      DELETE FROM tags
      WHERE id NOT IN (SELECT DISTINCT tag_id FROM post_tags)
    `;
    if (connection) {
      await connection.execute(sql);
    } else {
      await db.execute(sql);
    }
  }
}

module.exports = new TagRepository();
