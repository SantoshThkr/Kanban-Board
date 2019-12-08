import React, { useState } from 'react';
import { PRIORITIES } from '../constants';

/**
 * Form for creating a new task or editing an existing one.
 */
function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues ? initialValues.title : '');
  const [description, setDescription] = useState(
    initialValues ? initialValues.description : ''
  );
  const [priority, setPriority] = useState(
    initialValues ? initialValues.priority : 'MEDIUM'
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority: priority
      });

      if (!initialValues) {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task title</label>
        <input
          type="text"
          value={title}
          onChange={function (e) {
            setTitle(e.target.value);
          }}
          placeholder="What needs to be done?"
          maxLength={120}
          required
        />
      </div>

      <div className="form-group">
        <label>Details (optional)</label>
        <textarea
          value={description}
          onChange={function (e) {
            setDescription(e.target.value);
          }}
          placeholder="Any extra notes"
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select
          value={priority}
          onChange={function (e) {
            setPriority(e.target.value);
          }}
        >
          {PRIORITIES.map(function (value) {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>

        {onCancel && (
          <button type="button" className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
