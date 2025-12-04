import db from '../database.js';
import { cardModel } from './cardModel.js';

export const boardModel = {
  // Get all boards for a user
  findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM boards 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  },

  // Get a specific board by id
  findById(id, userId) {
    const stmt = db.prepare(`
      SELECT * FROM boards 
      WHERE id = ? AND user_id = ?
    `);
    return stmt.get(id, userId);
  },

  // Create a new board
  create(title, description, userId) {
    const stmt = db.prepare(`
      INSERT INTO boards (title, description, user_id) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(title, description || null, userId);
    return this.findById(result.lastInsertRowid, userId);
  },

  // Update a board
  update(id, title, description, userId) {
    const stmt = db.prepare(`
      UPDATE boards 
      SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `);
    stmt.run(title, description || null, id, userId);
    return this.findById(id, userId);
  },

  // Delete a board
  delete(id, userId) {
    const stmt = db.prepare(`
      DELETE FROM boards 
      WHERE id = ? AND user_id = ?
    `);
    const result = stmt.run(id, userId);
    return result.changes > 0;
  },

  // Get board with all its lists and cards
  findByIdWithDetails(id, userId) {
    const board = this.findById(id, userId);
    if (!board) return null;

    // Get all lists for this board
    const listsStmt = db.prepare(`
      SELECT * FROM lists 
      WHERE board_id = ? 
      ORDER BY position ASC
    `);
    const lists = listsStmt.all(id);

    // Get all cards for each list with their labels
    lists.forEach(list => {
      list.cards = cardModel.findByListId(list.id);
    });

    board.lists = lists;
    return board;
  }
};
