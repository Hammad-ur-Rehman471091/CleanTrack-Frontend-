// pages/IssuesPage.js
// Phase 2 refactor:
//   - raw fetch() replaced with useIssues() custom hook + api/users.js
//   - navigation uses useNavigate() from react-router-dom

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, Button, Select, Modal, Alert, EmptyState, Spinner } from '../components/UI';
import IssueCard from '../components/IssueCard';
import { useIssues } from '../hooks/useIssues';
import { getDevelopers } from '../api/users';

function IssuesPage() {
  const { user } = useAuth();
  const { issues, loading, error, assignIssue, updateStatus } = useIssues();

  const [developers,    setDevelopers]    = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModal,   setAssignModal]   = useState(false);
  const [statusModal,   setStatusModal]   = useState(false);
  const [assignTo,      setAssignTo]      = useState('');
  const [newStatus,     setNewStatus]     = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');

  useEffect(() => {
    if (user?.role === 'manager') {
      getDevelopers().then(setDevelopers).catch(() => {});
    }
  }, [user?.role]);

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
    setSelectedIssue(issue);
    setAssignTo(issue.assignedTo?._id || '');
    setActionError(''); setActionSuccess('');
    setAssignModal(true);
  };

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setActionError(''); setActionSuccess('');
    setStatusModal(true);
  };

  const filteredIssues = issues.filter(i => statusFilter === 'all' || i.status === statusFilter);

  const pageTitle = { manager: 'All Issues', tester: 'My Bug Reports', developer: 'Assigned to Me' }[user?.role] || 'Issues';

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-1">{filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400">
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
            <IssueCard key={issue._id} issue={issue} userRole={user?.role}
              onAssign={() => openAssignModal(issue)}
              onUpdateStatus={() => openStatusModal(issue)} />
          ))}
        </div>
      )}

      {/* Assign Modal */}
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

      {/* Status Modal */}
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

export default IssuesPage;
