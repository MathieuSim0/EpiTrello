import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'epitrello.db'));

console.log('🌱 Création des données de démonstration...\n');

// Créer un tableau de démonstration
const board = db.prepare(`
  INSERT INTO boards (title, description, user_id) 
  VALUES (?, ?, ?)
`).run('Projet EpiTrello', 'Tableau de démonstration avec des exemples de tâches', 1);

console.log(`✅ Tableau créé: "Projet EpiTrello" (ID: ${board.lastInsertRowid})`);

// Créer les listes
const lists = [
  { title: '📋 À faire', position: 0 },
  { title: '🔄 En cours', position: 1 },
  { title: '✅ Terminé', position: 2 },
];

const listIds = [];
lists.forEach(list => {
  const result = db.prepare(`
    INSERT INTO lists (title, board_id, position) 
    VALUES (?, ?, ?)
  `).run(list.title, board.lastInsertRowid, list.position);
  listIds.push(result.lastInsertRowid);
  console.log(`✅ Liste créée: "${list.title}" (ID: ${result.lastInsertRowid})`);
});

// Créer des cartes de démonstration
const cards = [
  // À faire
  { 
    title: 'Ajouter l\'authentification JWT', 
    description: 'Implémenter un système d\'authentification sécurisé avec JWT',
    list_index: 0,
    position: 0
  },
  { 
    title: 'Créer les tests unitaires', 
    description: 'Écrire des tests pour les modèles et les routes',
    list_index: 0,
    position: 1
  },
  { 
    title: 'Ajouter les labels colorés', 
    description: 'Permettre d\'ajouter des labels aux cartes pour les catégoriser',
    list_index: 0,
    position: 2
  },
  // En cours
  { 
    title: 'Documentation API', 
    description: 'Documenter tous les endpoints avec Swagger',
    list_index: 1,
    position: 0
  },
  { 
    title: 'Optimiser les performances', 
    description: 'Ajouter du caching et optimiser les requêtes',
    list_index: 1,
    position: 1
  },
  // Terminé
  { 
    title: 'Configuration du projet', 
    description: 'Initialisation de la structure frontend et backend',
    list_index: 2,
    position: 0
  },
  { 
    title: 'API REST complète', 
    description: 'Tous les endpoints CRUD pour boards, lists et cards',
    list_index: 2,
    position: 1
  },
  { 
    title: 'Interface utilisateur', 
    description: 'Composants React avec TailwindCSS',
    list_index: 2,
    position: 2
  },
  { 
    title: 'Drag & Drop', 
    description: 'Implémentation du glisser-déposer avec React DnD',
    list_index: 2,
    position: 3
  },
];

const cardIds = [];
cards.forEach(card => {
  const result = db.prepare(`
    INSERT INTO cards (title, description, list_id, position) 
    VALUES (?, ?, ?, ?)
  `).run(card.title, card.description, listIds[card.list_index], card.position);
  cardIds.push(result.lastInsertRowid);
  console.log(`✅ Carte créée: "${card.title}"`);
});

// Créer des labels de démonstration
const labels = [
  { title: 'Urgent', color: '#EF4444', board_id: board.lastInsertRowid },
  { title: 'Bug', color: '#DC2626', board_id: board.lastInsertRowid },
  { title: 'Feature', color: '#3B82F6', board_id: board.lastInsertRowid },
  { title: 'Design', color: '#A855F7', board_id: board.lastInsertRowid },
  { title: 'Backend', color: '#10B981', board_id: board.lastInsertRowid },
  { title: 'Frontend', color: '#06B6D4', board_id: board.lastInsertRowid },
  { title: 'Documentation', color: '#F59E0B', board_id: board.lastInsertRowid },
];

const labelIds = [];
labels.forEach(label => {
  const result = db.prepare(`
    INSERT INTO labels (title, color, board_id) 
    VALUES (?, ?, ?)
  `).run(label.title, label.color, label.board_id);
  labelIds.push(result.lastInsertRowid);
  console.log(`✅ Label créé: "${label.title}" (${label.color})`);
});

// Associer des labels aux cartes
const cardLabelAssociations = [
  { card_index: 0, label_indices: [0, 2, 4] }, // Auth JWT: Urgent, Feature, Backend
  { card_index: 1, label_indices: [2, 4] }, // Tests: Feature, Backend
  { card_index: 2, label_indices: [2, 5] }, // Labels: Feature, Frontend
  { card_index: 3, label_indices: [6] }, // Doc API: Documentation
  { card_index: 4, label_indices: [2, 4] }, // Perf: Feature, Backend
  { card_index: 5, label_indices: [] }, // Config: rien
  { card_index: 6, label_indices: [2, 4] }, // API REST: Feature, Backend
  { card_index: 7, label_indices: [3, 5] }, // UI: Design, Frontend
  { card_index: 8, label_indices: [2, 5] }, // Drag&Drop: Feature, Frontend
];

cardLabelAssociations.forEach(assoc => {
  assoc.label_indices.forEach(labelIndex => {
    db.prepare(`
      INSERT INTO card_labels (card_id, label_id) 
      VALUES (?, ?)
    `).run(cardIds[assoc.card_index], labelIds[labelIndex]);
  });
});

console.log('\n🎉 Données de démonstration créées avec succès !');
console.log('\n📊 Résumé:');
console.log(`   - 1 tableau`);
console.log(`   - ${lists.length} listes`);
console.log(`   - ${cards.length} cartes`);
console.log(`   - ${labels.length} labels`);
console.log('\n💡 Démarrez l\'application pour voir le résultat !');

db.close();
