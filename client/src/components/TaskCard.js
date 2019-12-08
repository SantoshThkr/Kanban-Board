import React, { useState } from 'react';
import TaskForm from './TaskForm';
import PriorityBadge from './PriorityBadge';
import { COLUMNS } from '../constants';

function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  async function handleEdit(values) {
    await onUpdate(task._id, values);
    setEditing(false);
  }

  // Moving a task is just a status change, no drag and drop needed.
  function handleStatusChange(e) {
    onUpdate(task._id, { status: e.target.value });
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
    <div className={'task-card priority-' + task.priority.toLowerCase()}>
      <div className="task-card-top">
        <h4 className="task-title">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-move">
        <label htmlFor={'status-' + task._id}>Move to</label>
        <select id={'status-' + task._id} value={task.status} onChange={handleStatusChange}>
          {COLUMNS.map(function (column) {
            return (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            );
          })}
        </select>
      </div>

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
