/* Calibration Explanation Modal - Explains why a drill was calibrated */
import React from "react";

export const CalibrationModal: React.FC = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div className={isOpen ? "fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4" : "hidden"} aria-modal="true">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
            <h4 className="font-title-md text-title-md font-semibold text-on-surface">Why This Drill Was Calibrated</h4>
          </div>
          <button className="text-on-surface-variant hover:text-on-surface" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          <p>
            Synapse Learn continuously maps your conceptual ontology graph. At 21:14 yesterday during the
            <strong>Calculus Problem Set 03</strong>, you committed 3 consecutive intermediate variable omissions on composite derivative chains.
          </p>
          <div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">Ontology Node Impact:</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">• Direct prerequisite for Stokes' Theorem & Divergence Theorem</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">• 42% weighted likelihood on upcoming Midterm 2 (Question type 3B)</p>
          </div>
          <p>
            Completing this 15-minute sequence is forecasted to elevate your predicted exam score by
            <strong>+7.4 percentage points</strong>.
          </p>
        </div>
        <div className="flex justify-end gap-space-sm pt-space-xs">
          <button className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold" onClick={onClose}>
            Begin 15-Min Session Now
          </button>
        </div>
      </div>
    </div>
  );
};