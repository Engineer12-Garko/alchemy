import { RetentionItem } from '../../types/analytics';
import { Card, CardContent } from '../ui';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface RetentionModuleProps {
  items: RetentionItem[];
}

export function RetentionModule({ items }: RetentionModuleProps) {
  const getStatusConfig = (status: RetentionItem['status']) => {
    switch (status) {
      case 'critical':
        return { label: 'Critical (< 85%)', dotColor: 'var(--color-error)', badgeVariant: 'error' as const };
      case 'scheduled':
        return { label: 'Repetition Scheduled', dotColor: 'var(--color-secondary)', badgeVariant: 'success' as const };
      case 'consolidated':
        return { label: 'Consolidated', dotColor: 'var(--color-surface-tint)', badgeVariant: 'default' as const };
    }
  };

  const getActionButton = (item: RetentionItem) => {
    switch (item.action) {
      case 'reinforce':
        return (
          <Button variant="outline" size="sm" leftIcon={<Icon name="arrow_forward" size="sm" />}>
            Reinforce
          </Button>
        );
      case 'preview':
        return (
          <Button variant="ghost" size="sm">Preview Flash</Button>
        );
      case 'menu':
        return (
          <Button variant="ghost" size="sm" className="p-2">
            <Icon name="more_vert" size="md" />
          </Button>
        );
    }
  };

  return (
    <Card variant="default" padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Ebbinghaus Memory Retention Decay Model</span>
            <Badge variant="success" size="sm">Active Algorithmic Pacing</Badge>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Predicted neural recall degradation. Items automatically schedule remediation prior to the 85% safety boundary.
          </p>
        </div>
        <Button
          variant="secondary"
          size="md"
          leftIcon={<Icon name="bolt" size="md" />}
          className="shrink-0 shadow-sm"
        >
          Launch Spaced Session (12m)
        </Button>
      </div>

      {/* Retention Threshold Status Bar */}
      <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Icon name="science" size="lg" color="secondary" />
          <span className="font-label-md text-label-md font-semibold text-on-surface">Half-life Decay Stabilization</span>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
          {(['critical', 'scheduled', 'consolidated'] as const).map((status) => {
            const config = getStatusConfig(status);
            return (
              <span key={status} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dotColor }} />
                {config.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Scheduled Review Items */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `var(--color-${item.iconColor})`, color: `var(--color-${item.iconColor.replace('-container', '') || 'on-error-container'})` }}
              >
                <Icon name={item.icon} size="sm" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">{item.concept}</span>
                  <Badge variant={getStatusConfig(item.status).badgeVariant} size="sm">
                    {item.daysUntilDue === 0 ? 'Due Today' : `Due in ${item.daysUntilDue} days`} · {item.recall}% Recall
                  </Badge>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {item.course} · {item.interval} · {item.lastAccessed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Memory Index</span>
                <span className="font-title-md text-title-md font-bold" style={{ color: item.status === 'critical' ? 'var(--color-error)' : 'var(--color-on-surface)' }}>
                  {item.recall}%
                </span>
              </div>
              {getActionButton(item)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}