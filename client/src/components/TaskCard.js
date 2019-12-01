import React, { useState } from 'react';
import TaskForm from './TaskForm';

function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  async function handleEdit(values) {
    await onUpdate(task._id, values);
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm('Delete "' + task.title + '"?')) {
      onDelete(task._id);
    }
  }

  if (editing) {
    return (
      <div className="task-card task-card-editing">
        <TaskForm
          initialValues={task}
          submitLabel="Save"
          onSubmit={handleEdit}
          onCancel={function () {
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="task-card">
      <h4 className="task-title">{task.title}</h4>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-actions">
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

export default TaskCard;
