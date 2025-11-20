import express from 'express';
import { cardModel } from '../models/cardModel.js';

const router = express.Router();

// Get all cards for a list
router.get('/list/:listId', (req, res) => {
  try {
    const cards = cardModel.findByListId(req.params.listId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific card
router.get('/:id', (req, res) => {
  try {
    const card = cardModel.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new card
router.post('/', (req, res) => {
  try {
    const { title, description, list_id } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!list_id) {
      return res.status(400).json({ error: 'List ID is required' });
    }
    
    const card = cardModel.create(title, description, list_id);
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a card
router.put('/:id', (req, res) => {
  try {
    const card = cardModel.update(req.params.id, req.body);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move a card (drag & drop)
router.patch('/:id/move', (req, res) => {
  try {
    const { list_id, position } = req.body;
    
    if (list_id === undefined || position === undefined) {
      return res.status(400).json({ error: 'List ID and position are required' });
    }
    
    const card = cardModel.move(req.params.id, list_id, position);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a card
router.delete('/:id', (req, res) => {
  try {
    const deleted = cardModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
