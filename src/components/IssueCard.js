import React, { useState } from 'react';
import { Card, StatusBadge, Button } from './UI';

function IssueCard({ issue, userRole, onAssign, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-5 hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={issue.status} />
            {issue.project?.name && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {issue.project.name}
              </span>
            )}
            {issue.team?.name && (
              <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                {issue.team.name}
              </span>
            )}
          </div>

          <h3 className="font-medium text-gray-800 mb-1 truncate">{issue.title}</h3>
          <p className={`text-sm text-gray-500 ${expanded ? '' : 'line-clamp-2'}`}>
            {issue.description}
          </p>

          {issue.description.length > 100 && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-500 hover:text-blue-700 mt-1">
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {expanded && issue.stepsToReproduce && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="text-xs font-semibold text-gray-600 mb-1">Steps to Reproduce:</div>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">{issue.stepsToReproduce}</pre>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">
              By <span className="font-medium text-gray-600">{issue.reportedBy?.name}</span>
            </span>
            <span className="text-xs text-gray-400">
              {issue.assignedTo
                ? <>Assigned to <span className="font-medium text-gray-600">{issue.assignedTo.name}</span></>
                : <span className="text-red-400">Unassigned</span>
              }
            </span>
            <span className="text-xs text-gray-400">
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

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
