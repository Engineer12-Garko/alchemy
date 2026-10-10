import { MisconceptionItem } from '../../types/analytics';
import { Card } from '../ui';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface MisconceptionAuditProps {
  items: MisconceptionItem[];
}

export function MisconceptionAudit({ items }: MisconceptionAuditProps) {
  const openCount = items.filter(i => i.status !== 'resolved').length;

  const getPriorityConfig = (priority: MisconceptionItem['priority']) => {
    switch (priority) {
      case 'high':
        return { variant: 'error' as const, dotColor: 'var(--color-error)' };
      case 'medium':
        return { variant: 'default' as const, dotColor: 'var(--color-on-surface)' };
      case 'low':
        return { variant: 'info' as const, dotColor: 'var(--color-primary)' };
    }
  };

  const getStatusConfig = (status: MisconceptionItem['status']) => {
    switch (status) {
      case 'in-remediation':
        return { label: 'In Remediation', variant: 'outline' as const, color: 'primary-container' };
      case 'drill-queued':
        return { label: 'Drill Queued', variant: 'secondary' as const, color: 'secondary' };
      case 'resolved':
        return { label: 'Resolved', variant: 'success' as const, color: 'secondary' };
    }
  };

  return (
    <Card variant="default" padding="lg" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Recurring Misconception Audit</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Systemic error pattern classifications detected by LLM diagnostics.</p>
        </div>
        <span className="font-label-sm text-label-sm text-error font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-error" />
          {openCount} Open
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-title-md text-title-md font-semibold text-on-surface">{item.name}</span>
                  <Badge
                    variant={getPriorityConfig(item.priority).variant}
                    size="sm"
                    dot
                    dotColor={getPriorityConfig(item.priority).dotColor}
                  >
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                  </Badge>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{item.occurrences}</span>
              </div>
              <Badge variant={getStatusConfig(item.status).variant} size="sm" className="shrink-0">
                {getStatusConfig(item.status).label}
              </Badge>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {item.description}
              {item.codeExample && (
                <code className="font-code-inline ml-1">{item.codeExample}</code>
              )}
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-surface-container">
              <Button variant="outline" size="sm" className="shadow-sm">
                Inspect Diagnostic Evidence
              </Button>
              <Button variant="default" size="sm">
                Practise Remedial Twin
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}