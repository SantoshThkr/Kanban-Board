import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BoardForm from './BoardForm';

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function BoardCard({ board, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  async function handleUpdate(values) {
    await onUpdate(board._id, values);
    setEditing(false);
  }

  function handleDelete() {
    const ok = window.confirm(
      'Delete "' + board.title + '"? Its tasks will be removed too.'
    );

    if (ok) {
      onDelete(board._id);
    }
  }

  if (editing) {
    return (
      <div className="card board-card">
        <BoardForm
          initialValues={board}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={function () {
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="card board-card">
      <h3 className="board-card-title">
        <Link to={'/boards/' + board._id}>{board.title}</Link>
      </h3>

      <p className="board-card-description">
        {board.description || 'No description'}
      </p>

      <p className="board-card-meta">Created {formatDate(board.createdAt)}</p>

      <div className="board-card-actions">
        <Link className="btn btn-small btn-primary" to={'/boards/' + board._id}>
          Open
        </Link>
        <button
          className="btn btn-small btn-light"
          onClick={function () {
            setEditing(true);
          }}
        >
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default BoardCard;
