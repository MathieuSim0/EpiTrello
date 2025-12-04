import express from 'express';
import { labelModel } from '../models/labelModel.js';

const router = express.Router();

// Get all labels for a board
router.get('/board/:boardId', (req, res) => {
  try {
    const { boardId } = req.params;
    const labels = labelModel.findByBoardId(boardId);
    res.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Get labels for a specific card
router.get('/card/:cardId', (req, res) => {
  try {
    const { cardId } = req.params;
    const labels = labelModel.findByCardId(cardId);
    res.json(labels);
  } catch (error) {
    console.error('Error fetching card labels:', error);
    res.status(500).json({ error: 'Failed to fetch card labels' });
  }
});

// Create a new label
router.post('/', (req, res) => {
  try {
    const { title, color, board_id } = req.body;
    
    if (!title || !color || !board_id) {
      return res.status(400).json({ error: 'Title, color, and board_id are required' });
    }

    const label = labelModel.create(title, color, board_id);
    res.status(201).json(label);
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// Update a label
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, color } = req.body;

    const label = labelModel.update(id, { title, color });
    
    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }

    res.json(label);
  } catch (error) {
    console.error('Error updating label:', error);
    res.status(500).json({ error: 'Failed to update label' });
  }
});

// Delete a label
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = labelModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Label not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting label:', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

// Add a label to a card
router.post('/card/:cardId/label/:labelId', (req, res) => {
  try {
    const { cardId, labelId } = req.params;
    labelModel.addToCard(cardId, labelId);
    res.status(200).json({ message: 'Label added to card' });
  } catch (error) {
    console.error('Error adding label to card:', error);
    res.status(500).json({ error: 'Failed to add label to card' });
  }
});

// Remove a label from a card
router.delete('/card/:cardId/label/:labelId', (req, res) => {
  try {
    const { cardId, labelId } = req.params;
    const success = labelModel.removeFromCard(cardId, labelId);
    
    if (!success) {
      return res.status(404).json({ error: 'Label assignment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error removing label from card:', error);
    res.status(500).json({ error: 'Failed to remove label from card' });
  }
});

export default router;
