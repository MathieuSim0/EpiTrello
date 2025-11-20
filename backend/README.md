# EpiTrello Backend

Backend API pour l'application EpiTrello (gestion de projets type Kanban).

## Technologies

- Node.js
- Express.js
- SQLite (better-sqlite3)
- REST API

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## API Endpoints

### Boards

- `GET /api/boards` - Liste tous les tableaux de l'utilisateur
- `GET /api/boards/:id` - Récupère un tableau avec ses listes et cartes
- `POST /api/boards` - Crée un nouveau tableau
- `PUT /api/boards/:id` - Met à jour un tableau
- `DELETE /api/boards/:id` - Supprime un tableau

### Lists

- `GET /api/lists/board/:boardId` - Liste toutes les listes d'un tableau
- `GET /api/lists/:id` - Récupère une liste avec ses cartes
- `POST /api/lists` - Crée une nouvelle liste
- `PUT /api/lists/:id` - Met à jour une liste
- `DELETE /api/lists/:id` - Supprime une liste

### Cards

- `GET /api/cards/list/:listId` - Liste toutes les cartes d'une liste
- `GET /api/cards/:id` - Récupère une carte
- `POST /api/cards` - Crée une nouvelle carte
- `PUT /api/cards/:id` - Met à jour une carte
- `PATCH /api/cards/:id/move` - Déplace une carte (drag & drop)
- `DELETE /api/cards/:id` - Supprime une carte

## Structure de la base de données

### Users
- id, username, email, created_at

### Boards
- id, title, description, user_id, created_at, updated_at

### Lists
- id, title, board_id, position, created_at, updated_at

### Cards
- id, title, description, list_id, position, created_at, updated_at
