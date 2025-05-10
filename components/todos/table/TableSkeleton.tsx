"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex items-center h-10 border-b">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full mr-4" />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center h-16 border-b">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-full mr-4" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
