import db from '../database.js';

export const cardModel = {
  // Get all cards for a list
  findByListId(listId) {
    const stmt = db.prepare(`
      SELECT * FROM cards 
      WHERE list_id = ? 
      ORDER BY position ASC
    `);
    return stmt.all(listId);
  },

  // Get a specific card by id
  findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM cards 
      WHERE id = ?
    `);
    return stmt.get(id);
  },

  // Create a new card
  create(title, description, listId) {
    // Get the maximum position for this list
    const maxPosStmt = db.prepare(`
      SELECT COALESCE(MAX(position), -1) as max_pos 
      FROM cards 
      WHERE list_id = ?
    `);
    const { max_pos } = maxPosStmt.get(listId);
    const newPosition = max_pos + 1;

    const stmt = db.prepare(`
      INSERT INTO cards (title, description, list_id, position) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(title, description || null, listId, newPosition);
    return this.findById(result.lastInsertRowid);
  },

  // Update a card
  update(id, data) {
    const updates = [];
    const values = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (data.list_id !== undefined) {
      updates.push('list_id = ?');
      values.push(data.list_id);
    }

    if (data.position !== undefined) {
      updates.push('position = ?');
      values.push(data.position);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE cards 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    stmt.run(...values);
    return this.findById(id);
  },

  // Delete a card
  delete(id) {
    const stmt = db.prepare(`
      DELETE FROM cards 
      WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Move card to a different list and/or position
  move(id, newListId, newPosition) {
    const card = this.findById(id);
    if (!card) return null;

    const oldListId = card.list_id;
    const oldPosition = card.position;

    // Start a transaction
    const transaction = db.transaction(() => {
      if (oldListId === newListId) {
        // Moving within the same list
        if (newPosition > oldPosition) {
          // Moving down: shift cards between old and new position up
          const shiftStmt = db.prepare(`
            UPDATE cards 
            SET position = position - 1 
            WHERE list_id = ? AND position > ? AND position <= ?
          `);
          shiftStmt.run(oldListId, oldPosition, newPosition);
        } else if (newPosition < oldPosition) {
          // Moving up: shift cards between new and old position down
          const shiftStmt = db.prepare(`
            UPDATE cards 
            SET position = position + 1 
            WHERE list_id = ? AND position >= ? AND position < ?
          `);
          shiftStmt.run(oldListId, newPosition, oldPosition);
        }
      } else {
        // Moving to a different list
        // Shift cards in old list
        const shiftOldStmt = db.prepare(`
          UPDATE cards 
          SET position = position - 1 
          WHERE list_id = ? AND position > ?
        `);
        shiftOldStmt.run(oldListId, oldPosition);

        // Shift cards in new list
        const shiftNewStmt = db.prepare(`
          UPDATE cards 
          SET position = position + 1 
          WHERE list_id = ? AND position >= ?
        `);
        shiftNewStmt.run(newListId, newPosition);
      }

      // Update the card itself
      const updateStmt = db.prepare(`
        UPDATE cards 
        SET list_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      updateStmt.run(newListId, newPosition, id);
    });

    transaction();
    return this.findById(id);
  }
};
