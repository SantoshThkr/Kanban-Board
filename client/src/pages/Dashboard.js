import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api/axios';
import BoardCard from '../components/BoardCard';
import BoardForm from '../components/BoardForm';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(function () {
    let cancelled = false;

    api
      .get('/boards')
      .then(function (res) {
        if (!cancelled) {
          setBoards(res.data);
        }
      })
      .catch(function (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      })
      .then(function () {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return function () {
      cancelled = true;
    };
  }, []);

  async function handleCreate(values) {
    try {
      const res = await api.post('/boards', values);
      setBoards([res.data].concat(boards));
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleUpdate(id, values) {
    try {
      const res = await api.put('/boards/' + id, values);
      setBoards(
        boards.map(function (board) {
          return board._id === id ? res.data : board;
        })
      );
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete('/boards/' + id);
      setBoards(
        boards.filter(function (board) {
          return board._id !== id;
        })
      );
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>My boards</h2>
        <button
          className="btn btn-primary"
          onClick={function () {
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Close' : 'New board'}
        </button>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {showForm && (
        <div className="card">
          <h3>Create a board</h3>
          <BoardForm submitLabel="Create board" onSubmit={handleCreate} />
        </div>
      )}

      {loading ? (
        <p className="loading">Loading boards...</p>
      ) : boards.length === 0 ? (
        <div className="card empty-state">
          <p>You have no boards yet.</p>
          <p>Create your first board to start adding tasks.</p>
        </div>
      ) : (
        <div className="board-grid">
          {boards.map(function (board) {
            return (
              <BoardCard
                key={board._id}
                board={board}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
