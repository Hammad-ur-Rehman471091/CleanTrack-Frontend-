// pages/IssuesPage.js
// Role-aware issues list — all 3 roles use this page with different capabilities
// TODO (refactor): split into ManagerIssues, TesterIssues, DeveloperIssues components
// TODO (refactor): extract AssignModal and StatusUpdateModal
// TODO (refactor): add pagination / infinite scroll for large datasets
// TODO (refactor): add filtering and search

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Card, StatusBadge, RoleBadge, Button, Select, Modal,
  Alert, EmptyState, Spinner
} from '../components/UI';

const API = process.env.REACT_APP_API_URL || '';

function IssuesPage() {
  const { user, token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Manager-specific: list of developers for assignment
  const [developers, setDevelopers] = useState([]);

  // Modal state
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  // Form state for modals
  const [assignTo, setAssignTo] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter state (lightweight, no URL sync — TODO for refactor)
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchIssues = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIssues(data.issues);
    } catch (err) {
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDevelopers = useCallback(async () => {
    if (user?.role !== 'manager') return;
    try {
      const res = await fetch(`${API}/api/users/developers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDevelopers(data.developers || []);
    } catch (err) {
      // non-critical, fail silently
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchIssues();
    fetchDevelopers();
  }, [fetchIssues, fetchDevelopers]);

  // Assign issue handler (manager)
  const handleAssign = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/issues/${selectedIssue._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo: assignTo || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIssues(prev => prev.map(i => i._id === data.issue._id ? data.issue : i));
      setActionSuccess('Issue assigned!');
      setTimeout(() => { setAssignModal(false); setActionSuccess(''); setSelectedIssue(null); }, 1000);
    } catch (err) {
      setActionError(err.message || 'Failed to assign issue');
    } finally {
      setActionLoading(false);
    }
  };

  // Update status handler (developer)
  const handleStatusUpdate = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/issues/${selectedIssue._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIssues(prev => prev.map(i => i._id === data.issue._id ? data.issue : i));
      setActionSuccess('Status updated!');
      setTimeout(() => { setStatusModal(false); setActionSuccess(''); setSelectedIssue(null); }, 1000);
    } catch (err) {
      setActionError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setAssignTo(issue.assignedTo?._id || '');
    setActionError('');
    setActionSuccess('');
    setAssignModal(true);
  };

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setActionError('');
    setActionSuccess('');
    setStatusModal(true);
  };

  // Client-side filter
  const filteredIssues = issues.filter(issue => {
    if (statusFilter === 'all') return true;
    return issue.status === statusFilter;
  });

  // Page title per role
  const pageTitle = {
    manager: 'All Issues',
    tester: 'My Bug Reports',
    developer: 'Assigned to Me',
  }[user?.role] || 'Issues';

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-1">{filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && <Alert message={error} type="error" />}

      {filteredIssues.length === 0 ? (
        <EmptyState
          title={issues.length === 0 ? 'No issues found' : 'No issues match the filter'}
          subtitle={issues.length === 0 ? 'Nothing to show here yet' : 'Try changing the status filter'}
        />
      ) : (
        <div className="space-y-3">
          {filteredIssues.map(issue => (
            <IssueCard
              key={issue._id}
              issue={issue}
              userRole={user?.role}
              onAssign={() => openAssignModal(issue)}
              onUpdateStatus={() => openStatusModal(issue)}
            />
          ))}
        </div>
      )}

      {/* Assign Modal (manager) */}
      <Modal
        open={assignModal}
        onClose={() => { setAssignModal(false); setActionError(''); }}
        title="Assign Issue"
      >
        {selectedIssue && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700">{selectedIssue.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{selectedIssue.project?.name}</div>
            </div>
            <Select
              label="Assign to Developer"
              value={assignTo}
              onChange={e => setAssignTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {developers.map(dev => (
                <option key={dev._id} value={dev._id}>{dev.name}</option>
              ))}
            </Select>
            {actionError && <Alert message={actionError} type="error" />}
            {actionSuccess && <Alert message={actionSuccess} type="success" />}
            <div className="flex gap-2">
              <Button onClick={handleAssign} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Saving...' : 'Assign'}
              </Button>
              <Button variant="secondary" onClick={() => setAssignModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Modal (developer) */}
      <Modal
        open={statusModal}
        onClose={() => { setStatusModal(false); setActionError(''); }}
        title="Update Status"
      >
        {selectedIssue && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700">{selectedIssue.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={selectedIssue.status} />
                <span className="text-slate-400 text-xs">→</span>
                <StatusBadge status={newStatus} />
              </div>
            </div>
            <Select
              label="New Status"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
            {actionError && <Alert message={actionError} type="error" />}
            {actionSuccess && <Alert message={actionSuccess} type="success" />}
            <div className="flex gap-2">
              <Button onClick={handleStatusUpdate} disabled={actionLoading || newStatus === selectedIssue.status} className="flex-1">
                {actionLoading ? 'Saving...' : 'Update Status'}
              </Button>
              <Button variant="secondary" onClick={() => setStatusModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Issue card component
// TODO (refactor): move to its own IssueCard.js file
function IssueCard({ issue, userRole, onAssign, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={issue.status} />
            {issue.project?.name && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {issue.project.name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-800 mb-1 truncate">{issue.title}</h3>
          <p className={`text-sm text-slate-500 ${expanded ? '' : 'line-clamp-2'}`}>
            {issue.description}
          </p>

          {issue.description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-violet-600 hover:text-violet-700 mt-1"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {expanded && issue.stepsToReproduce && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-xs font-semibold text-slate-600 mb-1">Steps to Reproduce:</div>
              <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">
                {issue.stepsToReproduce}
              </pre>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="text-xs text-slate-400">
              Reported by <span className="font-medium text-slate-600">{issue.reportedBy?.name}</span>
            </div>
            <div className="text-xs text-slate-400">
              {issue.assignedTo
                ? <>Assigned to <span className="font-medium text-slate-600">{issue.assignedTo.name}</span></>
                : <span className="text-rose-400">Unassigned</span>
              }
            </div>
            <div className="text-xs text-slate-400">
              {new Date(issue.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          {userRole === 'manager' && (
            <Button variant="secondary" onClick={onAssign} className="text-xs whitespace-nowrap">
              {issue.assignedTo ? 'Reassign' : 'Assign'}
            </Button>
          )}
          {userRole === 'developer' && issue.status !== 'resolved' && (
            <Button variant="secondary" onClick={onUpdateStatus} className="text-xs whitespace-nowrap">
              Update Status
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default IssuesPage;
