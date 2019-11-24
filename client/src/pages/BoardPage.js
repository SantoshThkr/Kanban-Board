import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';

function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(
    function () {
      setLoading(true);

      api
        .get('/boards/' + id)
        .then(function (res) {
          setBoard(res.data);
        })
        .catch(function (err) {
          setError(getErrorMessage(err));
        })
        .then(function () {
          setLoading(false);
        });
    },
    [id]
  );

  if (loading) {
    return <p className="container loading">Loading board...</p>;
  }

  if (error) {
    return (
      <div className="container">
        <p className="alert alert-error">{error}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>{board.title}</h2>
          {board.description && <p className="board-subtitle">{board.description}</p>}
        </div>
        <Link className="btn btn-light" to="/dashboard">
          Back to boards
        </Link>
      </div>
    </div>
  );
}

export default BoardPage;
