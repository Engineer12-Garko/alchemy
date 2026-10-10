from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session

from app.shared.review_event import ReviewEvent
from app.modules_dev1.learner_model.models import UserMastery, MisconceptionLog
from app.modules_dev1.scheduler.fsrs import update_memory_state, calculate_retention


class LearnerModelService:
    @staticmethod
    def sync_review_event(db: Session, event: ReviewEvent) -> UserMastery:
        record_id = f"{event.user_id}_{event.concept_id}"
        mastery = db.query(UserMastery).filter(UserMastery.id == record_id).first()
        now = datetime.utcnow()

        if not mastery:
            mastery = UserMastery(
                id=record_id,
                user_id=event.user_id,
                course_id=event.course_id,
                concept_id=event.concept_id,
                concept_name=event.concept_id.replace("_", " ").title(),
                mastery_score=0.20 if event.is_correct else 0.05,
                stability=1.0,
                difficulty=5.0,
                lapses=0 if event.is_correct else 1,
                reps=1,
                last_reviewed_at=now,
                next_review_due=now + timedelta(days=1),
                status="learning"
            )
            db.add(mastery)
        else:
            # 1. Update FSRS Memory State
            elapsed_days = max(0.1, (now - mastery.last_reviewed_at).total_seconds() / 86400.0)
            cur_retrieval = calculate_retention(mastery.stability, elapsed_days)
            new_s, new_d, interval_days = update_memory_state(
                stability=mastery.stability,
                difficulty=mastery.difficulty,
                retrievability=cur_retrieval,
                rating=int(event.rating)
            )

            # 2. Update Bayesian Knowledge Tracing (BKT)
            p_transit = 0.12
            p_slip = 0.10
            p_guess = 0.20
            p_m = mastery.mastery_score

            if event.is_correct:
                p_obs = (p_m * (1 - p_slip)) / ((p_m * (1 - p_slip)) + ((1 - p_m) * p_guess))
                mastery.reps += 1
            else:
                p_obs = (p_m * p_slip) / ((p_m * p_slip) + ((1 - p_m) * (1 - p_guess)))
                mastery.lapses += 1

            mastery.mastery_score = round(min(1.0, max(0.01, p_obs + (1 - p_obs) * p_transit)), 3)
            mastery.stability = new_s
            mastery.difficulty = new_d
            mastery.last_reviewed_at = now
            mastery.next_review_due = now + timedelta(days=interval_days)

            # 3. Status flag
            if mastery.mastery_score >= 0.85:
                mastery.status = "mastered"
            elif mastery.lapses >= 3 and mastery.mastery_score < 0.60:
                mastery.status = "bottleneck"
            else:
                mastery.status = "learning"

        # 4. Misconception logging
        if event.misconception_tag:
            LearnerModelService._log_misconception(db, event)

        db.commit()
        db.refresh(mastery)
        return mastery

    @staticmethod
    def _log_misconception(db: Session, event: ReviewEvent):
        tag_id = f"{event.user_id}_{event.concept_id}_{event.misconception_tag}"
        record = db.query(MisconceptionLog).filter(MisconceptionLog.id == tag_id).first()

        if record:
            record.occurrences += 1
            record.last_detected_at = datetime.utcnow()
            record.status = "open"
        else:
            record = MisconceptionLog(
                id=tag_id,
                user_id=event.user_id,
                course_id=event.course_id,
                concept_id=event.concept_id,
                misconception_tag=event.misconception_tag,
                title=event.misconception_tag.replace("_", " ").title(),
                description="Detected step derivation failure during adaptive quiz.",
                severity="high" if event.score_ratio < 0.4 else "medium",
                status="open",
                occurrences=1
            )
            db.add(record)

    @staticmethod
    def get_weak_concepts(db: Session, user_id: str, limit: int = 5) -> List[UserMastery]:
        return db.query(UserMastery)\
            .filter(UserMastery.user_id == user_id, UserMastery.mastery_score < 0.70)\
            .order_by(UserMastery.mastery_score.asc())\
            .limit(limit)\
            .all()