import { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';

const CommentSection = ({ cardId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [cardId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentsAPI.getByCardId(cardId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await commentsAPI.create({
        content: newComment,
        card_id: cardId,
        author: 'Utilisateur'
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (id) => {
    if (!editContent.trim()) return;

    try {
      await commentsAPI.update(id, { content: editContent });
      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;

    try {
      await commentsAPI.delete(id);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="comment-section">
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        💬 Commentaires
        {comments.length > 0 && (
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </h4>

      {/* New comment input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="textarea text-sm"
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddComment();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">Ctrl + Enter pour envoyer</span>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-4 text-gray-400">
          <span className="animate-pulse">Chargement...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p className="text-2xl mb-2">💭</p>
          <p className="text-sm">Aucun commentaire pour le moment</p>
          <p className="text-xs mt-1">Soyez le premier à commenter !</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-2 group"
            >
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {comment.author?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">
                    {comment.author || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(comment.created_at)}
                    {comment.updated_at !== comment.created_at && ' (modifié)'}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="textarea text-sm"
                      rows="2"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-2.5 text-sm text-gray-700 relative group">
                    <p className="whitespace-pre-wrap break-words">{comment.content}</p>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => startEditing(comment)}
                        className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-white"
                        title="Modifier"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-white"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
