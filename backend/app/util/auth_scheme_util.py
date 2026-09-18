from fastapi import Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.exceptions.exception import UnauthorizedException

ACCESS_TOKEN_COOKIE_NAME = "access_token"
REFRESH_TOKEN_COOKIE_NAME = "refresh_token"


class CookieOrBearer(HTTPBearer):
    """
    Resolves the access token from the 'Authorization: Bearer' header
    (used by the mobile app) or, if absent, from the httpOnly access_token
    cookie (used by the web frontend). Drop-in replacement for HTTPBearer()
    everywhere it's used as a route dependency.
    """

    def __init__(self):
        super().__init__(auto_error=False)

    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials:
        credentials = await super().__call__(request)
        if credentials:
            return credentials

        token = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)
        if not token:
            raise UnauthorizedException(detail="Not authenticated")

        return HTTPAuthorizationCredentials(scheme="bearer", credentials=token)
