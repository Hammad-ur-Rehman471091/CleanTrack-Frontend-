// config/permissions.js
// Phase 2 refactor: centralized role-page access rules
// Extracted from the inline allowedPages object in App.js
// Single source of truth for what each role can see/navigate to

const PERMISSIONS = {
  manager:   ['dashboard', 'projects', 'issues'],
  tester:    ['dashboard', 'report',   'issues'],
  developer: ['dashboard', 'issues'],
};

/**
 * Returns true if the given role is allowed to access the given page.
 */
export function canAccess(role, page) {
  return PERMISSIONS[role]?.includes(page) ?? false;
}

/**
 * Returns the list of allowed pages for a role.
 */
export function getAllowedPages(role) {
  return PERMISSIONS[role] ?? [];
}

export default PERMISSIONS;
