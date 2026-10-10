from pydantic import BaseModel
from typing import List, Optional

# --- Enums for Routing ---
class SkillType(str):
    PROCEDURAL = "procedural"
    ARGUMENT = "argument"
    RECALL = "recall"
    PRODUCTION = "production"
    MAKING = "making"

# --- Diagnostic Cluster Payload (Left Column of UI) ---
class FormulaBranch(BaseModel):
    branch_name: str
    status: str
    description: str

class EvidenceAudit(BaseModel):
    source_title: str
    date: str
    penalty: str
    audit_detail: str

class PrerequisiteNode(BaseModel):
    title: str
    mastery_pct: Optional[int]
    status_label: str  # e.g., "Solid", "Review", "In Progress"
    is_bottleneck: bool

class CognitiveDiagnosis(BaseModel):
    friction_name: str
    description: str
    formula_target: str
    branches: List[FormulaBranch]
    evidence_audit: List[EvidenceAudit]
    prerequisites: List[PrerequisiteNode]

# --- Method Router Intervention (Right Column of UI) ---
class InterventionModule(BaseModel):
    module_id: str
    title: str
    duration_mins: int
    description: str
    modality: str  # e.g., "Visual Tree Diagram", "Algebraic Proof"
    is_locked: bool
    is_recommended: bool

class MethodRouterPayload(BaseModel):
    topic_id: str
    skill_type: str
    overall_mastery: int
    rationale: str
    recommended_intervention: InterventionModule
    alternative_modalities: List[InterventionModule]
    projected_recovery_delta: int
    
class DiagnosticGapsResponse(BaseModel):
    cluster_title: str
    diagnosis: CognitiveDiagnosis
    router_intervention: MethodRouterPayload


class GapAnalysisRequest(BaseModel):
    student_id: str
    topic_id: str
    recent_attempts: List[dict]