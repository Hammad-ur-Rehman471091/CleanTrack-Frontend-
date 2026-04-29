// components/UI.js
// Phase 1 refactor: barrel re-export from components/ui/
// Phase 3 refactor: added Skeleton exports

export { StatusBadge, RoleBadge }                                        from './ui/Badge';
export { Card, StatCard }                                                 from './ui/Card';
export { Button }                                                         from './ui/Button';
export { Input, Textarea, Select }                                        from './ui/FormFields';
export { Alert, Spinner, EmptyState, Modal }                             from './ui/Feedback';
export {
  IssueCardSkeleton,
  IssueListSkeleton,
  ProjectCardSkeleton,
  ProjectGridSkeleton,
  StatCardSkeleton,
  DashboardSkeleton,
} from './ui/Skeleton';
