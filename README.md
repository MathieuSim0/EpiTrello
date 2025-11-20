# EpiTrello

Application web de gestion de projet inspirée de Trello et de la méthode Kanban.

## 📋 Description

EpiTrello permet aux utilisateurs de :
- Créer des tableaux (boards) pour organiser leurs projets
- Ajouter des listes représentant les étapes de progression
- Créer des cartes (tasks) représentant les tâches à accomplir
- Déplacer les cartes par glisser-déposer entre les listes
- Gérer plusieurs utilisateurs avec une authentification simple

## 🚀 Technologies

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- REST API

### Frontend
- React
- Vite
- TailwindCSS
- React DnD
- Axios

## 📦 Installation et Démarrage

### Méthode 1 : Script automatique (Recommandé)

**Windows :**
```bash
start.bat
```

**Linux/Mac :**
```bash
chmod +x start.sh
./start.sh
```

### Méthode 2 : Manuel

**Installation :**
```bash
# Installer toutes les dépendances
npm run install:all
```

**Terminal 1 - Backend :**
```bash
cd backend
npm install
npm start
```
Le serveur API démarre sur `http://localhost:3001`

**Terminal 2 - Frontend :**
```bash
cd frontend
npm install
npm run dev
```
L'application démarre sur `http://localhost:5173`

### 🌱 Données de démonstration (optionnel)

Pour créer un tableau avec des exemples de listes et cartes :
```bash
cd backend
npm run seed
```

## 🗂️ Structure du projet

```
EpiTrello/
├── backend/
│   ├── models/           # Modèles de données
│   ├── routes/           # Routes API
│   ├── database.js       # Configuration SQLite
│   └── server.js         # Serveur Express
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── services/     # Services API
│   │   └── App.jsx       # Composant principal
│   └── ...
└── README.md
```

## 🎯 Fonctionnalités

- ✅ CRUD complet pour boards, lists et cards
- ✅ Drag & Drop fonctionnel
- ✅ Synchronisation temps réel frontend/backend
- ✅ Interface responsive et intuitive
- ✅ Gestion des utilisateurs (mock)
- ✅ Base de données SQLite

## 🔌 API Endpoints

### Boards
- `GET /api/boards` - Liste des tableaux
- `GET /api/boards/:id` - Détails d'un tableau
- `POST /api/boards` - Créer un tableau
- `PUT /api/boards/:id` - Modifier un tableau
- `DELETE /api/boards/:id` - Supprimer un tableau

### Lists
- `GET /api/lists/board/:boardId` - Listes d'un tableau
- `POST /api/lists` - Créer une liste
- `PUT /api/lists/:id` - Modifier une liste
- `DELETE /api/lists/:id` - Supprimer une liste

### Cards
- `GET /api/cards/list/:listId` - Cartes d'une liste
- `POST /api/cards` - Créer une carte
- `PUT /api/cards/:id` - Modifier une carte
- `PATCH /api/cards/:id/move` - Déplacer une carte
- `DELETE /api/cards/:id` - Supprimer une carte

## 🎨 Aperçu

L'application offre :
- Une page d'accueil listant tous les tableaux
- Une vue détaillée de chaque tableau avec ses listes et cartes
- Un système de drag & drop intuitif
- Des modales pour éditer les cartes
- Une interface moderne avec TailwindCSS

## 👨‍💻 Développement

Ce projet a été développé comme MVP en 8 jours avec les objectifs suivants :
- Architecture backend unifiée et évolutive
- Interface utilisateur fluide et réactive
- Fonctionnalités Kanban essentielles
- Code propre et maintenable

## 📝 Licence

MIT
