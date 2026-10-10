/* Cognitive 5-Stage Pedagogical Cycle Banner - Shows learning progression across courses */
import React from "react";

export const CognitiveProgressionBanner: React.FC = () => {
  return (
    <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">Cognitive Learning Progression Cycle</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time pedagogical loop status across enrolled academic curricula</p>
        </div>
        <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> Current State</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-container-high"></span> Pending Gate</span>
        </div>
      </div>

      {/* Active Progression Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
        {/* Course 1: MATH 201 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-semibold text-on-surface">MATH 201: Multivar Calc</span>
            <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Stage 4: Practise</span>
          </div>
          {/* 5 Nodes Pipeline */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div className="h-1.5 rounded-full bg-secondary" title="Assess: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Diagnose: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Teach: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary animate-pulse" title="Practise: Active"></div>
            <div className="h-1.5 rounded-full bg-surface-container-high" title="Adapt: Pending"></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Focus: Multivariable chain formulation drills</span>
        </div>

        {/* Course 2: CS 240 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-semibold text-on-surface">CS 240: Data Structures</span>
            <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">Stage 5: Adapt</span>
          </div>
          {/* 5 Nodes Pipeline */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div className="h-1.5 rounded-full bg-secondary" title="Assess: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Diagnose: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Teach: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Practise: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Adapt: Active Synthesis"></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Focus: Self-balancing binary tree proofs</span>
        </div>

        {/* Course 3: ECON 102 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-semibold text-on-surface">ECON 102: Macro Theory</span>
            <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Stage 3: Teach</span>
          </div>
          {/* 5 Nodes Pipeline */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div className="h-1.5 rounded-full bg-secondary" title="Assess: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary" title="Diagnose: Complete"></div>
            <div className="h-1.5 rounded-full bg-secondary animate-pulse" title="Teach: Active Interactive Review"></div>
            <div className="h-1.5 rounded-full bg-surface-container-high" title="Practise: Pending"></div>
            <div className="h-1.5 rounded-full bg-surface-container-high" title="Adapt: Pending"></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Focus: Fiscal stimulus curves under inflation spikes</span>
        </div>
      </div>
    </section>
  );
};