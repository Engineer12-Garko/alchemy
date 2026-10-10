import math
from typing import Tuple


def calculate_retention(stability: float, elapsed_days: float) -> float:
    """FSRS Power Law retention decay curve."""
    if stability <= 0:
        return 0.0
    return float((1.0 + 19.0 * (elapsed_days / (9.0 * stability))) ** -0.5)


def update_memory_state(
    stability: float,
    difficulty: float,
    retrievability: float,
    rating: int
) -> Tuple[float, float, int]:
    """
    Deterministic FSRS-4.5 state progression.
    Ratings: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
    """
    # Difficulty adjustment (w6 parameter scaling)
    d_delta = -0.5 * (rating - 3)
    new_difficulty = max(1.0, min(10.0, difficulty + d_delta))

    if rating == 1:
        # Lapse stability drop
        new_stability = max(0.4, stability * 0.25)
        interval_days = 1
    elif rating == 2:
        # Hard stability adjustment
        new_stability = max(1.0, stability * 1.2)
        interval_days = max(1, math.ceil(new_stability * 0.8))
    elif rating == 3:
        # Good recall expansion
        factor = 1.0 + math.exp(2.0) * (11.0 - new_difficulty) * (math.pow(stability, -0.2)) * (math.exp((1.0 - retrievability) * 0.8) - 1.0)
        new_stability = max(1.5, stability * max(1.3, factor * 0.35))
        interval_days = max(2, math.ceil(new_stability))
    else:
        # Easy recall bonus
        new_stability = max(2.5, stability * 2.5)
        interval_days = max(4, math.ceil(new_stability * 1.3))

    return round(new_stability, 2), round(new_difficulty, 2), interval_days