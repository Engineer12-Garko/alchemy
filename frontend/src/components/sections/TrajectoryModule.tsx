import { CourseMetric, TrajectoryPoint } from '../../types/analytics';
import { Card, CardContent } from '../ui';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { TrajectoryChart, CourseComparisonBars } from '../charts';

interface TrajectoryModuleProps {
  courses: CourseMetric[];
  trajectoryData: TrajectoryPoint[];
}

export function TrajectoryModule({ courses, trajectoryData }: TrajectoryModuleProps) {
  const activeCourse = courses.find(c => c.id === 'math201');

  return (
    <Card variant="default" padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Mastery Trajectories vs. Benchmarks</span>
            <Badge variant="default" size="sm">Weeks 1-8</Badge>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Empirical progress curves derived from continuous cognitive probe evaluations.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `var(--color-${course.color})` }}
              />
              <span className="font-label-sm text-label-sm" style={{ color: course.id === activeCourse?.id ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>
                {course.shortName}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-outline" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Target</span>
          </div>
        </div>
      </div>

      <TrajectoryChart data={trajectoryData} courses={courses} />

      <CourseComparisonBars courses={courses} />
    </Card>
  );
}