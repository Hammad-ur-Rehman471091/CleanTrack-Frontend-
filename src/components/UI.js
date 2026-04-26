// components/UI.js
// Phase 1 refactor: this file is now a barrel that re-exports from components/ui/
// All existing imports of '../components/UI' continue to work unchanged.
// Individual files can now also import directly from '../components/ui/Button' etc.

export { StatusBadge, RoleBadge }            from './ui/Badge';
export { Card, StatCard }                    from './ui/Card';
export { Button }                            from './ui/Button';
export { Input, Textarea, Select }           from './ui/FormFields';
export { Alert, Spinner, EmptyState, Modal } from './ui/Feedback';
