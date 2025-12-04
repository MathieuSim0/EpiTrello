import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import LabelManager from './LabelManager';
import CommentSection from './CommentSection';
import { commentsAPI } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const Card = ({ card, onUpdate, onDelete, boardId }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  useEffect(() => {
    fetchCommentCount();
  }, [card.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await commentsAPI.getCount(card.id);
      setCommentCount(response.data.count);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { ...card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(card.id, { title, description });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card p-4 mb-2 border-2 border-blue-400 shadow-lg animate-slide-in">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input mb-3 font-semibold"
          placeholder={t('cardTitle')}
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea mb-3"
          placeholder={t('cardDescription')}
          rows="3"
        />
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleSave}
            className="btn-primary flex-1 text-sm"
          >
            💾 {t('save')}
          </button>
          <button
            onClick={handleCancel}
            className="btn-secondary flex-1 text-sm"
          >
            {t('cancel')}
          </button>
        </div>
        <div className="border-t pt-3">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2 block"
          >
            {showLabels ? `▼ ${t('hideLabels')}` : `▶ ${t('manageLabels')}`}
          </button>
          {showLabels && (
            <LabelManager
              boardId={boardId}
              cardId={card.id}
              onLabelsChange={() => onUpdate(card.id, { title, description })}
            />
          )}
        </div>
        <div className="border-t pt-3 mt-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2 block"
          >
            {showComments ? `▼ ${t('comments')}` : `▶ ${t('comments')} (${commentCount})`}
          </button>
          {showComments && (
            <CommentSection cardId={card.id} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`card p-3 mb-2 cursor-move transition-smooth ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'opacity-100 hover:shadow-xl'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0" onClick={() => setIsEditing(true)}>
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: label.color }}
                  title={label.title}
                >
                  {label.title}
                </span>
              ))}
            </div>
          )}
          <h4 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          )}
          {commentCount > 0 && (
            <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
              <span>💬</span>
              <span>{commentCount}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (window.confirm(t('deleteCardConfirm'))) {
              onDelete(card.id);
            }
          }}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50"
          title={t('delete')}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Card;
