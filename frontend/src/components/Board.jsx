import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { boardsAPI, listsAPI, cardsAPI } from '../services/api';
import List from './List';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Board = ({ boardId }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-100 animate-fade-in">
        <header className="bg-white border-b border-gray-200 p-6 shadow-sm pt-20">
          <div className="max-w-full mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-gray-600 mt-2">
                {board.description}
              </p>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full">
            {board.lists?.map((list) => (
              <List
                key={list.id}
                list={list}
                onUpdateList={handleUpdateList}
                onDeleteList={handleDeleteList}
                onCreateCard={handleCreateCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onMoveCard={handleMoveCard}
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
