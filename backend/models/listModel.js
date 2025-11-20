import db from '../database.js';

export const listModel = {
  // Get all lists for a board
  findByBoardId(boardId) {
    const stmt = db.prepare(`
      SELECT * FROM lists 
      WHERE board_id = ? 
      ORDER BY position ASC
    `);
    return stmt.all(boardId);
  },

  // Get a specific list by id
  findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM lists 
      WHERE id = ?
    `);
    return stmt.get(id);
  },

  // Create a new list
  create(title, boardId) {
    // Get the maximum position for this board
    const maxPosStmt = db.prepare(`
      SELECT COALESCE(MAX(position), -1) as max_pos 
      FROM lists 
      WHERE board_id = ?
    `);
    const { max_pos } = maxPosStmt.get(boardId);
    const newPosition = max_pos + 1;

    const stmt = db.prepare(`
      INSERT INTO lists (title, board_id, position) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(title, boardId, newPosition);
    return this.findById(result.lastInsertRowid);
  },

  // Update a list
  update(id, title, position) {
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }

    if (position !== undefined) {
      updates.push('position = ?');
      values.push(position);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE lists 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    stmt.run(...values);
    return this.findById(id);
  },

  // Delete a list
  delete(id) {
    const stmt = db.prepare(`
      DELETE FROM lists 
      WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get list with all its cards
  findByIdWithCards(id) {
    const list = this.findById(id);
    if (!list) return null;

    const cardsStmt = db.prepare(`
      SELECT * FROM cards 
      WHERE list_id = ? 
      ORDER BY position ASC
    `);
    list.cards = cardsStmt.all(id);
    return list;
  }
};
