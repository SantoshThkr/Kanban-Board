import React, { useState } from 'react';

/**
 * Small form used both for creating a board and for renaming one.
 */
function BoardForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues ? initialValues.title : '');
  const [description, setDescription] = useState(
    initialValues ? initialValues.description : ''
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setSaving(true);

    try {
      await onSubmit({ title: title.trim(), description: description.trim() });

      if (!initialValues) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Board title</label>
        <input
          type="text"
          value={title}
          onChange={function (e) {
            setTitle(e.target.value);
          }}
          placeholder="e.g. Portfolio website"
          maxLength={80}
          required
        />
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={function (e) {
            setDescription(e.target.value);
          }}
          placeholder="What is this board about?"
          maxLength={300}
        />
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

export default BoardForm;
