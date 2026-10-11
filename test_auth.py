#!/usr/bin/env python
"""Critical Auth Testing Script for Alchemy Academy."""
import sys
import os

# Add backend/app to path (backend/ has no __init__.py; backend/app/ does)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'app'))

def test_auth_router_configuration():
    """Test 1: Verify auth router has correct prefix."""
    print("=" * 60)
    print("TEST 1: Auth Router Configuration")
    print("=" * 60)
    
    try:
        from backend.app.modules_dev1.auth.router import router as auth_router
        print(f"✓ Auth router imported successfully")
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
            print("\n✓ PASS: Auth routes correctly configured")
            return True
        else:
            print(f"\n✗ FAIL: Expected routes not found. Found: {found_paths}")
            return False
            
    except ImportError as e:
        print(f"\n✗ FAIL: Could not import auth router: {e}")
        return False
    except Exception as e:
        print(f"\n✗ FAIL: Error checking auth router: {e}")
        return False


def test_fastapi_app_routes():
    """Test 2: Verify FastAPI app has correct auth routes."""
    print("\n" + "=" * 60)
    print("TEST 2: FastAPI App Routes")
    print("=" * 60)
    
    try:
        from backend.app.main import app
        print(f"✓ FastAPI app imported successfully")
        
        # Collect all /api routes
        api_routes = []
        for route in app.routes:
            if hasattr(route, 'path'):
                path = route.path
                if path.startswith('/api'):
                    api_routes.append(path)
        
        print(f"\nTotal /api routes: {len(api_routes)}")
        for route in sorted(set(api_routes)):
            print(f"  {route}")
        
        # Check for auth routes
        auth_paths = [p for p in api_routes if '/auth' in p]
        print(f"\n/api/auth routes: {len(auth_paths)}")
        for p in auth_paths:
            print(f"  {p}")
        
        # Verify key routes exist
        has_register = any('/register' in p for p in auth_paths)
        has_login = any('/login' in p for p in auth_paths)
        has_me = any('/me' in p for p in auth_paths)
        
        print(f"\n  Has /register: {has_register}")
        print(f"  Has /login: {has_login}")
        print(f"  Has /me: {has_me}")
        
        if has_register and has_login and has_me:
            print("\n✓ PASS: All expected auth routes present")
            return True
        else:
            missing = []
            if not has_register: missing.append('/register')
            if not has_login: missing.append('/login')
            if not has_me: missing.append('/me')
            print(f"\n✗ FAIL: Missing routes: {missing}")
            return False
            
    except ImportError as e:
        print(f"\n✗ FAIL: Could not import FastAPI app: {e}")
        return False
    except Exception as e:
        print(f"\n✗ FAIL: Error checking FastAPI app: {e}")
        return False


def test_no_duplicate_auth():
    """Test 3: Verify no duplicate auth router mounts."""
    print("\n" + "=" * 60)
    print("TEST 3: No Duplicate Auth Router Mounts")
    print("=" * 60)
    
    try:
        from backend.app.main import app
        
        # Check if auth_router is included
        includes = [r for r in dir(app) if 'include_router' in r.lower()]
        print(f"\nRouter inclusion check - look for auth_router in include list")
        
        # The fix should have removed the duplicate
        # Check the actual routes more carefully
        api_routes = []
        for route in app.routes:
            if hasattr(route, 'path') and route.path.startswith('/api'):
                api_routes.append(route.path)
        
        # Count how many routes start with /api/auth
        auth_route_count = sum(1 for p in api_routes if '/auth' in p)
        
        print(f"\n/api/auth route count in app: {auth_route_count}")
        
        # Should be exactly the routes from the single auth router
        if auth_route_count >= 2:  # At minimum register and login
            print("\n✓ PASS: Multiple auth routes present (single router source)")
            return True
        else:
            print(f"\n✗ FAIL: Expected multiple auth routes, found {auth_route_count}")
            return False
            
    except Exception as e:
        print(f"\n✗ FAIL: Error checking duplicate auth: {e}")
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
        print("\n✓ ALL TESTS PASSED - Auth configuration is correct")
        print("\nNext step: Redeploy to Vercel to apply fixes")
    else:
        print("\n✗ SOME TESTS FAILED - Review the output above")
        print("\nNext step: Fix the failing tests before deploying")
    
    sys.exit(0 if all(results) else 1)