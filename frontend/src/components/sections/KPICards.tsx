import { KPIMetric } from '../../types/analytics';
import { Card, CardContent } from '../ui';
import { ProgressBar } from '../ui/ProgressBar';
import { Icon } from '../ui/Icon';

interface KPICardProps {
  metric: KPIMetric;
}

export function KPICard({ metric }: KPICardProps) {
  return (
    <Card variant="default" padding="lg" hover className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {metric.label}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {metric.value}
            </span>
            {metric.trend && (
              <span
                className={`font-label-sm text-label-sm font-semibold flex items-center gap-1 ${
                  metric.trend.isPositive ? 'text-secondary' : 'text-error'
                }`}
              >
                <Icon name={metric.trend.icon} size="xs" />
                {metric.trend.value}
              </span>
            )}
            {metric.status && (
              <span
                className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                  metric.status.variant === 'optimal'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : metric.status.variant === 'warning'
                    ? 'bg-tertiary-container text-on-tertiary-fixed'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {metric.status.label}
              </span>
            )}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `var(--color-surface-container-low)`, color: `var(--color-${metric.iconColor})` }}
        >
          <Icon name={metric.icon} size="lg" />
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-1.5">
        <ProgressBar
          value={metric.progress}
          height="md"
          color={`var(--color-${metric.progressColor})`}
          backgroundColor="surface-container"
        />
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>{metric.benchmark || metric.subtitle || ''}</span>
          {metric.rank && <span className="text-on-surface font-medium">{metric.rank}</span>}
        </div>
      </div>
    </Card>
  );
}

interface KPICardGridProps {
  metrics: KPIMetric[];
}

export function KPICardGrid({ metrics }: KPICardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <KPICard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}