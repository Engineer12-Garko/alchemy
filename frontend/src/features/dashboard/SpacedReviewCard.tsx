/* Spaced Review Card - Shows reviews due today with Ebbinghaus algorithm */
import React from "react";

export const SpacedReviewCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">history_edu</span>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">Spaced Review</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
          3 Ready Today
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Optimized by the Ebbinghaus retention algorithm to lock conceptual retrieval before decay.
      </p>
      <div className="flex flex-col gap-space-sm">
        {/* Item 1: MATH 201 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2 hover:bg-surface-container transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">MATH 201 • Calculus</span>
              <h5 className="font-label-md text-label-md text-on-surface font-semibold">Jacobian Determinants</h5>
            </div>
            <span className="font-label-sm text-label-sm text-error font-semibold flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
              Urgent
            </span>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm pt-1">
            <span className="text-on-surface-variant">Last tested: 5 days ago</span>
            <button className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity">
              Review (4m)
            </button>
          </div>
        </div>

        {/* Item 2: CS 240 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2 hover:bg-surface-container transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">CS 240 • Algorithms</span>
              <h5 className="font-label-md text-label-md text-on-surface font-semibold">Red-Black Tree Rotations</h5>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Optimal
            </span>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm pt-1">
            <span className="text-on-surface-variant">Last tested: 12 days ago</span>
            <button className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity">
              Review (3m)
            </button>
          </div>
        </div>

        {/* Item 3: ECON 102 */}
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2 hover:bg-surface-container transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">ECON 102 • Macro</span>
              <h5 className="font-label-md text-label-md text-on-surface font-semibold">IS-LM Model Equilibrium</h5>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
              Routine
            </span>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm pt-1">
            <span className="text-on-surface-variant">Last tested: 18 days ago</span>
            <button className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity">
              Review (5m)
            </button>
          </div>
        </div>
      </div>
      <button className="w-full py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors font-medium">
        Start All Reviews (12m total)
      </button>
    </div>
  );
};