/* Priority Diagnostic Alert Card - High-yield diagnostic gap alert */
import React from "react";

export const PriorityDiagnosticAlert: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border-l-4 border-l-error flex flex-col gap-space-md">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-error font-semibold tracking-wider uppercase">High-Yield Diagnostic Gap</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">• MATH 201 Vector Calculus</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Partial Derivatives: Chain vs Product Rule Substitution
            </h4>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
          -18% Error Cluster
        </span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Recurring variable confusion detected in composite functions <span className="font-mono bg-surface-container-low px-1.5 py-0.5 rounded text-on-surface">f(x(t), y(t))</span>. 
        You applied direct total differential terms rather than inner derivative chains across 3 consecutive practice sets. Correcting this conceptual boundary now avoids persistent score erosion on Friday's Divergence Theorem exam.
      </p>
      {/* Citation & Formula Visual Block */}
      <div className="p-space-md rounded-lg bg-surface-container-low flex items-start gap-space-md">
        <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">functions</span>
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">Target Disentanglement Formula</span>
          <span className="font-mono text-body-sm text-body-sm text-on-surface">
            ∂f/∂t = (∂f/∂x · dx/dt) + (∂f/∂y · dy/dt) ≠ (∂f/∂x + ∂f/∂y)(dx/dt + dy/dt)
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
          <span>Target completion: 4 minutes • Adaptive 3-question sequence</span>
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-error text-on-error font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          Run 4-Minute Targeted Disentangler
        </button>
      </div>
    </div>
  );
};