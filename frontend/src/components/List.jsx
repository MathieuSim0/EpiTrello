import { useDrop } from 'react-dnd';
import { useState } from 'react';
import Card from './Card';

const List = ({ list, onUpdateList, onDeleteList, onCreateCard, onUpdateCard, onDeleteCard, onMoveCard }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item) => {
      if (item.list_id !== list.id) {
        // Moving to a different list
        onMoveCard(item.id, list.id, list.cards?.length || 0);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onCreateCard(list.id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (listTitle.trim() && listTitle !== list.title) {
      onUpdateList(list.id, { title: listTitle });
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={drop}
      className={`bg-white rounded-lg p-4 w-72 flex-shrink-0 shadow-sm border border-gray-200 transition-smooth ${
        isOver ? 'ring-2 ring-blue-500 shadow-md scale-102' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateTitle()}
            className="input flex-1 font-semibold text-lg"
            autoFocus
          />
        ) : (
          <h3
            className="font-bold text-lg text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => {
            if (window.confirm('Supprimer cette liste et toutes ses cartes ?')) {
              onDeleteList(list.id);
            }
          }}
          className="text-gray-400 hover:text-red-500 transition-colors ml-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
          title="Supprimer la liste"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {list.cards?.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>

      {isAddingCard ? (
        <div className="card p-3 animate-slide-in">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Titre de la carte..."
            className="textarea"
            rows="2"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddCard}
              className="btn-primary flex-1 text-sm"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="btn-secondary flex-1 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full text-left text-gray-600 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm flex items-center transition-smooth font-medium hover:text-gray-800"
        >
          <span className="text-xl mr-2">+</span> Ajouter une carte
        </button>
      )}
    </div>
  );
};

export default List;
