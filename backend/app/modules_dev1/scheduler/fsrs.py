"""
Deterministic Spaced Repetition Scheduling Engine (FSRS-4.5).
Calculates memory stability, item difficulty, and next review intervals.
"""
import math
from datetime import datetime, timedelta
from typing import Tuple

# Default calibrated FSRS parameters
W = [0.4072, 1.1827, 3.1262, 15.4722, 7.2102, 0.5316, 1.0918, 0.0046, 1.5458, 0.1192, 1.0192, 1.9395, 0.11, 0.29, 0.26, 0.29, 2.34]
REQUESTED_RETENTION = 0.90  # Target safety boundary: 90% recall


def calculate_retention(stability: float, elapsed_days: float) -> float:
    """Predicts current retrieval probability R = (1 + factor * t / S)^(-0.5)"""
    if stability <= 0:
        return 0.0
    factor = 19.0 / 81.0
    return math.pow(1.0 + factor * (elapsed_days / stability), -0.5)


def init_memory_state(rating: int) -> Tuple[float, float]:
    """Initializes stability (S) and difficulty (D) on first exposure."""
    # rating: 1=Again, 2=Hard, 3=Good, 4=Easy
    initial_stability = max(0.1, W[rating - 1])
    initial_difficulty = min(10.0, max(1.0, W[4] - (rating - 3) * W[5]))
    return initial_stability, initial_difficulty


def next_interval(stability: float, desired_retention: float = REQUESTED_RETENTION) -> int:
    """Computes the exact number of days until retrieval falls to desired_retention."""
    factor = 19.0 / 81.0
    days = (stability / factor) * (math.pow(desired_retention, -2.0) - 1.0)
    return max(1, round(days))


def update_memory_state(
    stability: float, 
    difficulty: float, 
    retrievability: float, 
    rating: int
) -> Tuple[float, float, int]:
    """
    Transitions the memory state based on user recall performance.
    Returns: (new_stability, new_difficulty, interval_days)
    """
    # 1. Update difficulty
    next_d = difficulty - W[6] * (rating - 3)
    next_d = min(10.0, max(1.0, W[7] * initial_difficulty_mean() + (1.0 - W[7]) * next_d))

    # 2. Update stability
    if rating == 1:  # Lapse
        next_s = W[11] * math.pow(next_d, -W[12]) * (math.pow(stability + 1.0, W[13]) - 1.0) * math.exp((1.0 - retrievability) * W[14])
        next_s = max(0.1, next_s)
    else:  # Success
        hard_penalty = W[15] if rating == 2 else 1.0
        easy_bonus = W[16] if rating == 4 else 1.0
        next_s = stability * (
            1.0 + math.exp(W[8]) *
            (11.0 - next_d) *
            math.pow(stability, -W[9]) *
            (math.exp((1.0 - retrievability) * W[10]) - 1.0) *
            hard_penalty * easy_bonus
        )

    interval = next_interval(next_s)
    return round(next_s, 2), round(next_d, 2), interval


def initial_difficulty_mean() -> float:
    return W[4]