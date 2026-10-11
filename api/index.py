import sys
from pathlib import Path

# From /var/task/api/index.py, go up two levels to /var/task, then into backend
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from app.main import app

__all__ = ["app"]
