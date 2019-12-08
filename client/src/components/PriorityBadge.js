import React from 'react';

/**
 * Small coloured label showing how urgent a task is.
 */
function PriorityBadge({ priority }) {
  return (
    <span className={'badge badge-' + priority.toLowerCase()}>{priority}</span>
  );
}

export default PriorityBadge;
