// pages/IssuesPage.js
// Phase 2 refactor: useIssues hook + react-router
// Phase 3 refactor:
//   - IssueListSkeleton replaces spinner
//   - search input (debounced) wired to useIssues
//   - status filter moved server-side via search params
//   - Pagination controls (prev/next + page indicator)

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  StatusBadge, Button, Select, Modal,
  Alert, EmptyState, IssueListSkeleton,
} from '../components/UI';
import IssueCard   from '../components/IssueCard';
import { useIssues } from '../hooks/useIssues';
import { getDevelopers } from '../api/users';

const PAGE_SIZE = 10;

function IssuesPage() {
  const { user } = useAuth();

  // ── search & filter state (drives useIssues params) ──
  const [searchInput,  setSearchInput]  = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');  // debounced value sent to hook
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage,  setCurrentPage]  = useState(1);

  // Debounce the search input — only fire after 400ms of inactivity
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset page when status filter changes
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Build the search string sent to the API
  // Status filtering is client-side after fetch (server returns all statuses per role)
  const { issues: allIssues, pagination, loading, error, assignIssue, updateStatus } = useIssues({
    page:   currentPage,
    limit:  PAGE_SIZE,
    search: searchQuery,
  });

  // Client-side status filter on top of server-paginated results
  const issues = statusFilter === 'all'
    ? allIssues
    : allIssues.filter(i => i.status === statusFilter);

  // ── developer list for assign modal ──
  const [developers, setDevelopers] = useState([]);
  useEffect(() => {
    if (user?.role === 'manager') {
      getDevelopers().then(setDevelopers).catch(() => {});
    }
  }, [user?.role]);

  // ── modal state ──
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModal,   setAssignModal]   = useState(false);
  const [statusModal,   setStatusModal]   = useState(false);
  const [assignTo,      setAssignTo]      = useState('');
  const [newStatus,     setNewStatus]     = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleAssign = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      await assignIssue(selectedIssue._id, assignTo || null);
      setActionSuccess('Issue assigned!');
      setTimeout(() => { setAssignModal(false); setActionSuccess(''); setSelectedIssue(null); }, 1000);
    } catch (err) {
      setActionError(err.message || 'Failed to assign issue');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      await updateStatus(selectedIssue._id, newStatus);
      setActionSuccess('Status updated!');
      setTimeout(() => { setStatusModal(false); setActionSuccess(''); setSelectedIssue(null); }, 1000);
    } catch (err) {
      setActionError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = (issue) => {
    setSelectedIssue(issue); setAssignTo(issue.assignedTo?._id || '');
    setActionError(''); setActionSuccess(''); setAssignModal(true);
  };
  const openStatusModal = (issue) => {
    setSelectedIssue(issue); setNewStatus(issue.status);
    setActionError(''); setActionSuccess(''); setStatusModal(true);
  };

  const pageTitle = { manager: 'All Issues', tester: 'My Bug Reports', developer: 'Assigned to Me' }[user?.role] || 'Issues';

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {loading ? 'Loading...' : `${pagination.total} total issue${pagination.total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setSearchQuery(''); setCurrentPage(1); }}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && <Alert message={error} type="error" />}

      {/* ── Issue list ── */}
      {loading ? (
        <IssueListSkeleton count={PAGE_SIZE} />
      ) : issues.length === 0 ? (
        <EmptyState
          title={pagination.total === 0 ? 'No issues found' : 'No issues match your filters'}
          subtitle={pagination.total === 0 ? 'Nothing to show here yet' : 'Try adjusting your search or filter'}
        />
      ) : (
        <div className="space-y-3">
          {issues.map(issue => (
            <IssueCard key={issue._id} issue={issue} userRole={user?.role}
              onAssign={() => openAssignModal(issue)}
              onUpdateStatus={() => openStatusModal(issue)} />
          ))}
        </div>
      )}

      {/* ── Pagination controls ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
            <span className="text-slate-400 ml-1">({pagination.total} total)</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={pagination.page <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="text-xs px-3 py-1.5"
            >
              Previous
            </Button>

            {/* Page number buttons — show up to 5 around current page */}
            {getPageNumbers(pagination.page, pagination.totalPages).map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${n === pagination.page
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {n}
              </button>
            ))}

            <Button
              variant="secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="text-xs px-3 py-1.5"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Assign Modal ── */}
      <Modal open={assignModal} onClose={() => { setAssignModal(false); setActionError(''); }} title="Assign Issue">
        {selectedIssue && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700">{selectedIssue.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{selectedIssue.project?.name}</div>
            </div>
            <Select label="Assign to Developer" value={assignTo} onChange={e => setAssignTo(e.target.value)}>
              <option value="">Unassigned</option>
              {developers.map(dev => <option key={dev._id} value={dev._id}>{dev.name}</option>)}
            </Select>
            {actionError   && <Alert message={actionError}   type="error"   />}
            {actionSuccess && <Alert message={actionSuccess} type="success" />}
            <div className="flex gap-2">
              <Button onClick={handleAssign} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Saving...' : 'Assign'}
              </Button>
              <Button variant="secondary" onClick={() => setAssignModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Status Modal ── */}
      <Modal open={statusModal} onClose={() => { setStatusModal(false); setActionError(''); }} title="Update Status">
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
            <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
            {actionError   && <Alert message={actionError}   type="error"   />}
            {actionSuccess && <Alert message={actionSuccess} type="success" />}
            <div className="flex gap-2">
              <Button onClick={handleStatusUpdate}
                disabled={actionLoading || newStatus === selectedIssue.status} className="flex-1">
                {actionLoading ? 'Saving...' : 'Update Status'}
              </Button>
              <Button variant="secondary" onClick={() => setStatusModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Helper: generate up to 5 page numbers centred around currentPage
function getPageNumbers(current, total) {
  const delta  = 2;
  const left   = Math.max(1, current - delta);
  const right  = Math.min(total, current + delta);
  const pages  = [];
  for (let i = left; i <= right; i++) pages.push(i);
  return pages;
}

export default IssuesPage;
