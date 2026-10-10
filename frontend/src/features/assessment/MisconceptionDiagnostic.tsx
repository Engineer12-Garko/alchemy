import { useState, type ReactNode } from 'react';
import './DiagnosisAndGaps.css';

function Icon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {children}
    </span>
  );
}

interface CourseFilter {
  id: string;
  label: string;
  iconColor: string;
  isActive: boolean;
  badge?: string;
}

const courses: CourseFilter[] = [
  { id: 'math201', label: 'MATH 201: Multivariable Calc', iconColor: '#6bd8cb', isActive: true, badge: 'Active' },
  { id: 'cs240', label: 'CS 240: Data Structures', iconColor: '#c5c6cd', isActive: false },
  { id: 'econ102', label: 'ECON 102: Macroeconomics', iconColor: '#c5c6cd', isActive: false },
];

interface EvidenceItem {
  id: string;
  title: string;
  date: string;
  type: string;
  points: string;
  prompt: string;
  audit: string;
}

const evidenceItems: EvidenceItem[] = [
  {
    id: 'quiz4',
    title: 'Quiz #4 · Question 3',
    date: 'Nov 14, 2024 · Timed Assessment',
    type: 'quiz',
    points: '-4.5 pts',
    prompt: 'Prompt asked for ∂w / ∂r where w = ln(x² + y²), x = r cos(θ), y = r sin(θ).',
    audit: 'Dropped line 3 substitution for (∂w/∂y)(∂y/∂r) entirely. Output yielded only 2x / (x²+y²) · cos(θ), terminating the evaluation early.',
  },
  {
    id: 'hw2',
    title: 'Homework 2 · Exercise 5',
    date: 'Nov 08, 2024 · Problem Set',
    type: 'homework',
    points: 'Flagged by TA',
    prompt: 'Derive ∂z / ∂u given z = e^(xy), x = u²v, y = uv².',
    audit: 'Calculated single intermediate node along u via x; omitted second simultaneous intermediate node through y.',
  },
];

interface PrereqNode {
  id: number;
  label: string;
  name: string;
  source: string;
  mastery: number;
  status: 'solid' | 'bottleneck' | 'target';
  progressColor: string;
  progressBg: string;
  badgeColor: string;
  badgeText: string;
  borderColor?: string;
}

const prereqNodes: PrereqNode[] = [
  {
    id: 1,
    label: 'Prerequisite 1',
    name: 'Single-variable Chain Rule',
    source: 'MATH 101 Mastery',
    mastery: 95,
    status: 'solid',
    progressColor: '#006a61',
    progressBg: '#eff4ff',
    badgeColor: '#86f2e4',
    badgeText: '006f66',
  },
  {
    id: 2,
    label: 'Prerequisite 2',
    name: 'Tree Diagrams for Partials',
    source: 'Conceptual bottleneck',
    mastery: 42,
    status: 'bottleneck',
    progressColor: '#ba1a1a',
    progressBg: '#ffdad6',
    badgeColor: '#ffdad6',
    badgeText: '#93000a',
    borderColor: '#ba1a1a',
  },
  {
    id: 3,
    label: 'Target Node',
    name: 'Multivar Composite Rule',
    source: 'MATH 201 Core Goal',
    mastery: 15,
    status: 'target',
    progressColor: '#75777d',
    progressBg: '#d3e4fe',
    badgeColor: '#d3e4fe',
    badgeText: '#75777d',
  },
];

interface MethodStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  isLocked: boolean;
  icon?: string;
}

const methodSteps: MethodStep[] = [
  {
    id: 1,
    title: 'Visual Tree Diagram Walkthrough',
    description: 'Interactive node-canvas: visually drag dependencies from root z through intermediates x, y to leaves s, t.',
    duration: '10 min interactive graph mapping',
    isLocked: false,
    icon: 'play_circle',
  },
  {
    id: 2,
    title: 'Targeted Worked Example',
    description: '5 min · Dual intermediate coordinates (s, t)',
    duration: '5 min · Dual intermediate coordinates (s, t)',
    isLocked: true,
    icon: 'lock',
  },
];

