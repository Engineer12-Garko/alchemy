from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.modules_dev1.auth.models import User

router = APIRouter(prefix="/api/auth", tags=["Auth & Profile"])
security = HTTPBearer(auto_error=False)
settings = get_settings()

_SHARED_USER_ID = "00000000-0000-0000-0000-000000000001"
_SHARED_USER_EMAIL = "shared-workspace@alchemy.local"


def _get_shared_workspace_user(db: Session) -> User:
    user = db.get(User, _SHARED_USER_ID)
    if user is not None:
        return user

    user = User(
        id=_SHARED_USER_ID,
        email=_SHARED_USER_EMAIL,
        hashed_password="disabled-auth",
        full_name="Shared Prototype Workspace",
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        # Concurrent serverless requests can race to create the shared user.
        db.rollback()
        user = db.get(User, _SHARED_USER_ID)
        if user is None:
            raise
    return user


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    if not settings.auth_enabled:
        return _get_shared_workspace_user(db)

    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer exists")
    return user


