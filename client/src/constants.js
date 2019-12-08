// The three fixed Kanban columns.
export const COLUMNS = [
  { key: 'TODO', label: 'TODO' },
  { key: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { key: 'DONE', label: 'DONE' }
];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export function statusLabel(status) {
  const column = COLUMNS.find(function (c) {
    return c.key === status;
  });

  return column ? column.label : status;
}

// Used to sort tasks inside a column, most urgent first.
export const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function byPriority(a, b) {
  return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
}
