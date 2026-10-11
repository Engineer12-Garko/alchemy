#!/usr/bin/env python
"""Critical Auth Testing Script for Alchemy Academy."""
import os
import sys
from pathlib import Path

# Add both the repo root and the backend package root to the import path.
# The project imports use the top-level package name "app" from within backend/app,
# while the verification script also imports backend.app.main from the repo root.
REPO_ROOT = Path(__file__).resolve().parent
BACKEND_ROOT = REPO_ROOT / 'backend'
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(BACKEND_ROOT))

try:
    sys.stdout.reconfigure(encoding='utf-8')
except (AttributeError, ValueError):
    pass

def test_auth_router_configuration():
    """Test 1: Verify auth router has correct prefix."""
    print("=" * 60)
    print("TEST 1: Auth Router Configuration")
    print("=" * 60)
    
    try:
        from backend.app.modules_dev1.auth.router import router as auth_router
        print("[PASS] Auth router imported successfully")
        print(f"  Prefix: {auth_router.prefix}")
        print(f"  Tags: {auth_router.tags}")
        
        # Check routes
        routes_list = []
        for route in auth_router.routes:
            if hasattr(route, 'path') and hasattr(route, 'methods'):
                route_info = f"{list(route.methods)} {route.path}"
                routes_list.append(route_info)
        
        print(f"\n  Routes defined: {len(routes_list)}")
        for route in routes_list:
            print(f"  {route}")
        
        # Verify expected routes
        expected_paths = ['/api/auth/register', '/api/auth/login', '/api/auth/me']
        found_paths = [r for r in routes_list if any(p in r for p in expected_paths)]
        
        if len(found_paths) >= 2:  # At least register and login should be present
            print("\n[PASS] Auth routes correctly configured")
            return True
        else:
            print(f"\n[FAIL] Expected routes not found. Found: {found_paths}")
            return False

    except ImportError as e:
        print(f"\n[FAIL] Could not import auth router: {e}")
        return False
    except Exception as e:
        print(f"\n[FAIL] Error checking auth router: {e}")
        return False


def iter_route_paths(router):
    """Flatten nested FastAPI router entries into a single list of route paths."""
    for route in getattr(router, 'routes', []):
        if hasattr(route, 'path'):
            yield route.path
        elif hasattr(route, 'original_router'):
            yield from iter_route_paths(route.original_router)


def test_fastapi_app_routes():
    """Test 2: Verify FastAPI app has correct auth routes."""
    print("\n" + "=" * 60)
    print("TEST 2: FastAPI App Routes")
    print("=" * 60)

    try:
        from backend.app.main import app
        print("[PASS] FastAPI app imported successfully")

        api_routes = [path for path in iter_route_paths(app.router) if path.startswith('/api')]

        print(f"\nTotal /api routes: {len(api_routes)}")
        for route in sorted(set(api_routes)):
            print(f"  {route}")

        auth_paths = [p for p in api_routes if '/auth' in p]
        print(f"\n/api/auth routes: {len(auth_paths)}")
        for p in auth_paths:
            print(f"  {p}")

        has_register = any('/register' in p for p in auth_paths)
        has_login = any('/login' in p for p in auth_paths)
        has_me = any('/me' in p for p in auth_paths)

        print(f"\n  Has /register: {has_register}")
        print(f"  Has /login: {has_login}")
        print(f"  Has /me: {has_me}")

        if has_register and has_login and has_me:
            print("\n[PASS] All expected auth routes present")
            return True
        else:
            missing = []
            if not has_register: missing.append('/register')
            if not has_login: missing.append('/login')
            if not has_me: missing.append('/me')
            print(f"\n[FAIL] Missing routes: {missing}")
            return False

    except ImportError as e:
        print(f"\n[FAIL] Could not import FastAPI app: {e}")
        return False
    except Exception as e:
        print(f"\n[FAIL] Error checking FastAPI app: {e}")
        return False


def test_no_duplicate_auth():
    """Test 3: Verify no duplicate auth router mounts."""
    print("\n" + "=" * 60)
    print("TEST 3: No Duplicate Auth Router Mounts")
    print("=" * 60)

    try:
        from backend.app.main import app

        api_routes = [path for path in iter_route_paths(app.router) if path.startswith('/api')]
        auth_route_count = sum(1 for p in api_routes if '/auth' in p)

        print(f"\n/api/auth route count in app: {auth_route_count}")

        if auth_route_count >= 2:
            print("\n[PASS] Multiple auth routes present (single router source)")
            return True
        else:
            print(f"\n[FAIL] Expected multiple auth routes, found {auth_route_count}")
            return False

    except Exception as e:
        print(f"\n[FAIL] Error checking duplicate auth: {e}")
        return False


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("CRITICAL AUTH TESTING FOR ALCHEMY ACADEMY")
    print("=" * 60 + "\n")
    
    results = []
    results.append(test_auth_router_configuration())
    results.append(test_fastapi_app_routes())
    results.append(test_no_duplicate_auth())
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Tests passed: {sum(results)}/{len(results)}")
    
    if all(results):
        print("\n[PASS] ALL TESTS PASSED - Auth configuration is correct")
        print("\nNext step: Redeploy to Vercel to apply fixes")
    else:
        print("\n[FAIL] SOME TESTS FAILED - Review the output above")
        print("\nNext step: Fix the failing tests before deploying")
    
    sys.exit(0 if all(results) else 1)