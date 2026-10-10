/* Dashboard Canvas - Two-column layout with main content and sidebar */
import React from "react";
import { HeroStatusBar } from "./HeroStatusBar";
import { MetricChips } from "./MetricChips";
import { SynapticCalibrationCard } from "./SynapticCalibrationCard";
import { CognitiveProgressionBanner } from "./CognitiveProgressionBanner";
import { PriorityDiagnosticAlert } from "./PriorityDiagnosticAlert";
import { ActiveCourseEcosystem } from "./ActiveCourseEcosystem";
import { SpacedReviewCard } from "./SpacedReviewCard";
import { StudyPaceDeadlines } from "./StudyPaceDeadlines";
import { LiveStudyLensCard } from "./LiveStudyLensCard";

export const DashboardCanvas: React.FC = () => {
  return (
    <div className="w-full bg-surface-container-lowest min-h-screen">
      {/* HEADER: Hero status bar + metric chips + calibration card */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
        <HeroStatusBar />
        <MetricChips />
      </div>

      {/* Synaptic Calibration Card */}
      <SynapticCalibrationCard />

      {/* COGNITIVE 5-STAGE PEDAGOGICAL CYCLE BANNER */}
      <CognitiveProgressionBanner />

      {/* TWO-COLUMN DASHBOARD CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full">
        {/* LEFT MAIN COLUMN (WIDE 8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* PRIORITY DIAGNOSTIC ALERT CARD */}
          <PriorityDiagnosticAlert />

          {/* ACTIVE ENROLLED COURSES SECTION */}
          <ActiveCourseEcosystem />
        </div>

        {/* RIGHT SIDEBAR COLUMN (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* SPACED REPETITION DUE TODAY CARD */}
          <SpacedReviewCard />

          {/* WEEKLY STUDY DISTRIBUTION & EXAM COUNTDOWN */}
          <StudyPaceDeadlines />

          {/* LIVE STUDY LENS QUICK LAUNCH CARD */}
          <LiveStudyLensCard />
        </div>
      </div>
    </div>
  );
};