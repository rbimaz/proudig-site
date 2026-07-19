"""
Pytest configuration for infrastructure tests.

Usage:
    # Phase 1 (IP-based, HTTP)
    pytest tests/infrastructure/ --base-url=http://<server-ip>

    # Phase 2 (Domain-based, HTTPS)
    pytest tests/infrastructure/ --base-url=https://proudig.de --phase=2
"""

import pytest


def pytest_addoption(parser):
    parser.addoption(
        "--base-url",
        action="store",
        default="http://localhost",
        help="Base URL for tests (e.g., http://192.168.1.100 or https://proudig.de)"
    )
    parser.addoption(
        "--phase",
        action="store",
        default="1",
        choices=["1", "2"],
        help="Test phase: 1=HTTP/IP, 2=HTTPS/Domain"
    )
    parser.addoption(
        "--domain",
        action="store",
        default="proudig.de",
        help="Domain name for Phase 2 tests"
    )


@pytest.fixture
def base_url(request):
    """Base URL for all requests."""
    return request.config.getoption("--base-url").rstrip("/")


@pytest.fixture
def phase(request):
    """Current test phase (1 or 2)."""
    return int(request.config.getoption("--phase"))


@pytest.fixture
def domain(request):
    """Domain name for Phase 2 tests."""
    return request.config.getoption("--domain")


@pytest.fixture
def is_https(base_url):
    """Check if we're testing HTTPS."""
    return base_url.startswith("https://")
