// components/ui/Skeleton.js
// Phase 3 refactor: skeleton loading screens to replace blank spinners.
// Skeletons mirror the exact shape of the real content so the UI doesn't jump.

import React from 'react';

// Base pulse block — all skeletons are built from this
function Pulse({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

// Single issue card skeleton — mirrors IssueCard layout
export function IssueCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Status badge + project tag */}
          <div className="flex items-center gap-2">
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-5 w-24 rounded-full" />
          </div>
          {/* Title */}
          <Pulse className="h-4 w-3/4" />
          {/* Description lines */}
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-5/6" />
          {/* Meta row */}
          <div className="flex items-center gap-4 pt-1">
            <Pulse className="h-3 w-28" />
            <Pulse className="h-3 w-24" />
            <Pulse className="h-3 w-20" />
          </div>
        </div>
        {/* Action button */}
        <Pulse className="h-8 w-20 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

// Stack of n issue card skeletons
export function IssueListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <IssueCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Project card skeleton — mirrors ProjectsPage card layout
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <Pulse className="w-9 h-9 rounded-lg" />
        <Pulse className="h-3 w-16" />
      </div>
      <Pulse className="h-4 w-2/3 mb-2" />
      <Pulse className="h-3 w-full mb-1" />
      <Pulse className="h-3 w-4/5 mb-4" />
      <div className="pt-3 border-t border-slate-100">
        <Pulse className="h-3 w-32" />
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Dashboard stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <Pulse className="h-3 w-24 mb-3" />
      <Pulse className="h-8 w-12" />
    </div>
  );
}

export function DashboardSkeleton({ count = 4 }) {
  return (
    <div>
      <div className="mb-8">
        <Pulse className="h-7 w-52 mb-2" />
        <Pulse className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: count }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <Pulse className="h-4 w-28 mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Pulse className="h-20 rounded-xl" />
        <Pulse className="h-20 rounded-xl" />
      </div>
    </div>
  );
}
