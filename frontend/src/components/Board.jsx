import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { boardsAPI, listsAPI, cardsAPI } from '../services/api';
import List from './List';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import BoardSettings from './BoardSettings';

const Board = ({ boardId, onBoardDeleted }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'title', 'description', 'labels'

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      const response = await boardsAPI.getById(boardId);
      setBoard(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du tableau');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    try {
      await listsAPI.create({
        title: newListTitle,
        board_id: boardId,
      });
      setNewListTitle('');
      setIsAddingList(false);
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la création de la liste:', err);
    }
  };

  const handleUpdateList = async (listId, data) => {
    try {
      await listsAPI.update(listId, data);
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la liste:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await listsAPI.delete(listId);
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la suppression de la liste:', err);
    }
  };

  const handleCreateCard = async (listId, title) => {
    try {
      await cardsAPI.create({
        title,
        list_id: listId,
      });
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la création de la carte:', err);
    }
  };

  const handleUpdateCard = async (cardId, data) => {
    try {
      await cardsAPI.update(cardId, data);
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la carte:', err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await cardsAPI.delete(cardId);
      loadBoard();
    } catch (err) {
      console.error('Erreur lors de la suppression de la carte:', err);
    }
  };

  const handleMoveCard = async (cardId, newListId, newPosition) => {
    try {
      await cardsAPI.move(cardId, {
        list_id: newListId,
        position: newPosition,
      });
      loadBoard();
    } catch (err) {
      console.error('Erreur lors du déplacement de la carte:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <ErrorMessage message={error} onRetry={loadBoard} />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Tableau non trouvé</div>
      </div>
    );
  }

  // Fonction de filtrage des cartes
  const filterCards = (cards) => {
    if (!searchQuery.trim()) return cards;
    
    const query = searchQuery.toLowerCase().trim();
    
    return cards.filter(card => {
      const titleMatch = card.title?.toLowerCase().includes(query);
      const descriptionMatch = card.description?.toLowerCase().includes(query);
      const labelsMatch = card.labels?.some(label => 
        label.title?.toLowerCase().includes(query)
      );

      switch (searchFilter) {
        case 'title':
          return titleMatch;
        case 'description':
          return descriptionMatch;
        case 'labels':
          return labelsMatch;
        default:
          return titleMatch || descriptionMatch || labelsMatch;
      }
    });
  };

  // Appliquer le filtre aux listes
  const filteredLists = board.lists?.map(list => ({
    ...list,
    cards: filterCards(list.cards || []),
    originalCardCount: list.cards?.length || 0
  }));

  // Compter les résultats
  const totalCards = board.lists?.reduce((acc, list) => acc + (list.cards?.length || 0), 0) || 0;
  const filteredCards = filteredLists?.reduce((acc, list) => acc + list.cards.length, 0) || 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-100 animate-fade-in">
        <header className="bg-white border-b border-gray-200 p-6 shadow-sm pt-20">
          <div className="max-w-full mx-auto px-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {board.title}
                </h1>
                {board.description && (
                  <p className="text-gray-600 mt-2">
                    {board.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                <span>⚙️</span>
                <span>Paramètres</span>
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-64 max-w-md">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des cartes..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tout</option>
                <option value="title">Titre</option>
                <option value="description">Description</option>
                <option value="labels">Labels</option>
              </select>

              {searchQuery && (
                <div className="text-sm text-gray-500 animate-fade-in">
                  {filteredCards} / {totalCards} carte{totalCards > 1 ? 's' : ''}
                  {filteredCards === 0 && (
                    <span className="ml-2 text-amber-600">Aucun résultat</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {showSettings && (
          <BoardSettings
            board={board}
            onClose={() => setShowSettings(false)}
            onUpdate={loadBoard}
            onDelete={onBoardDeleted}
          />
        )}

        <main className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full">
            {filteredLists?.map((list) => (
              <List
                key={list.id}
                list={list}
                boardId={boardId}
                onUpdateList={handleUpdateList}
                onDeleteList={handleDeleteList}
                onCreateCard={handleCreateCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onMoveCard={handleMoveCard}
                isFiltered={searchQuery.trim() !== ''}
                originalCardCount={list.originalCardCount}
              />
            ))}

            <div className="w-72 flex-shrink-0">
              {isAddingList ? (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-slide-in">
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Titre de la liste..."
                    className="input mb-3 font-semibold"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateList}
                      className="btn-primary flex-1 text-sm"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListTitle('');
                      }}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-xl p-4 text-left flex items-center transition-all font-semibold shadow-sm hover:shadow-md border border-gray-200"
                >
                  <span className="text-xl mr-2">+</span> Ajouter une liste
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default Board;
