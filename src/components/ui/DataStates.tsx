"use client";

import { Inbox, AlertTriangle, RotateCcw } from "lucide-react";

/**
 * EmptyState — shown when a section has no data from the API.
 */
export function EmptyState({ title = "Нет данных", description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-8 h-8 text-[var(--text-muted)] mb-4" strokeWidth={1} />
      <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
      {description && <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>}
    </div>
  );
}

/**
 * ErrorState — shown when an API call fails. Includes retry button.
 */
export function ErrorState({ onRetry, message = "Не удалось загрузить" }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="w-8 h-8 text-red-400/60 mb-4" strokeWidth={1} />
      <p className="text-sm text-[var(--text-secondary)] font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 mt-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Повторить
        </button>
      )}
    </div>
  );
}

/**
 * Skeleton — shimmer loading placeholder.
 * Variants: text (single line), card (block), faq (accordion rows), team (avatar cards)
 */
function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`bg-[var(--bg-card-hover)] animate-pulse ${className}`} />;
}

export function SkeletonFAQ() {
  return (
    <div className="space-y-3 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-5">
          <SkeletonLine className="h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTeam() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-4 space-y-3">
          <SkeletonLine className="w-12 h-12 rounded-full" />
          <SkeletonLine className="h-3 w-2/3 rounded" />
          <SkeletonLine className="h-2 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 w-full">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-6 space-y-3">
          <SkeletonLine className="h-4 w-1/3 rounded" />
          <SkeletonLine className="h-3 w-full rounded" />
          <SkeletonLine className="h-3 w-2/3 rounded" />
        </div>
      ))}
    </div>
  );
}
