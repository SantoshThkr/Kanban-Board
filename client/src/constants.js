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