const alternativeModalities = [
  { icon: 'functions', label: 'Algebraic Proof' },
  { icon: 'smart_display', label: '4-Min Animation' },
];

export default function MisconceptionDiagnostic() {
  const [activeCourse, setActiveCourse] = useState('math201');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(expandedEvidence === id ? null : id);
  };

  return (
    <div className="misconception-diagnostic">
      {/* Top Filter & Course Header Switcher */}
      <div className="top-filter-bar">
        <div className="course-pills">
          {courses.map((course) => (
            <button
              key={course.id}
              className={`course-pill ${activeCourse === course.id ? 'active' : ''}`}
              onClick={() => setActiveCourse(course.id)}
            >
              <span className="pill-indicator" style={{ backgroundColor: course.iconColor }} />
              <span>{course.label}</span>
              {course.badge && (
                <span className="pill-badge">{course.badge}</span>
              )}
            </button>
          ))}
        </div>
        {/* Diagnostic Confidence Stamp */}
        <div className="confidence-stamp">
          <Icon className="confidence-icon">verified</Icon>
          <span className="confidence-label">Empirical Model Confidence:</span>
          <span className="confidence-value">86%</span>
          <span className="confidence-divider">|</span>
          <span className="confidence-meta">4 P-Sets · 2 Midterms</span>
        </div>
      </div>

      {/* Master Diagnostic Profile Summary Card */}
      <div className="profile-summary-card">
        {/* Ambient gradient meshes */}
        <div className="gradient-mesh mesh-1" />
        <div className="gradient-mesh mesh-2" />
        <div className="gradient-mesh mesh-3" />
        
        <div className="profile-content">
          {/* Title & Subject Focus */}
          <div className="profile-header">
            <div className="profile-meta">
              <span className="cluster-badge">Diagnostic Cluster #04</span>
              <span className="audit-time">Audited 18 mins ago</span>
            </div>
            <h2 className="profile-title">Calculus Vector & Chain Mechanics</h2>
            <p className="profile-description">
              Autonomous trace across 41 differential dependency nodes. High localized mastery with a critical structural misconception in multi-branch composite chain derivation.
            </p>
          </div>

          {/* Live Mastery Ring & Stats Trio */}
          <div className="metrics-grid">
            {/* Progress Gauge */}
            <div className="metric-card gauge-card">
              <div className="gauge-container">
                <svg className="gauge-svg" viewBox="0 0 36 36">
                  <circle
                    className="gauge-bg"
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="gauge-progress"
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="72, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    style={{ strokeDashoffset: 28 }}
                  />
                </svg>
                <span className="gauge-value">72%</span>
              </div>
              <div className="gauge-labels">
                <span className="gauge-label">Overall</span>
                <span className="gauge-title">Mastery</span>
              </div>
            </div>

            {/* Metric 1: Topics Solid */}
            <div className="metric-card topics-card">
              <span className="metric-label">Topics Solid</span>
              <div className="metric-value-row">
                <span className="metric-value">18</span>
                <span className="metric-denominator">/ 21</span>
              </div>
              <span className="metric-sub">
                <Icon className="check-icon">check_circle</Icon> 85.7%
              </span>
            </div>

            {/* Metric 2: Misconceptions */}
            <div className="metric-card misconceptions-card">
              <span className="metric-label error">Misconceptions</span>
              <div className="metric-value-row">
                <span className="metric-value error">1</span>
                <span className="metric-denominator error">Critical</span>
              </div>
              <span className="metric-sub error">
                <Icon className="warning-icon">warning</Icon> Action Req.
              </span>
            </div>

            {/* Metric 3: Gaps */}
            <div className="metric-card gaps-card">
              <span className="metric-label">Unattempted</span>
              <div className="metric-value-row">
                <span className="metric-value">2</span>
                <span className="metric-denominator">Gaps</span>
              </div>
              <span className="metric-sub">
                <Icon className="hourglass-icon">hourglass_empty</Icon> Queued
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Workbench */}
      <div className="workbench-grid">
        {/* LEFT COLUMN: Detailed Misconception & Evidence Audit */}
        <div className="left-column">
          {/* Primary Diagnosis Card */}
          <div className="diagnosis-card">
            {/* Diagnosis Alert Banner Header */}
            <div className="diagnosis-header">
              <div className="diagnosis-header-left">
                <div className="diagnosis-icon-wrapper">
                  <Icon className="crisis-icon">crisis_alert</Icon>
                </div>
                <div className="diagnosis-text">
                  <div className="diagnosis-badges">
                    <span className="priority-badge">Priority Diagnosis</span>
                    <span className="confidence-badge">86% Empirical Confidence</span>
                  </div>
                  <h3 className="diagnosis-title">Chain Rule Application in Composite Multivariable Functions</h3>
                </div>
              </div>
              <span className="diagnosis-id">ID: MATH201-MR-03</span>
            </div>

            {/* Formula Breakdown with Precision Visual Highlighting */}
            <div className="formula-breakdown">
              <div className="formula-header">
                <span className="formula-title">Diagnostic Formula Breakdown</span>
                <span className="formula-target">Target derivative: ∂z / ∂s where z = f(x(s,t), y(s,t))</span>
              </div>
              <div className="formula-display">
                <div className="formula-equation">
                  <span className="formula-part">∂z / ∂s</span>
                  <span className="formula-equals">=</span>
                  <span className="formula-part correct-branch" title="Mastered Path (Elena's typical correct evaluation)">
                    (∂z / ∂x)(∂x / ∂s)
                  </span>
                  <span className="formula-operator error">+</span>
                  <span className="formula-part missed-branch" title="Consistently Omitted Dependency Node">
                    (∂z / ∂y)(∂y / ∂s)
                  </span>
                </div>
              </div>
              <div className="formula-legend">
                <div className="legend-item correct">
                  <span className="legend-dot" style={{ backgroundColor: '#006a61' }} />
                  <span><strong className="correct-text">x-branch:</strong> Correctly computed (100% adherence)</span>
                </div>
                <div className="legend-item missed">
                  <span className="legend-dot" style={{ backgroundColor: '#ba1a1a' }} />
                  <span><strong className="missed-text">y-branch:</strong> Consistently dropped / omitted</span>
                </div>
              </div>
            </div>

            {/* Cognitive Friction Analysis */}
            <div className="cognitive-friction">
              <div className="friction-header">
                <Icon className="psychology-icon">psychology_alt</Icon>
                <span className="friction-title">Cognitive Friction Diagnosis: "The Linear Fallacy"</span>
              </div>
              <p className="friction-description">
                Elena treats composite multivariable functions as single-path algebraic conduits. When taking a partial derivative with respect to{' '}
                <code className="inline-code">s</code>, she isolates the leftmost variable node (<code className="inline-code">x</code>) and treats subsequent coordinate parameters (<code className="inline-code">y</code>) as invariant constants rather than coupled composite pathways.
              </p>
            </div>

            {/* Expandable Evidence Audit Accordion */}
            <div className="evidence-audit">
              <button 
                className="evidence-toggle" 
                onClick={() => setEvidenceOpen(!evidenceOpen)}
                aria-expanded={evidenceOpen}
              >
                <div className="evidence-toggle-left">
                  <Icon className="fact-icon">fact_check</Icon>
                  <span className="evidence-toggle-title">Why am I struggling with this? Evidence Audit</span>
                  <span className="evidence-count">2 Submissions</span>
                </div>
                <Icon className={`tray-icon ${evidenceOpen ? 'rotated' : ''}`}>expand_more</Icon>
              </button>
              
              <div className={`evidence-tray ${!evidenceOpen ? 'hidden' : ''}`}>
                {evidenceItems.map((evidence) => (
                  <div key={evidence.id} className="evidence-item">
                    <div className="evidence-header">
                      <div className="evidence-meta">
                        <span className="evidence-source">{evidence.title}</span>
                        <span className="evidence-date">{evidence.date}</span>
                      </div>
                      <span className="evidence-points error">
                        <Icon className="cancel-icon">cancel</Icon> {evidence.points}
                      </span>
                    </div>
                    <p className="evidence-prompt">{evidence.prompt}</p>
                    <div className="evidence-audit-text">
                      <span className="audit-label">Audit:</span> {evidence.audit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Prerequisite Dependency Tree */}
            <div className="prereq-tree">
              <div className="prereq-header">
                <div className="prereq-title">
                  <Icon className="tree-icon">account_tree</Icon>
                  <span>Prerequisite Knowledge Pipeline</span>
                </div>
                <span className="prereq-hint">Click node to inspect syllabus</span>
              </div>
              <div className="prereq-nodes">
                {prereqNodes.map((node) => (
                  <div 
                    key={node.id} 
                    className={`prereq-node ${node.status}`}
                    style={{ borderTopColor: node.borderColor }}
                  >
                    <div className="prereq-node-header">
                      <span className={`node-label ${node.status}`}>{node.label}</span>
                      <span className="node-badge" style={{ 
                        backgroundColor: node.badgeColor, 
                        color: node.badgeText 
                      }}>
                        {node.mastery}% {node.status === 'solid' ? 'Solid' : node.status === 'bottleneck' ? 'Review' : 'In Progress'}
                      </span>
                    </div>
                    <div className="prereq-node-body">
                      <p className="node-name">{node.name}</p>
                      <p className={`node-source ${node.status === 'bottleneck' ? 'error' : ''}`}>{node.source}</p>
                    </div>
                    <div className="prereq-progress">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${node.mastery}%`, 
                          backgroundColor: node.progressColor 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="remediation-insight">
                Remediation Insight: Bridging the "Tree Diagram Representation" bottleneck will unlock downstream mastery in Jacobians and Directional Derivatives.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Adaptive Method Router & Recovery Center */}
        <div className="right-column">
          {/* Method Router - Tailored Pedagogical Intervention */}
          <div className="router-card">
            <div className="router-header">
              <div className="router-title">
                <Icon className="route-icon">route</Icon>
                <h3>Method Router Intervention</h3>
              </div>
              <span className="router-badge">Adaptive AI</span>
            </div>

            {/* Empirical Rationale Chip */}
            <div className="rationale-chip">
              <div className="rationale-header">
                <Icon className="graph-icon">auto_graph</Icon>
                <span>Why this pathway is tailored for you</span>
              </div>
              <p className="rationale-text">
                Historical diagnostic telemetry confirms: <strong>You score +40% higher</strong> on graphical branch representations compared to purely symbolic algebraic proofs. We have restructured this remedial module to prioritize spatial tree models first.
              </p>
            </div>

            {/* Recommended Learning Steps */}
            <div className="learning-steps">
              {methodSteps.map((step) => (
                <div key={step.id} className={`step-card ${step.isLocked ? 'locked' : 'primary'}`}>
                  <div className="step-header">
                    <div className="step-info">
                      <span className="step-number">{step.id}</span>
                      <div className="step-details">
                        <span className="step-title">{step.title}</span>
                        <span className="step-duration">{step.duration}</span>
                      </div>
                    </div>
                    <span className="step-action">
                      {step.isLocked ? (
                        <Icon className="lock-icon">{step.icon}</Icon>
                      ) : (
                        <Icon className="play-icon">{step.icon}</Icon>
                      )}
                    </span>
                  </div>
                  {!step.isLocked && (
                    <p className="step-description">
                      {step.description}
                    </p>
                  )}
                  {!step.isLocked && (
                    <button className="step-cta" onClick={() => toggleEvidence(String(step.id))} type="button">
                      <span>Start Recommended Visual Guide</span>
                      <Icon>arrow_forward</Icon>
                    </button>
                  )}
                </div>
              ))}

              {/* Alternative Learning Routes Toggle */}
              <div className="alternative-modalities">
                <span className="modalities-label">Alternative Modalities</span>
                <div className="modality-buttons">
                  {alternativeModalities.map((mod) => (
                    <button key={mod.label} className="modality-btn">
                      <Icon className="modality-icon">{mod.icon}</Icon>
                      <span className="modality-text">{mod.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Benchmark & Recovery Trajectory Card */}
          <div className="recovery-card">
            <div className="recovery-header">
              <div className="recovery-title">
                <Icon className="trending-icon">trending_up</Icon>
                <h4>Projected Recovery Trajectory</h4>
              </div>
              <span className="recovery-delta">+16% Net Delta</span>
            </div>

            {/* SVG Projected Mastery Chart */}
            <div className="recovery-chart-container">
              <div className="recovery-chart-wrapper">
                <svg className="recovery-chart" viewBox="0 0 320 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="recoveryGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#006a61" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#006a61" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid reference lines */}
                  <line stroke="#d3e4fe" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="30" y2="30" />
                  <line stroke="#d3e4fe" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="70" y2="70" />
                  <line stroke="#d3e4fe" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="110" y2="110" />
                  {/* Cohort Median Line (Dotted Gray) */}
                  <path d="M 0,85 Q 80,82 160,78 T 320,72" fill="none" stroke="#75777d" strokeDasharray="4 4" strokeWidth="1.5" />
                  {/* Elena's Projected Trajectory Area */}
                  <polygon fill="url(#recoveryGradient)" points="0,95 80,95 160,95 240,45 320,25 320,120 0,120" />
                  {/* Elena's Historical & Projected Trajectory Line */}
                  <path d="M 0,95 L 160,95" fill="none" stroke="#006a61" strokeWidth="2.5" />
                  <path d="M 160,95 C 200,95 220,45 320,25" fill="none" stroke="#006a61" strokeDasharray="3 3" strokeWidth="2.5" />
                  {/* Current point pin */}
                  <circle cx="160" cy="95" fill="#ba1a1a" r="4.5" />
                  {/* Projected target pin */}
                  <circle cx="320" cy="25" fill="#006a61" r="4.5" />
                </svg>
                {/* Chart Value Callouts */}
                <div className="chart-callout current">72% Current</div>
                <div className="chart-callout target">88% Target</div>
              </div>
              
              {/* Chart Timeline Milestones */}
              <div className="chart-milestones">
                <span>Quiz #4 Check</span>
                <span className="milestone-today">Today (Diagnostic)</span>
                <span className="milestone-intervention">+15m Guided Intervention</span>
              </div>
            </div>

            {/* Cohort Comparison Metadata */}
            <div className="cohort-comparison">
              <div className="comparison-item">
                <span className="comparison-label">MATH 201 Cohort Mean</span>
                <span className="comparison-value">76.4%</span>
                <span className="comparison-diff">Elena is currently -4.4%</span>
              </div>
              <div className="comparison-item">
                <span className="comparison-label">Estimated Remediation</span>
                <span className="comparison-value recovery">15 Minutes</span>
                <span className="comparison-diff">Fast recovery velocity</span>
              </div>
            </div>

            {/* Quick Launch CTA */}
            <div className="cta-row">
              <button className="cta-postpone">Postpone to Study Planner</button>
              <button className="cta-remediate">
                <Icon className="bolt-icon">bolt</Icon>
                <span>Remediate Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}