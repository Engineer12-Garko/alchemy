/* Live Study Lens Quick Launch Card - AI inspection of uploaded materials */
import React from "react";

export const LiveStudyLensCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">center_focus_strong</span>
          </div>
          <div>
            <h4 className="font-title-md text-title-md text-on-surface font-semibold">Live Study Lens</h4>
            <p className="font-label-sm text-label-sm text-secondary font-medium">Multimodal AI Inspection</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" title="Engine Active"></span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Drop lecture slide screenshots, handwritten proof steps, or typed notebook notes for instant gap diagnostics.
      </p>
      {/* Dropzone interactive placeholder */}
      <div className="rounded-xl p-space-md bg-surface-container-low flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-surface-container transition-all" id="lens-dropzone">
        <span className="material-symbols-outlined text-secondary text-[28px]">cloud_upload</span>
        <div>
          <p className="font-label-md text-label-md font-medium text-on-surface">Drag slide or paste proof</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">PDF, PNG, JPG, or LaTeX snippets</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant">Synced with MATH 201 syllabus</span>
        <button className="font-label-sm text-label-sm text-secondary font-semibold hover:underline flex items-center gap-0.5">
          Open Canvas <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </button>
      </div>
    </div>
  );
};