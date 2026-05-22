const db = require('../config/db');
const oracledb = require('oracledb');

class PostRepository {
  async findById(id) {
    const sql = `
      SELECT id, title, content, created_at, updated_at
      FROM posts
      WHERE id = :id
    `;
    const result = await db.execute(sql, { id });
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return {
        id: row.ID || row.id,
        title: row.TITLE || row.title,
        content: row.CONTENT || row.content,
        createdAt: row.CREATED_AT || row.created_at,
        updatedAt: row.UPDATED_AT || row.updated_at
      };
    }
    return null;
  }

  async create(title, content, connection = null) {
    const sql = `
      INSERT INTO posts (title, content, created_at, updated_at)
      VALUES (:title, :content, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id INTO :id
    `;
    const binds = {
      title,
      content,
      id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    };

    let result;
    if (connection) {
      result = await connection.execute(sql, binds);
    } else {
      result = await db.execute(sql, binds, { autoCommit: true });
    }
    return result.outBinds.id[0];
  }

  async update(id, title, content, connection = null) {
    const sql = `
      UPDATE posts
      SET title = :title, content = :content, updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
    `;
    const binds = { id, title, content };

    if (connection) {
      await connection.execute(sql, binds);
    } else {
      await db.execute(sql, binds, { autoCommit: true });
    }
  }

  async delete(id, connection = null) {
    const sql = `DELETE FROM posts WHERE id = :id`;
    if (connection) {
      await connection.execute(sql, { id });
    } else {
      await db.execute(sql, { id }, { autoCommit: true });
    }
  }

  async findAll(searchQuery = null, tagName = null, page = null, limit = null) {
    let sql = `
      SELECT p.id, p.title, p.content, p.created_at, p.updated_at
      FROM posts p
    `;
    const binds = {};
    const whereClauses = [];

    if (tagName) {
      whereClauses.push(`EXISTS (
        SELECT 1 
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = p.id AND t.name = :tagName
      )`);
      binds.tagName = tagName;
    }

    if (searchQuery) {
      whereClauses.push(`(LOWER(p.title) LIKE :query OR LOWER(p.content) LIKE :query)`);
      binds.query = `%${searchQuery.toLowerCase()}%`;
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` ORDER BY p.created_at DESC`;

    if (page !== null && limit !== null) {
      const offset = (page - 1) * limit;
      sql += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
      binds.offset = offset;
      binds.limit = limit;
    }

    const result = await db.execute(sql, binds);
    return result.rows.map(row => ({
      id: row.ID || row.id,
      title: row.TITLE || row.title,
      content: row.CONTENT || row.content,
      createdAt: row.CREATED_AT || row.created_at,
      updatedAt: row.UPDATED_AT || row.updated_at
    }));
  }

  async countAll(searchQuery = null, tagName = null) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM posts p
    `;
    const binds = {};
    const whereClauses = [];

    if (tagName) {
      whereClauses.push(`EXISTS (
        SELECT 1 
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = p.id AND t.name = :tagName
      )`);
      binds.tagName = tagName;
    }

    if (searchQuery) {
      whereClauses.push(`(LOWER(p.title) LIKE :query OR LOWER(p.content) LIKE :query)`);
      binds.query = `%${searchQuery.toLowerCase()}%`;
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    const result = await db.execute(sql, binds);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return row.TOTAL || row.total || 0;
    }
    return 0;
  }

  async addTag(postId, tagId, connection = null) {
    const sql = `
      INSERT INTO post_tags (post_id, tag_id)
      VALUES (:postId, :tagId)
    `;
    const binds = { postId, tagId };
    if (connection) {
      await connection.execute(sql, binds);
    } else {
      await db.execute(sql, binds, { autoCommit: true });
    }
  }

  async clearTags(postId, connection = null) {
    const sql = `DELETE FROM post_tags WHERE post_id = :postId`;
    if (connection) {
      await connection.execute(sql, { postId });
    } else {
      await db.execute(sql, { postId }, { autoCommit: true });
    }
  }
}

module.exports = new PostRepository();
