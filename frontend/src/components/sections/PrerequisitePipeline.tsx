import { PrerequisiteStep } from '../../types/analytics';
import { Card } from '../ui';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface PrerequisitePipelineProps {
  steps: PrerequisiteStep[];
}

export function PrerequisitePipeline({ steps }: PrerequisitePipelineProps) {
  const getStatusConfig = (status: PrerequisiteStep['status']) => {
    switch (status) {
      case 'solid':
        return { bg: 'bg-secondary', text: 'text-on-secondary', label: 'Solid', badgeColor: 'secondary-container', badgeText: 'on-secondary-container' };
      case 'resolved':
        return { bg: 'bg-primary-container', text: 'text-on-primary', label: 'Resolved', badgeColor: 'secondary-container', badgeText: 'on-secondary-container' };
      case 'current':
        return { bg: 'bg-surface-tint', text: 'text-on-primary', label: 'Current', badgeColor: 'surface-container-highest', badgeText: 'primary-container' };
    }
  };

  return (
    <Card variant="default" padding="lg" className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Prerequisite Recovery Pipeline</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Cognitive bottleneck resolution in MATH 201 chain rules.</p>
        </div>
        <Badge variant="success" size="sm">+34% Accuracy Lift</Badge>
      </div>

      {/* Prerequisite Flow Visualization */}
      <div className="flex flex-col gap-2 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col gap-1">
            <div
              className={`p-3.5 rounded-lg flex items-center justify-between ${
                step.status === 'resolved' ? 'bg-surface-container-high' : 'bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold"
                  style={{
                    backgroundColor: `var(--color-${getStatusConfig(step.status).bg.replace('bg-', '')})`,
                    color: `var(--color-${getStatusConfig(step.status).text.replace('text-', '')})`,
                  }}
                >
                  {step.id}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">{step.name}</span>
                    {step.status === 'resolved' && (
                      <span className="px-1.5 py-0.2 rounded bg-secondary text-on-secondary text-[10px] font-bold">RESOLVED</span>
                    )}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {step.status === 'solid' ? step.source : step.status === 'resolved' ? step.source : step.target}
                  </span>
                </div>
              </div>
              <Badge
                variant="default"
                size="sm"
                className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold"
                style={{
                  backgroundColor: `var(--color-${getStatusConfig(step.status).badgeColor})`,
                  color: `var(--color-${getStatusConfig(step.status).badgeText})`,
                }}
              >
                {step.status === 'current' && step.target ? `${step.mastery}% → ${step.target}` : `${step.mastery}% ${step.status === 'solid' ? 'Solid' : ''}`}
              </Badge>
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center -my-1 text-on-surface-variant">
                <Icon name="south" size="sm" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remediation Insight Box */}
      <div className="p-4 rounded-lg bg-surface-container-low flex items-start gap-3">
        <Icon name="tips_and_updates" size="md" color="secondary" className="mt-0.5 shrink-0" />
        <p className="font-body-sm text-body-sm text-on-surface">
          <span className="font-semibold text-on-surface">Remediation Insight:</span>{' '}
          Overcoming the tree diagram representation bottleneck increased quiz composite derivative accuracy by{' '}
          <span className="text-secondary font-bold">+34%</span> on Tuesday's practice batch.
        </p>
      </div>
    </Card>
  );
}