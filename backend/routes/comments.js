import express from 'express';
import { commentModel } from '../models/commentModel.js';

const router = express.Router();

// Get all comments for a card
router.get('/card/:cardId', (req, res) => {
  try {
    const { cardId } = req.params;
    const comments = commentModel.findByCardId(cardId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get comment count for a card
router.get('/card/:cardId/count', (req, res) => {
  try {
    const { cardId } = req.params;
    const count = commentModel.countByCardId(cardId);
    res.json({ count });
  } catch (error) {
    console.error('Error counting comments:', error);
    res.status(500).json({ error: 'Failed to count comments' });
  }
});

// Create a new comment
router.post('/', (req, res) => {
  try {
    const { content, card_id, author } = req.body;
    
    if (!content || !card_id) {
      return res.status(400).json({ error: 'Content and card_id are required' });
    }

    const comment = commentModel.create(content, card_id, author || 'Utilisateur');
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update a comment
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = commentModel.update(id, content);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = commentModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
