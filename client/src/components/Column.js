import React from 'react';
import TaskCard from './TaskCard';

/**
 * One Kanban column with the task cards that belong to it.
 */
function Column({ column, tasks, onUpdateTask, onDeleteTask }) {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.label}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="column-empty">No tasks here</p>
        ) : (
          tasks.map(function (task) {
            return (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Column;
