import express from 'express';
import { boardModel } from '../models/boardModel.js';

const router = express.Router();

// Get all boards for current user
router.get('/', (req, res) => {
  try {
    const userId = req.userId || 1; // Mock user id
    const boards = boardModel.findByUserId(userId);
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific board with all its lists and cards
router.get('/:id', (req, res) => {
  try {
    const userId = req.userId || 1;
    const board = boardModel.findByIdWithDetails(req.params.id, userId);
    
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new board
router.post('/', (req, res) => {
  try {
    const userId = req.userId || 1;
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const board = boardModel.create(title, description, userId);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a board
router.put('/:id', (req, res) => {
  try {
    const userId = req.userId || 1;
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const board = boardModel.update(req.params.id, title, description, userId);
    
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a board
router.delete('/:id', (req, res) => {
  try {
    const userId = req.userId || 1;
    const deleted = boardModel.delete(req.params.id, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
