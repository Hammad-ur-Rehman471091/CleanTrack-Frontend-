import React from 'react';

function Pulse({ className = '' }) {
  return <div className={`animate-pulse bg-blue-100 rounded ${className}`} />;
}

export function IssueCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-blue-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-5 w-24 rounded-full" />
          </div>
          <Pulse className="h-4 w-3/4" />
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-5/6" />
          <div className="flex items-center gap-4 pt-1">
            <Pulse className="h-3 w-28" />
            <Pulse className="h-3 w-24" />
          </div>
        </div>
        <Pulse className="h-8 w-20 rounded-md shrink-0" />
      </div>
    </div>
  );
}

export function IssueListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <IssueCardSkeleton key={i} />)}
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-blue-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <Pulse className="w-9 h-9 rounded-md" />
        <Pulse className="h-3 w-16" />
      </div>
      <Pulse className="h-4 w-2/3 mb-2" />
      <Pulse className="h-3 w-full mb-1" />
      <Pulse className="h-3 w-4/5 mb-4" />
      <div className="pt-3 border-t border-gray-100"><Pulse className="h-3 w-32" /></div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <ProjectCardSkeleton key={i} />)}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
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
        {Array.from({ length: count }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <Pulse className="h-4 w-28 mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Pulse className="h-20 rounded-lg" />
        <Pulse className="h-20 rounded-lg" />
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-blue-100 shadow-sm p-5">
      <div className="flex justify-between mb-3">
        <Pulse className="w-9 h-9 rounded-md" />
        <Pulse className="h-6 w-24 rounded-md" />
      </div>
      <Pulse className="h-4 w-2/3 mb-2" />
      <Pulse className="h-3 w-full mb-4" />
      <div className="pt-3 border-t border-gray-100 flex gap-2">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TeamGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <TeamCardSkeleton key={i} />)}
    </div>
  );
}
