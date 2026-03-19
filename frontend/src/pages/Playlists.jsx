import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Playlists() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/playlists');
      setPlaylists(response.data);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    try {
      await api.post('/playlists', { name: newPlaylistName });
      setNewPlaylistName('');
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (err) {
      console.error('Failed to create playlist:', err);
    }
  };

  const startEdit = (id, name, e) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = async (id, e) => {
    e.stopPropagation();
    if (!editName.trim()) return;
    
    try {
      await api.put(`/playlists/${id}`, { name: editName });
      setEditingId(null);
      fetchPlaylists();
    } catch (err) {
      console.error('Failed to rename playlist:', err);
    }
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = (id, name, e) => {
    e.stopPropagation();
    setDeleteConfirm({ id, name });
  };

  const deletePlaylist = async () => {
    try {
      await api.delete(`/playlists/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchPlaylists();
    } catch (err) {
      console.error('Failed to delete playlist:', err);
    }
  };

  const openPlaylist = (id) => {
    if (editingId !== id) {
      navigate(`/playlists/${id}`);
    }
  };

  return (
    <div className="page-content">
      <div className="playlist-header">
        <h1>Your Playlists</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-btn">
          + Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createPlaylist} className="create-playlist-form">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            autoFocus
          />
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
        </form>
      )}

      {playlists.length === 0 && !showCreateForm ? (
        <div className="empty-state-card">
          <div className="empty-icon">📚</div>
          <p>No playlists yet. Create your first playlist!</p>
        </div>
      ) : (
        <div className="playlist-grid">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card" onClick={() => openPlaylist(playlist.id)}>
              <div className="playlist-icon">♫</div>
              {editingId === playlist.id ? (
                <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(playlist.id, e)}
                    autoFocus
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button onClick={(e) => saveEdit(playlist.id, e)} className="save-btn">✓</button>
                    <button onClick={cancelEdit} className="cancel-btn">✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{playlist.name}</h3>
                  <div className="playlist-actions">
                    <button onClick={(e) => startEdit(playlist.id, playlist.name, e)} className="edit-btn" title="Rename">
                      ✏️
                    </button>
                    <button onClick={(e) => confirmDelete(playlist.id, playlist.name, e)} className="delete-btn" title="Delete">
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Playlist?</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={deletePlaylist} className="confirm-delete-btn">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="cancel-modal-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlists;
