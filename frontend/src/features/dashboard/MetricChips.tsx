/* Metric Chips - GPA Velocity, Mastery Velocity, Weekly Focus chips */
import React from "react";

export const MetricChips: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
      {/* GPA Velocity */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cum. GPA</span>
          <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-headline-md text-headline-md text-on-surface font-bold">3.82</span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">Top 4%</span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Cohort benchmark ↑ 0.08</span>
      </div>

      {/* Mastery Velocity */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Mastery Velocity</span>
          <span className="material-symbols-outlined text-secondary text-[18px]">cached</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-headline-md text-headline-md text-on-surface font-bold">94%</span>
          <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant font-semibold">Retention</span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">3 concepts ready for review</span>
      </div>

      {/* Weekly Focus Clock */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Weekly Focus</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-headline-md text-headline-md text-on-surface font-bold">18.5</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">/ 22 hrs</span>
        </div>
        {/* Micro progress track */}
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1.5">
          <div className="bg-primary-container h-full rounded-full" style="width: 84%;"></div>
        </div>
      </div>
    </div>
  );
};