import type { ExamProjection, ExamGap } from '../../types/analytics';
import { Card } from '../ui';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface ExamPreparednessProps {
  projection: ExamProjection;
}

export function ExamPreparedness({ projection }: ExamPreparednessProps) {
  return (
    <Card variant="default" padding="lg" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Midterm Preparedness Audit</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Simulated exam scoring projection based on Bayesian competency engine.</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center">
          <Icon name="assignment_turned_in" size="md" color="primary-container" />
        </div>
      </div>

      {/* Exam Countdown & Projected Score Banner */}
      <div className="p-4 rounded-xl bg-primary-container text-on-primary flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider" style={{ color: 'var(--color-secondary-fixed)' }}>
              {projection.course} {projection.examName}
            </span>
            <Badge variant="default" size="sm" className="bg-surface-container-lowest/20">
              In {projection.daysUntil} Days
            </Badge>
          </div>
          <span className="font-headline-md text-headline-md font-bold mt-1">Projected: {projection.projectedRange}</span>
          <span className="font-body-sm text-body-sm" style={{ color: 'var(--color-on-primary-container)' }}>Confidence interval: {projection.confidenceInterval}</span>
        </div>
        <div className="text-right">
          <span className="font-label-sm text-label-sm block" style={{ color: 'var(--color-secondary-fixed)' }}>Grade Tier</span>
          <span className="font-headline-lg text-headline-lg font-bold text-on-primary">{projection.gradeTier}</span>
        </div>
      </div>

      {/* Prioritized Topics to Close Score Gap */}
      <div className="flex flex-col gap-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
          Remaining High-Yield Gaps ({projection.gaps.length} prioritized):
        </span>
        {projection.gaps.map((gap: ExamGap) => (
          <div key={gap.id} className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="radio_button_checked" size="sm" color="secondary" />
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-semibold text-on-surface">{gap.topic}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{gap.impact} · {gap.studyTime}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm">Prep Module</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}