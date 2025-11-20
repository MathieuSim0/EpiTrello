import { useState, useEffect } from 'react';
import { boardsAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const BoardList = ({ onSelectBoard }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await boardsAPI.getAll();
      setBoards(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des tableaux:', err);
      setError('Impossible de charger les tableaux');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      await boardsAPI.create({
        title: newBoardTitle,
        description: newBoardDescription,
      });
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsCreating(false);
      loadBoards();
    } catch (err) {
      console.error('Erreur lors de la création du tableau:', err);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Supprimer ce tableau et tout son contenu ?')) return;

    try {
      await boardsAPI.delete(boardId);
      loadBoards();
    } catch (err) {
      console.error('Erreur lors de la suppression du tableau:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in pt-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mes Tableaux
          </h1>
          <p className="text-lg text-gray-600">
            Gérez et organisez tous vos projets
          </p>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadBoards} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board, index) => (
            <div
              key={board.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onSelectBoard(board.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                  {board.title}
                </h3>
                {board.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {board.description}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100">
                <span className="text-xs text-gray-500">Cliquez pour ouvrir</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                  className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-2 border-dashed border-gray-300 hover:border-blue-500">
            {isCreating ? (
              <div className="p-6 animate-slide-in">
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Titre du tableau..."
                  className="input mb-3 font-semibold"
                  autoFocus
                />
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Description (optionnel)..."
                  className="textarea mb-3"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateBoard}
                    className="btn-primary flex-1"
                  >
                    Créer
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewBoardTitle('');
                      setNewBoardDescription('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full h-full p-8 flex flex-col items-center justify-center min-h-[200px] text-gray-600 hover:text-blue-900 transition-colors group"
              >
                <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <span className="text-3xl group-hover:scale-110 transition-transform">+</span>
                </div>
                <span className="text-lg font-semibold">Créer un nouveau tableau</span>
                <span className="text-sm text-gray-500 mt-1">Cliquez pour commencer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardList;
