/* Hero Status Bar - Top section with term info, streak, user name, and academic details */
import React from "react";

export const HeroStatusBar: React.FC = () => {
  return (
    <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
      <div className="flex flex-col gap-space-xs max-w-2xl">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-label-sm">
            TERM 4 • MID-SEMESTER INTENSIVE
          </span>
          <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
            <span className="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">bolt</span>
            12 Days Active Streak
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Good morning, Elena
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Junior • Semester 2 • BSc Computer Science & Mathematics • Honor Track
        </p>
      </div>
    </section>
  );
};