const PERMISSIONS = {
  manager:   ['dashboard', 'teams', 'projects', 'issues'],
  tester:    ['dashboard', 'teams', 'report',   'issues'],
  developer: ['dashboard', 'teams', 'issues'],
};

export function canAccess(role, page) {
  return PERMISSIONS[role]?.includes(page) ?? false;
}

export function getAllowedPages(role) {
  return PERMISSIONS[role] ?? [];
}

export default PERMISSIONS;
