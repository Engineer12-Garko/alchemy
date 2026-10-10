import type { CourseMetric } from '../../types/analytics';

interface CourseComparisonBarsProps {
  courses: CourseMetric[];
}

export function CourseComparisonBars({ courses }: CourseComparisonBarsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 pt-2">
      {courses.map((course) => (
        <div key={course.id} className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">{course.shortName}</span>
            <span className="font-label-sm text-label-sm font-bold" style={{ color: `var(--color-${course.progressColor})` }}>
              {course.mastery}%
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{course.subject}</span>
          <div className="w-full h-1 rounded-full bg-surface-container mt-1">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${course.mastery}%`,
                backgroundColor: `var(--color-${course.progressColor})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}