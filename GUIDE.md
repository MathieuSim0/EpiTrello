# Guide de démarrage - EpiTrello

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
# Installer toutes les dépendances
npm run install:all

# OU installer séparément
npm run install:backend
npm run install:frontend
```

### 2. Démarrer l'application

**Terminal 1 - Backend :**
```bash
npm run start:backend
# OU
cd backend && npm start
```

Le serveur API démarre sur `http://localhost:3001`

**Terminal 2 - Frontend :**
```bash
npm run start:frontend
# OU
cd frontend && npm run dev
```

L'application démarre sur `http://localhost:5173`

### 3. Utiliser l'application

1. Ouvrez votre navigateur à `http://localhost:5173`
2. Créez votre premier tableau en cliquant sur le bouton "+"
3. Ajoutez des listes (colonnes) à votre tableau
4. Ajoutez des cartes (tâches) dans vos listes
5. Déplacez les cartes par glisser-déposer entre les listes

## ✅ Fonctionnalités implémentées

### Backend (API REST)
- ✅ Architecture unifiée avec Express.js et SQLite
- ✅ CRUD complet pour les boards (tableaux)
- ✅ CRUD complet pour les lists (listes/colonnes)
- ✅ CRUD complet pour les cards (cartes/tâches)
- ✅ Endpoint spécial pour le déplacement des cartes (drag & drop)
- ✅ Gestion des positions pour l'ordre des listes et cartes
- ✅ Relations en cascade (suppression d'un board supprime ses listes et cartes)
- ✅ Gestion basique des utilisateurs (mock)

### Frontend (React + Vite)
- ✅ Interface moderne avec TailwindCSS
- ✅ Page d'accueil listant tous les tableaux
- ✅ Création/modification/suppression de tableaux
- ✅ Vue détaillée d'un tableau avec toutes ses listes
- ✅ Création/modification/suppression de listes
- ✅ Création/modification/suppression de cartes
- ✅ Drag & Drop fonctionnel avec React DnD
- ✅ Navigation fluide entre les vues
- ✅ Interface responsive
- ✅ Édition inline des titres
- ✅ Confirmations avant suppression

### Intégration
- ✅ Communication frontend/backend via Axios
- ✅ Synchronisation en temps réel
- ✅ Gestion des erreurs
- ✅ Loading states

## 📋 Prochaines étapes possibles

### Améliorations suggérées
1. **Authentification réelle**
   - Remplacer le système mock par JWT
   - Page de connexion/inscription
   - Gestion de sessions

2. **Fonctionnalités avancées**
   - Drag & drop des listes (réorganiser les colonnes)
   - Labels/tags colorés pour les cartes
   - Dates d'échéance
   - Assignation de membres aux cartes
   - Commentaires sur les cartes
   - Pièces jointes

3. **Collaboration**
   - Partage de tableaux entre utilisateurs
   - Permissions (propriétaire, éditeur, lecteur)
   - Notifications

4. **UI/UX**
   - Mode sombre
   - Personnalisation des couleurs de fond
   - Images de couverture pour les tableaux
   - Raccourcis clavier
   - Recherche globale

5. **Performance**
   - Optimistic updates (mise à jour optimiste)
   - Pagination pour les gros tableaux
   - Cache côté client
   - WebSockets pour les updates en temps réel

6. **Déploiement**
   - Configuration pour production
   - Docker containerization
   - CI/CD pipeline
   - Hébergement (Vercel, Netlify, etc.)

## 🧪 Tests API avec curl

```bash
# Santé de l'API
curl http://localhost:3001/api/health

# Créer un tableau
curl -X POST http://localhost:3001/api/boards \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mon tableau","description":"Description"}'

# Lister les tableaux
curl http://localhost:3001/api/boards

# Créer une liste
curl -X POST http://localhost:3001/api/lists \
  -H 'Content-Type: application/json' \
  -d '{"title":"À faire","board_id":1}'

# Créer une carte
curl -X POST http://localhost:3001/api/cards \
  -H 'Content-Type: application/json' \
  -d '{"title":"Ma tâche","description":"Description détaillée","list_id":1}'

# Déplacer une carte
curl -X PATCH http://localhost:3001/api/cards/1/move \
  -H 'Content-Type: application/json' \
  -d '{"list_id":2,"position":0}'
```

## 🗂️ Structure de la base de données

### Table: users
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- created_at

### Table: boards
- id (PRIMARY KEY)
- title
- description
- user_id (FOREIGN KEY → users)
- created_at
- updated_at

### Table: lists
- id (PRIMARY KEY)
- title
- board_id (FOREIGN KEY → boards)
- position
- created_at
- updated_at

### Table: cards
- id (PRIMARY KEY)
- title
- description
- list_id (FOREIGN KEY → lists)
- position
- created_at
- updated_at

## 🛠️ Technologies utilisées

**Backend:**
- Node.js v20+
- Express.js 4.18
- better-sqlite3 9.2
- CORS

**Frontend:**
- React 18
- Vite 7
- TailwindCSS 4
- React DnD (HTML5 Backend)
- Axios

## 📝 Notes importantes

- La base de données SQLite est créée automatiquement au démarrage du backend
- Un utilisateur "demo" est créé par défaut (ID: 1)
- Les foreign keys sont activées pour maintenir l'intégrité des données
- Le drag & drop gère automatiquement les positions des cartes
- Tous les endpoints retournent du JSON

## 🐛 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez que le port 3001 est disponible
- Assurez-vous que les dépendances sont installées (`npm install`)

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend est démarré
- Vérifiez le fichier `.env` dans frontend
- Vérifiez que l'URL API est correcte

### Le drag & drop ne fonctionne pas
- Vérifiez que React DnD est bien installé
- Essayez de rafraîchir la page
- Vérifiez la console pour les erreurs

## 📄 Licence

MIT
