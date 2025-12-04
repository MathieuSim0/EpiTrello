import db from '../database.js';

export const labelModel = {
  // Get all labels for a board
  findByBoardId(boardId) {
    const stmt = db.prepare(`
      SELECT * FROM labels 
      WHERE board_id = ? 
      ORDER BY title ASC
    `);
    return stmt.all(boardId);
  },

  // Get a specific label by id
  findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM labels 
      WHERE id = ?
    `);
    return stmt.get(id);
  },

  // Get all labels for a specific card
  findByCardId(cardId) {
    const stmt = db.prepare(`
      SELECT l.* FROM labels l
      INNER JOIN card_labels cl ON l.id = cl.label_id
      WHERE cl.card_id = ?
      ORDER BY l.title ASC
    `);
    return stmt.all(cardId);
  },

  // Create a new label
  create(title, color, boardId) {
    const stmt = db.prepare(`
      INSERT INTO labels (title, color, board_id) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(title, color, boardId);
    return this.findById(result.lastInsertRowid);
  },

  // Update a label
  update(id, data) {
    const updates = [];
    const values = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.color !== undefined) {
      updates.push('color = ?');
      values.push(data.color);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const stmt = db.prepare(`
      UPDATE labels 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    stmt.run(...values);

    return this.findById(id);
  },

  // Delete a label
  delete(id) {
    const stmt = db.prepare('DELETE FROM labels WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Add a label to a card
  addToCard(cardId, labelId) {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO card_labels (card_id, label_id) 
      VALUES (?, ?)
    `);
    stmt.run(cardId, labelId);
    return true;
  },

  // Remove a label from a card
  removeFromCard(cardId, labelId) {
    const stmt = db.prepare(`
      DELETE FROM card_labels 
      WHERE card_id = ? AND label_id = ?
    `);
    const result = stmt.run(cardId, labelId);
    return result.changes > 0;
  },

  // Get all cards that have a specific label
  getCardsByLabelId(labelId) {
    const stmt = db.prepare(`
      SELECT c.* FROM cards c
      INNER JOIN card_labels cl ON c.id = cl.card_id
      WHERE cl.label_id = ?
      ORDER BY c.position ASC
    `);
    return stmt.all(labelId);
  }
};
