import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import Column from '../components/Column';
import TaskForm from '../components/TaskForm';
import { COLUMNS, byPriority } from '../constants';

function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(
    function () {
      let cancelled = false;
      setLoading(true);

      Promise.all([api.get('/boards/' + id), api.get('/boards/' + id + '/tasks')])
        .then(function (responses) {
          if (!cancelled) {
            setBoard(responses[0].data);
            setTasks(responses[1].data);
            setError('');
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
    },
    [id]
  );

  async function handleCreateTask(values) {
    try {
      const res = await api.post('/boards/' + id + '/tasks', values);
      setTasks(tasks.concat(res.data));
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleUpdateTask(taskId, values) {
    try {
      const res = await api.put('/tasks/' + taskId, values);
      setTasks(
        tasks.map(function (task) {
          return task._id === taskId ? res.data : task;
        })
      );
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await api.delete('/tasks/' + taskId);
      setTasks(
        tasks.filter(function (task) {
          return task._id !== taskId;
        })
      );
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function tasksFor(status) {
    return tasks
      .filter(function (task) {
        return task.status === status;
      })
      .sort(byPriority);
  }

  if (loading) {
    return <p className="container loading">Loading board...</p>;
  }

  if (!board) {
    return (
      <div className="container">
        <p className="alert alert-error">{error || 'Board not found'}</p>
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

        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={function () {
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Close' : 'Add task'}
          </button>
          <Link className="btn btn-light" to="/dashboard">
            Back to boards
          </Link>
        </div>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {showForm && (
        <div className="card">
          <h3>New task</h3>
          <TaskForm submitLabel="Add task" onSubmit={handleCreateTask} />
        </div>
      )}

      <div className="kanban">
        {COLUMNS.map(function (column) {
          return (
            <Column
              key={column.key}
              column={column}
              tasks={tasksFor(column.key)}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BoardPage;
