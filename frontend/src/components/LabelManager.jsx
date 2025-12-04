import { useState, useEffect } from 'react';
import { labelsAPI } from '../services/api';

const LabelManager = ({ boardId, cardId, onLabelsChange }) => {
  const [labels, setLabels] = useState([]);
  const [cardLabels, setCardLabels] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newLabel, setNewLabel] = useState({ title: '', color: '#3B82F6' });

  const PRESET_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#EAB308', // Yellow
    '#84CC16', // Lime
    '#22C55E', // Green
    '#10B981', // Emerald
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#0EA5E9', // Sky
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#A855F7', // Purple
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
  ];

  useEffect(() => {
    fetchLabels();
    if (cardId) {
      fetchCardLabels();
    }
  }, [boardId, cardId]);

  const fetchLabels = async () => {
    try {
      const response = await labelsAPI.getByBoardId(boardId);
      setLabels(response.data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const fetchCardLabels = async () => {
    try {
      const response = await labelsAPI.getByCardId(cardId);
      setCardLabels(response.data);
    } catch (error) {
      console.error('Error fetching card labels:', error);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabel.title.trim()) return;

    try {
      await labelsAPI.create({
        title: newLabel.title,
        color: newLabel.color,
        board_id: boardId,
      });
      setNewLabel({ title: '', color: '#3B82F6' });
      setIsCreating(false);
      fetchLabels();
    } catch (error) {
      console.error('Error creating label:', error);
    }
  };

  const handleUpdateLabel = async () => {
    if (!editingLabel || !editingLabel.title.trim()) return;

    try {
      await labelsAPI.update(editingLabel.id, {
        title: editingLabel.title,
        color: editingLabel.color,
      });
      setEditingLabel(null);
      fetchLabels();
      if (cardId) fetchCardLabels();
      if (onLabelsChange) onLabelsChange();
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (!window.confirm('Supprimer ce label ?')) return;

    try {
      await labelsAPI.delete(labelId);
      fetchLabels();
      if (cardId) fetchCardLabels();
      if (onLabelsChange) onLabelsChange();
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  const handleToggleLabel = async (label) => {
    if (!cardId) return;

    const isAssigned = cardLabels.some((l) => l.id === label.id);

    try {
      if (isAssigned) {
        await labelsAPI.removeFromCard(cardId, label.id);
      } else {
        await labelsAPI.addToCard(cardId, label.id);
      }
      fetchCardLabels();
      if (onLabelsChange) onLabelsChange();
    } catch (error) {
      console.error('Error toggling label:', error);
    }
  };

  const isLabelAssigned = (labelId) => {
    return cardLabels.some((l) => l.id === labelId);
  };

  return (
    <div className="label-manager">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">🏷️ Labels</h3>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isCreating ? 'Annuler' : '+ Nouveau'}
          </button>
        </div>

        {isCreating && (
          <div className="bg-gray-50 p-3 rounded-lg mb-3 animate-slide-in">
            <input
              type="text"
              value={newLabel.title}
              onChange={(e) => setNewLabel({ ...newLabel, title: e.target.value })}
              placeholder="Nom du label"
              className="input mb-2"
              autoFocus
            />
            <div className="flex gap-1 mb-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewLabel({ ...newLabel, color })}
                  className={`w-8 h-8 rounded transition-transform ${
                    newLabel.color === color ? 'scale-110 ring-2 ring-gray-800' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={handleCreateLabel}
              className="btn-primary w-full text-sm"
            >
              Créer
            </button>
          </div>
        )}

        <div className="space-y-2">
          {labels.map((label) => (
            <div
              key={label.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                cardId
                  ? isLabelAssigned(label.id)
                    ? 'bg-gray-100 ring-2 ring-blue-400'
                    : 'bg-white hover:bg-gray-50'
                  : 'bg-white'
              }`}
            >
              {editingLabel?.id === label.id ? (
                <div className="flex-1 animate-slide-in">
                  <input
                    type="text"
                    value={editingLabel.title}
                    onChange={(e) =>
                      setEditingLabel({ ...editingLabel, title: e.target.value })
                    }
                    className="input mb-2"
                    autoFocus
                  />
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingLabel({ ...editingLabel, color })}
                        className={`w-6 h-6 rounded transition-transform ${
                          editingLabel.color === color
                            ? 'scale-110 ring-2 ring-gray-800'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateLabel}
                      className="btn-primary flex-1 text-sm"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingLabel(null)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => cardId && handleToggleLabel(label)}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md font-medium text-white transition-transform ${
                      cardId ? 'cursor-pointer hover:scale-102' : ''
                    }`}
                    style={{ backgroundColor: label.color }}
                  >
                    {cardId && isLabelAssigned(label.id) && <span>✓</span>}
                    <span>{label.title}</span>
                  </button>
                  <button
                    onClick={() => setEditingLabel({ ...label })}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                    title="Modifier"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteLabel(label.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {labels.length === 0 && !isCreating && (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucun label disponible
          </p>
        )}
      </div>
    </div>
  );
};

export default LabelManager;
