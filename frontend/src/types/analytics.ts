export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
    icon: string;
  };
  status?: {
    label: string;
    variant: 'optimal' | 'warning' | 'critical';
  };
  progress: number;
  benchmark?: string;
  rank?: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  progressColor: string;
}

export interface CourseMetric {
  id: string;
  name: string;
  shortName: string;
  mastery: number;
  color: string;
  progressColor: string;
  subject: string;
}

export interface TrajectoryPoint {
  week: number;
  math201: number;
  cs240: number;
  econ102: number;
  target: number;
}

export interface RetentionItem {
  id: string;
  concept: string;
  course: string;
  recall: number;
  status: 'critical' | 'scheduled' | 'consolidated';
  daysUntilDue: number;
  lastAccessed: string;
  interval: string;
  successfulRecalls?: number;
  action: 'reinforce' | 'preview' | 'menu';
  icon: string;
  iconColor: string;
  badgeColor: string;
}

export interface PrerequisiteStep {
  id: number;
  name: string;
  source: string;
  mastery: number;
  status: 'solid' | 'resolved' | 'current';
  description?: string;
  target?: string;
}

export interface MisconceptionItem {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  occurrences: string;
  description: string;
  status: 'in-remediation' | 'drill-queued' | 'resolved';
  codeExample?: string;
}

export interface ExamGap {
  id: string;
  topic: string;
  impact: string;
  studyTime: string;
  course: string;
}

export interface ExamProjection {
  course: string;
  examName: string;
  daysUntil: number;
  projectedRange: string;
  confidenceInterval: string;
  gradeTier: string;
  gaps: ExamGap[];
}

export interface DashboardData {
  kpis: KPIMetric[];
  courses: CourseMetric[];
  trajectoryPoints: TrajectoryPoint[];
  retentionItems: RetentionItem[];
  prerequisiteSteps: PrerequisiteStep[];
  misconceptions: MisconceptionItem[];
  examProjection: ExamProjection;
  modelCalibration: {
    lastUpdated: string;
    pearsonR: number;
  };
  activeDataPoints: number;
}

export interface TabType {
  id: string;
  label: string;
}

export interface DisciplineFilter {
  id: string;
  label: string;
  isActive: boolean;
  courseId?: string;
}