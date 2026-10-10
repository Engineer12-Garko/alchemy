/* Active Course Ecosystem - Shows enrolled courses with mastery progress */
import React from "react";

export const ActiveCourseEcosystem: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Course Ecosystem</h3>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-medium">3 Enrolled</span>
        </div>
        <a className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1 font-semibold" href="#">
          All Curriculum Maps <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-space-md">
        {/* COURSE CARD 1: MATH 201 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary font-headline-sm font-bold shrink-0">
                M
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-md text-label-md font-bold text-on-surface">MATH 201</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">• Multivariable Calculus</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Prof. Lawrence Mitchell • Science Hall 304</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_clock</span>
                Midterm in 6d
              </span>
              <span className="px-2 py-1 rounded bg-error/10 text-error font-label-sm text-label-sm font-semibold">
                2 Concept Gaps
              </span>
            </div>
          </div>
          {/* Quantitative Mastery & Trajectory */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Syllabus Mastery Index</span>
              <span className="text-on-surface font-semibold">68% / 100% (Target 85% by Exam)</span>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style="width: 68%;"></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
              <span>Next Milestones: Lagrange Multipliers • Green's Theorem</span>
              <span className="text-error font-medium">Calculus Drill Required</span>
            </div>
          </div>
          {/* Quick Action Row */}
          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <button className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">neurology</span>
              Jump to AI Tutor
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Practice Drill
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              View Syllabus Map
            </button>
          </div>
        </div>

        {/* COURSE CARD 2: CS 240 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary font-headline-sm font-bold shrink-0">
                C
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-md text-label-md font-bold text-on-surface">CS 240</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">• Data Structures & Algorithms</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Prof. Arvind Sen • Turing Commons 110</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Module 7 of 10
              </span>
              <span className="px-2 py-1 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                Trees & Graphs Solid
              </span>
            </div>
          </div>
          {/* Quantitative Mastery & Trajectory */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Syllabus Mastery Index</span>
              <span className="text-on-surface font-semibold">84% / 100%</span>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style="width: 84%;"></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
              <span>Current Unit: Dijkstra • Bellman-Ford Shortest Paths</span>
              <span className="text-secondary font-medium">Assignment 4 due in 9d</span>
            </div>
          </div>
          {/* Quick Action Row */}
          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <button className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">neurology</span>
              Jump to AI Tutor
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              Practice Drill
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              View Syllabus Map
            </button>
          </div>
        </div>

        {/* COURSE CARD 3: ECON 102 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary font-headline-sm font-bold shrink-0">
                E
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-md text-label-md font-bold text-on-surface">ECON 102</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">• Macroeconomic Theory</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Prof. Christine Vance • Memorial Hall 202</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                91% Mastery
              </span>
              <span className="px-2 py-1 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                On Track
              </span>
            </div>
          </div>
          {/* Quantitative Mastery & Trajectory */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Syllabus Mastery Index</span>
              <span className="text-on-surface font-semibold">91% / 100%</span>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style="width: 91%;"></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
              <span>Current Unit: Mundell-Fleming Open Economy Framework</span>
              <span className="text-secondary font-medium">All prerequisite gates cleared</span>
            </div>
          </div>
          {/* Quick Action Row */}
          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <button className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">neurology</span>
              Jump to AI Tutor
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              Practice Drill
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-medium flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              View Syllabus Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};