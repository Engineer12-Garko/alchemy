/* Study Pace & Deadlines - Weekly distribution and upcoming exam countdown */
import React from "react";

export const StudyPaceDeadlines: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <h3 className="font-title-md text-title-md text-on-surface font-semibold">Study Pace & Deadlines</h3>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">event_note</span>
      </div>

      {/* Weekly Study Distribution Chart */}
      <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Daily Hours Distributed</span>
          <span className="font-label-sm text-label-sm font-semibold text-secondary">3.7 hrs/day avg</span>
        </div>

        {/* Weekly SVG Histogram */}
        <div className="h-24 w-full flex items-end justify-between pt-2 px-1">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-highest rounded-t-sm" style="height: 48px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">M</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-highest rounded-t-sm" style="height: 64px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">T</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-highest rounded-t-sm" style="height: 52px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">W</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-secondary rounded-t-sm" style="height: 78px;"></div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">T</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-highest rounded-t-sm" style="height: 40px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">F</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-high rounded-t-sm" style="height: 20px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">S</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 bg-surface-container-high rounded-t-sm" style="height: 16px;"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">S</span>
          </div>
        </div>
      </div>

      {/* Upcoming Exam Countdown Mini Timeline */}
      <div className="flex flex-col gap-2.5">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Crucial Milestones</span>
        <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-error"></div>
            <div>
              <p className="font-label-md text-label-md font-semibold text-on-surface">MATH 201 Midterm 2</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Integrals & Divergence Theorem</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-label-sm font-bold text-error">6 Days</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Oct 24</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <div>
              <p className="font-label-md text-label-md font-semibold text-on-surface">CS 240 Lab 04 Due</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Graph Traversals & Benchmarks</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">9 Days</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Oct 27</p>
          </div>
        </div>
      </div>
    </div>
  );
};