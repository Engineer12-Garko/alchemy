import { TabType, DisciplineFilter } from '../../types/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface HeaderProps {
  tabs: TabType[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  filters: DisciplineFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  modelCalibration: { lastUpdated: string; pearsonR: number };
}

export function Header({
  tabs,
  activeTab,
  onTabChange,
  filters,
  activeFilter,
  onFilterChange,
  modelCalibration,
}: HeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb & Page Header */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Progress & Insights</span>
          <span className="text-on-surface-variant font-label-sm text-label-sm">/</span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">Academic Performance Analytics</span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Academic Progress & Cognitive Analytics</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Empirical mastery trajectories, retention decay models, and prerequisite recovery velocity based on{' '}
              <span className="font-semibold text-on-surface">187 active learning data points</span> across enrolled modules.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="md" leftIcon={<Icon name="file_download" size="sm" />}>
              Export Audit Dossier
            </Button>
            <Button variant="primary" size="md" leftIcon={<Icon name="sync_saved_locally" size="sm" />}>
              Recalculate Bayesian Prior
            </Button>
          </div>
        </div>
      </div>

      {/* Local Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-surface-container mt-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 shrink-0" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-label-md text-label-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="hidden xl:flex items-center gap-2 text-on-surface-variant">
          <Icon name="verified" size="sm" color="secondary" />
          <span className="font-label-sm text-label-sm font-medium">
            Model calibrated {modelCalibration.lastUpdated} · Pearson r = {modelCalibration.pearsonR}
          </span>
        </div>
      </div>

      {/* Discipline Scope Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider mr-1">Discipline Scope:</span>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors flex items-center gap-1.5 ${
              filter.isActive
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {filter.isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}