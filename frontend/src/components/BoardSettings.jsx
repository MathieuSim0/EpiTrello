import { useState } from 'react';
import { boardsAPI, listsAPI } from '../services/api';
import LabelManager from './LabelManager';
import { useLanguage } from '../i18n/LanguageContext';

const BoardSettings = ({ board, onClose, onUpdate, onDelete }) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const [activeTab, setActiveTab] = useState('general');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getLocale = () => {
    const locales = { fr: 'fr-FR', en: 'en-US', es: 'es-ES' };
    return locales[language] || 'fr-FR';
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await boardsAPI.update(board.id, { title, description });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm(t('deleteBoardConfirm'))) {
      return;
    }

    setIsDeleting(true);
    try {
      await boardsAPI.delete(board.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting:', error);
      setIsDeleting(false);
    }
  };

  const handleDeleteList = async (listId, listTitle) => {
    if (!window.confirm(t('deleteListConfirm', { title: listTitle }))) {
      return;
    }

    try {
      await listsAPI.delete(listId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleUpdateListTitle = async (listId, newTitle) => {
    if (!newTitle.trim()) return;

    try {
      await listsAPI.update(listId, { title: newTitle });
      onUpdate();
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ {t('boardSettings')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 {t('general')}
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'lists'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📑 {t('lists')} ({board.lists?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('labels')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'labels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏷️ {t('labels')}
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'danger'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚠️ {t('dangerZone')}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Tab: Général */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('boardName')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder={t('boardName')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('descriptionOptional')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea"
                  placeholder={t('describeBoardPlaceholder')}
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? `⏳ ${t('saving')}` : `💾 ${t('save')}`}
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Tab: Listes */}
          {activeTab === 'lists' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                {t('manageListsDescription')}
              </p>

              {board.lists?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p>{t('noListsInBoard')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {board.lists?.map((list, index) => (
                    <ListItem
                      key={list.id}
                      list={list}
                      index={index}
                      onUpdateTitle={handleUpdateListTitle}
                      onDelete={handleDeleteList}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Labels */}
          {activeTab === 'labels' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t('manageLabelsDescription')}
              </p>
              <LabelManager boardId={board.id} onLabelsChange={onUpdate} />
            </div>
          )}

          {/* Tab: Zone danger */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  🗑️ {t('deleteBoard')}
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  {t('deleteBoardWarning')}
                </p>
                <button
                  onClick={handleDeleteBoard}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? `⏳ ${t('deleting')}` : `🗑️ ${t('deletePermanently')}`}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  📊 {t('boardInfo')}
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>{board.lists?.length || 0}</strong> {t('listsCount')}</li>
                  <li>• <strong>{board.lists?.reduce((acc, list) => acc + (list.cards?.length || 0), 0) || 0}</strong> {t('cardsTotal')}</li>
                  <li>• {t('createdOn')} : {new Date(board.created_at).toLocaleDateString(getLocale())}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour les items de liste
const ListItem = ({ list, index, onUpdateTitle, onDelete, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== list.title) {
      onUpdateTitle(list.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(list.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-gray-400 font-medium w-6">{index + 1}.</span>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 font-medium text-gray-800">{list.title}</span>
          <span className="text-sm text-gray-400">
            {list.cards?.length || 0} {t('cardsCount')}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title={t('rename')}
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(list.id, list.title)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title={t('delete')}
          >
            🗑️
          </button>
        </>
      )}
    </div>
  );
};

export default BoardSettings;
