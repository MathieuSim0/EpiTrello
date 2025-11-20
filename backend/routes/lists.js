import express from 'express';
import { listModel } from '../models/listModel.js';
import { boardModel } from '../models/boardModel.js';

const router = express.Router();

// Get all lists for a board
router.get('/board/:boardId', (req, res) => {
  try {
    const lists = listModel.findByBoardId(req.params.boardId);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific list with its cards
router.get('/:id', (req, res) => {
  try {
    const list = listModel.findByIdWithCards(req.params.id);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new list
router.post('/', (req, res) => {
  try {
    const { title, board_id } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!board_id) {
      return res.status(400).json({ error: 'Board ID is required' });
    }
    
    const list = listModel.create(title, board_id);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a list
router.put('/:id', (req, res) => {
  try {
    const { title, position } = req.body;
    const list = listModel.update(req.params.id, title, position);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a list
router.delete('/:id', (req, res) => {
  try {
    const deleted = listModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
