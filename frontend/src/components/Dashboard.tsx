import { useState } from 'react';
import { DashboardData, TabType, DisciplineFilter } from '../types/analytics';
import { Header } from './layout';
import {
  KPICardGrid,
  TrajectoryModule,
  RetentionModule,
  PrerequisitePipeline,
  MisconceptionAudit,
  ExamPreparedness,
} from './sections';

interface DashboardProps {
  data: DashboardData;
  tabs: TabType[];
  filters: DisciplineFilter[];
}

export function Dashboard({ data, tabs, filters }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('math201');

  const filteredCourses = data.courses.filter(c => activeFilter === 'all' || c.id === activeFilter);
  const filteredTrajectory = data.trajectoryPoints;
  const filteredRetention = data.retentionItems.filter(
    item => activeFilter === 'all' || item.course.toLowerCase().replace(' ', '') === activeFilter
  );
  const filteredPrerequisites = data.prerequisiteSteps;
  const filteredMisconceptions = data.misconceptions;
  const filteredExam = activeFilter === 'math201' || activeFilter === 'all' ? data.examProjection : null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-8 px-4">
      <Header
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        modelCalibration={data.modelCalibration}
      />

      {/* Top KPI Metric Cards */}
      <KPICardGrid metrics={data.kpis} />

      {/* Main 2-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (60% width -> 7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Mastery Trajectories */}
          <TrajectoryModule courses={filteredCourses} trajectoryData={filteredTrajectory} />

          {/* Retention & Spaced Repetition */}
          <RetentionModule items={filteredRetention} />
        </div>

        {/* RIGHT COLUMN (40% width -> 5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Prerequisite Recovery Pipeline */}
          <PrerequisitePipeline steps={filteredPrerequisites} />

          {/* Misconception Audit */}
          <MisconceptionAudit items={filteredMisconceptions} />

          {/* Exam Preparedness */}
          {filteredExam && <ExamPreparedness projection={filteredExam} />}
        </div>
      </div>
    </div>
  );
}