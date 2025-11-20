import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Boards API
export const boardsAPI = {
  getAll: () => api.get('/boards'),
  getById: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
};

// Lists API
export const listsAPI = {
  getByBoardId: (boardId) => api.get(`/lists/board/${boardId}`),
  getById: (id) => api.get(`/lists/${id}`),
  create: (data) => api.post('/lists', data),
  update: (id, data) => api.put(`/lists/${id}`, data),
  delete: (id) => api.delete(`/lists/${id}`),
};

// Cards API
export const cardsAPI = {
  getByListId: (listId) => api.get(`/cards/list/${listId}`),
  getById: (id) => api.get(`/cards/${id}`),
  create: (data) => api.post('/cards', data),
  update: (id, data) => api.put(`/cards/${id}`, data),
  move: (id, data) => api.patch(`/cards/${id}/move`, data),
  delete: (id) => api.delete(`/cards/${id}`),
};

export default api;
