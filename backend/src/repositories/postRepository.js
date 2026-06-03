const db = require('../config/db');

class PostRepository {
  async findById(id) {
    const sql = `
      SELECT id, title, content, created_at, updated_at
      FROM posts
      WHERE id = $1
    `;
    const result = await db.execute(sql, [id]);
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
      VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `;
    const params = [title, content];

    let result;
    if (connection) {
      result = await connection.execute(sql, params);
    } else {
      result = await db.execute(sql, params);
    }
    
    const row = result.rows[0];
    return row.ID || row.id;
  }

  async update(id, title, content, connection = null) {
    const sql = `
      UPDATE posts
      SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `;
    const params = [title, content, id];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await db.execute(sql, params);
    }
  }

  async delete(id, connection = null) {
    const sql = `DELETE FROM posts WHERE id = $1`;
    const params = [id];
    
    if (connection) {
      await connection.execute(sql, params);
    } else {
      await db.execute(sql, params);
    }
  }

  applyFilters(whereClauses, params, startIndex, searchQuery = null, tagName = null, dateRange = {}) {
    let paramIndex = startIndex;

    if (tagName) {
      whereClauses.push(`EXISTS (
        SELECT 1 
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = p.id AND t.name = $${paramIndex++}
      )`);
      params.push(tagName);
    }

    if (searchQuery) {
      whereClauses.push(`(LOWER(p.title) LIKE $${paramIndex} OR LOWER(p.content) LIKE $${paramIndex})`);
      paramIndex++;
      params.push(`%${searchQuery.toLowerCase()}%`);
    }

    if (dateRange.from) {
      whereClauses.push(`p.created_at >= $${paramIndex++}::date`);
      params.push(dateRange.from);
    }

    if (dateRange.to) {
      whereClauses.push(`p.created_at < ($${paramIndex++}::date + INTERVAL '1 day')`);
      params.push(dateRange.to);
    }

    return paramIndex;
  }

  async findAll(searchQuery = null, tagName = null, page = null, limit = null, dateRange = {}) {
    let sql = `
      SELECT p.id, p.title, p.content, p.created_at, p.updated_at
      FROM posts p
    `;
    const params = [];
    const whereClauses = [];
    let paramIndex = this.applyFilters(whereClauses, params, 1, searchQuery, tagName, dateRange);

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` ORDER BY p.created_at DESC`;

    if (page !== null && limit !== null) {
      const offset = (page - 1) * limit;
      sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(limit, offset);
    }

    const result = await db.execute(sql, params);
    return result.rows.map(row => ({
      id: row.ID || row.id,
      title: row.TITLE || row.title,
      content: row.CONTENT || row.content,
      createdAt: row.CREATED_AT || row.created_at,
      updatedAt: row.UPDATED_AT || row.updated_at
    }));
  }

  async countAll(searchQuery = null, tagName = null, dateRange = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM posts p
    `;
    const params = [];
    const whereClauses = [];
    this.applyFilters(whereClauses, params, 1, searchQuery, tagName, dateRange);

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    const result = await db.execute(sql, params);
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      const countVal = row.TOTAL || row.total || row.count || 0;
      return Number(countVal);
    }
    return 0;
  }

  async addTag(postId, tagId, connection = null) {
    const sql = `
      INSERT INTO post_tags (post_id, tag_id)
      VALUES ($1, $2)
    `;
    const params = [postId, tagId];
    
    if (connection) {
      await connection.execute(sql, params);
    } else {
      await db.execute(sql, params);
    }
  }

  async clearTags(postId, connection = null) {
    const sql = `DELETE FROM post_tags WHERE post_id = $1`;
    const params = [postId];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await db.execute(sql, params);
    }
  }
}

module.exports = new PostRepository();
