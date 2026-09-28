# Admin authentication API contract

This Vite project has no backend authentication service. The admin UI now delegates authentication to a same-origin API and contains no configured credentials. Until the API below is implemented and deployed, admin sign-in cannot succeed; this is intentional and safer than a client-side password check.

## Required endpoints

- `POST /api/admin/auth/login` accepts JSON `{ "username": "…", "password": "…" }`. Return `200` with `{ "authenticated": true }` after verifying the account server-side and issuing a session cookie. Return `401` for invalid credentials without revealing which field was wrong.
- `GET /api/admin/auth/session` returns `200` with `{ "authenticated": true }` for a valid session, otherwise `401`.
- `POST /api/admin/auth/logout` invalidates the server-side session and expires the cookie.

## Server-side requirements

- Store password hashes (prefer Argon2id or bcrypt), never plaintext passwords. Keep hashes and session-signing secrets in server-only environment variables or a secrets manager; never expose them through Vite `VITE_*` variables or client bundles.
- Use HTTPS and an `HttpOnly; Secure; SameSite=Strict; Path=/` session cookie. Validate session state on every protected server endpoint; the React route guard is only a user-interface convenience.
- Rate-limit login attempts, use generic authentication errors, and protect state-changing endpoints against CSRF.
- Admin content currently uses browser storage in this frontend. For production security, move admin reads/writes behind authenticated server endpoints and enforce authorization there as well.

The existing `.gitignore` ignores `.env*`; keep production secrets in the backend's environment, not in this frontend repository. No `.env` file or secret value is required for the frontend API adapter.
