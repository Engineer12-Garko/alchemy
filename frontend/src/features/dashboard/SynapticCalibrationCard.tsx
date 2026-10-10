/* Synaptic Calibration Card - Main action card with adaptive drill recommendation */
import React from "react";

export const SynapticCalibrationCard: React.FC = () => {
  return (
    <section className="relative w-full rounded-xl bg-primary-container text-on-primary overflow-hidden shadow-md">
      {/* Ambient subtle geometric grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative p-space-lg xl:p-space-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
        <div className="max-w-3xl flex flex-col lg:flex-col gap-space-sm">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              CALIBRATED AI RECOMMENDATION
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim">MATH 201 • Multivariable Calculus</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-primary tracking-tight font-semibold">
            Chain Rule in Multivariable Calculus: 15-Minute Adaptive Drill
          </h2>
          <p className="font-body-md text-body-md text-primary-fixed-dim leading-relaxed">
            Calibrated specifically from yesterday's error vector in nested partial derivatives. Target composite parameterizations
            <code className="px-1.5 py-0.5 rounded bg-surface-container-lowest/10 text-secondary-fixed text-label-sm font-mono font-medium">f(x(t), y(t))</code>
            to stabilize divergence theorem baseline comprehension prior to Friday's graded assessment.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-space-sm w-full lg:w-auto shrink-0">
          <button className="px-6 py-3 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm" id="resume-drill-btn">
            <span>Resume Session</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button className="px-3 py-1.5 rounded text-primary-fixed-dim hover:text-on-primary font-label-sm text-label-sm transition-colors flex items-center justify-center gap-1" id="open-calibration-modal">
            <span className="material-symbols-outlined text-[15px]">info</span>
            Why this was picked
          </button>
        </div>
      </div>
    </section>
  );
};