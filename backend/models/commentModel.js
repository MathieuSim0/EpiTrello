import db from '../database.js';

export const commentModel = {
  // Get all comments for a card
  findByCardId(cardId) {
    const stmt = db.prepare(`
      SELECT * FROM comments 
      WHERE card_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(cardId);
  },

  // Get a specific comment by id
  findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM comments 
      WHERE id = ?
    `);
    return stmt.get(id);
  },

  // Create a new comment
  create(content, cardId, author = 'Utilisateur') {
    const stmt = db.prepare(`
      INSERT INTO comments (content, card_id, author) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(content, cardId, author);
    return this.findById(result.lastInsertRowid);
  },

  // Update a comment
  update(id, content) {
    const stmt = db.prepare(`
      UPDATE comments 
      SET content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(content, id);
    return this.findById(id);
  },

  // Delete a comment
  delete(id) {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Count comments for a card
  countByCardId(cardId) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM comments 
      WHERE card_id = ?
    `);
    return stmt.get(cardId).count;
  }
};
