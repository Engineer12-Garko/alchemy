import { TrajectoryPoint, CourseMetric } from '../../types/analytics';

interface TrajectoryChartProps {
  data: TrajectoryPoint[];
  courses: CourseMetric[];
  selectedCourse?: string;
  height?: number;
  showAnnotations?: boolean;
}

export function TrajectoryChart({
  data,
  courses,
  height = 280,
  showAnnotations = true,
}: TrajectoryChartProps) {
  // Calculate chart dimensions
  const padding = { left: 60, right: 20, top: 20, bottom: 40 };
  const chartWidth = 600;
  const chartHeight = 220;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Find min/max values for Y axis
  const allValues = data.flatMap(d => [d.math201, d.cs240, d.econ102, d.target]);
  const maxValue = Math.max(...allValues, 100);
  const minValue = Math.min(...allValues, 0);

  // Scale functions
  const xScale = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth;
  const yScale = (value: number) => padding.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;

  // Generate path data for a course
  const generatePath = (courseKey: keyof TrajectoryPoint) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[courseKey] as number)}`).join(' ');
  };

  const targetPath = generatePath('target');
  const mathPath = generatePath('math201');
  const csPath = generatePath('cs240');
  const econPath = generatePath('econ102');

  // Generate area path for MATH 201 (filled)
  const mathAreaPath = [
    `M ${xScale(0)} ${yScale(data[0].math201)}`,
    ...data.slice(1).map((d, i) => `L ${xScale(i + 1)} ${yScale(d.math201)}`),
    `L ${xScale(data.length - 1)} ${padding.top + innerHeight}`,
    `L ${xScale(0)} ${padding.top + innerHeight}`,
    'Z',
  ].join(' ');

  const mathColor = courses.find(c => c.id === 'math201')?.color || 'secondary';
  const csColor = courses.find(c => c.id === 'cs240')?.color || 'primary-container';
  const econColor = courses.find(c => c.id === 'econ102')?.color || 'on-surface-variant';

  // Intervention points (week 4-5 dip and recovery)
  const interventionWeek = 4; // 0-indexed week 4 = week 5
  const recoveryWeek = 5;

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 px-2">
        {[100, 80, 60, 40, 20].map((val) => (
          <div key={val} className="w-full border-b border-outline-variant flex justify-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant -mt-2.5 bg-background px-1">{val}%</span>
          </div>
        ))}
      </div>

      <svg
        className="w-full h-full relative z-10 overflow-visible"
        preserveAspectRatio="none"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ height: `${chartHeight}px` }}
      >
        <defs>
          <linearGradient id="mathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`var(--color-${mathColor})`} stopOpacity="0.25" />
            <stop offset="100%" stopColor={`var(--color-${mathColor})`} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Cohort Target Line (Dashed) */}
        <path
          d={targetPath}
          fill="none"
          stroke="var(--color-outline)"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />

        {/* ECON 102 Line */}
        <path
          d={econPath}
          fill="none"
          stroke={`var(--color-${econColor})`}
          strokeWidth="2.5"
        />

        {/* CS 240 Line */}
        <path
          d={csPath}
          fill="none"
          stroke={`var(--color-${csColor})`}
          strokeWidth="2.5"
        />

        {/* MATH 201 Shaded Area under Curve */}
        <path
          d={mathAreaPath}
          fill="url(#mathGradient)"
        />

        {/* MATH 201 Main Curve */}
        <path
          d={mathPath}
          fill="none"
          stroke={`var(--color-${mathColor})`}
          strokeWidth="3"
        />

        {/* Annotation Markers for Intervention (W5) and Recovery */}
        {showAnnotations && (
          <>
            {/* Intervention point - dip */}
            <circle
              cx={xScale(interventionWeek)}
              cy={yScale(data[interventionWeek].math201)}
              fill="var(--color-error)"
              r="5"
              stroke="white"
              strokeWidth="2"
            />
            {/* Recovery point */}
            <circle
              cx={xScale(recoveryWeek)}
              cy={yScale(data[recoveryWeek].math201)}
              fill={`var(--color-${mathColor})`}
              r="5"
              stroke="white"
              strokeWidth="2"
            />
            {/* Current point */}
            <circle
              cx={xScale(data.length - 1)}
              cy={yScale(data[data.length - 1].math201)}
              fill={`var(--color-${mathColor})`}
              r="5"
              stroke="white"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {/* Diagnostic Callout Overlay */}
      {showAnnotations && (
        <div className="absolute left-[54%] top-[45%] -translate-x-1/2 p-2 rounded-lg bg-surface-container-lowest shadow-md flex items-center gap-2 border border-surface-container">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">Diagnostic Intervention (W5)</span>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Chain Rule Remediation: +26% rebound</span>
          </div>
        </div>
      )}

      {/* X-axis Timeline Labels */}
      <div className="w-full flex justify-between px-2 pt-1 border-t border-surface-container font-label-sm text-label-sm text-on-surface-variant">
        {data.map((_, i) => (
          <span key={i} style={{ width: `${100 / (data.length - 1)}%`, textAlign: i === 0 ? 'left' : i === data.length - 1 ? 'right' : 'center' }}>
            {i === 3 ? 'Wk 4' : i === 4 ? 'Wk 5 (Intervention)' : i === data.length - 1 ? `Wk ${i + 1} (Current)` : `Wk ${i + 1}`}
          </span>
        ))}
      </div>
    </div>
  );
}