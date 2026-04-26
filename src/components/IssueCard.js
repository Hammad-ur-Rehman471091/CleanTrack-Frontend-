// components/IssueCard.js
// Extracted from IssuesPage.js (Phase 1 refactor)

import React, { useState } from 'react';
import { Card }        from './UI';
import { StatusBadge } from './UI';
import { Button }      from './UI';

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

export default IssueCard;
