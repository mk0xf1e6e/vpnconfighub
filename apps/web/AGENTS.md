<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mandatory Workflow

- Inspect the existing frontend and backend.
- Create or update the implementation TODO list.
- Implement Telegram Mini App detection.
- Implement real Telegram `initData` authentication.
- Implement Go backend HMAC verification.
- Load or create the Telegram user in the database.
- Show the real Telegram profile.
- Remove fake user and account data.
- Implement the `Not in Telegram -> Open in Telegram` screen.
- Fix bottom navigation and icons.
- Remove remaining fake or mock data.
- Find and fix existing bugs.
- Run lint and type checks.
- Run the production build.
- Run available tests.
- Test the Telegram authentication flow.
- Test the non-Telegram flow.
- Fix any failures found during testing.
- Re-run all tests after fixes.
- Review the final `git diff`.
- Check `git status`.
- Commit all changes to Git.
- Push the commit to the configured GitHub repository.
- Verify the push succeeded.
- Report the commit hash and test and build results.

Do not consider a task complete until implementation is tested, the production build succeeds, the final changes are reviewed, and the changes are committed and pushed. If tests or the build fail, fix them and run again before committing. Never claim a commit or push succeeded unless the command actually succeeds.

Final flow:

```text
IMPLEMENT
   ↓
TEST
   ↓
FAIL? ── YES ──→ FIX ──→ TEST AGAIN
   │
   NO
   ↓
PRODUCTION BUILD
   ↓
FAIL? ── YES ──→ FIX ──→ BUILD AGAIN
   │
   NO
   ↓
REVIEW git diff
   ↓
git status
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
VERIFY PUSH
   ↓
REPORT COMMIT + TEST RESULTS
```

## Next Implementation Task

Use this as the next coding task prompt when continuing Telegram authentication work:

```text
Continue with the VPN Config Hub implementation.

IMPORTANT: You are responsible for implementing, testing, committing, and pushing the changes. Do not stop after explaining what should be done.

FIRST:
1. Inspect the entire existing repository.
2. Identify the frontend framework, backend, database, Telegram integration, routing, authentication, and current dashboard implementation.
3. Do NOT rewrite the project from scratch.
4. Preserve the existing dashboard theme/design because it is already approved.
5. Create/update a TODO list and keep it updated as you work. Mark each item complete only after it has actually been implemented and tested.

CURRENT OBJECTIVE:
Implement proper Telegram Mini App authentication and remove the fake account behavior.

TODO:

[ ] Inspect existing architecture and current authentication
[ ] Inspect current frontend/backend communication
[ ] Inspect current Telegram integration
[ ] Add/fix Telegram WebApp SDK integration
[ ] Detect whether the application is running inside Telegram
[ ] Call Telegram.WebApp.ready()
[ ] Call Telegram.WebApp.expand()
[ ] Obtain Telegram.WebApp.initData
[ ] Send initData securely to the backend
[ ] Implement backend Telegram initData HMAC-SHA256 verification
[ ] Validate auth_date / prevent stale authentication data
[ ] Extract the authenticated Telegram user
[ ] Find or create the corresponding application user in the database
[ ] Create/return the application's authenticated session
[ ] Return real user information to the frontend
[ ] Display the real Telegram name
[ ] Display the real Telegram username when available
[ ] Display the real Telegram profile photo when available
[ ] Remove hard-coded "Alex Johnson"
[ ] Remove hard-coded "@alex_v2ray"
[ ] Remove fake Stars balance
[ ] Remove fake account information
[ ] Remove fake configuration information where it is presented as real
[ ] Remove fake traffic/statistics where it is presented as real
[ ] Remove simulated API responses from the production UI
[ ] Remove random fake node ping values from production behavior
[ ] Add loading/authentication state
[ ] Add authentication error state
[ ] Add proper "Telegram required" state
[ ] If opened outside Telegram, DO NOT show the authenticated dashboard
[ ] Create a clean "Open in Telegram" screen
[ ] Add a retry button for users who return to Telegram
[ ] Make the Open in Telegram URL configurable through environment variables
[ ] Ensure Telegram authentication cannot be bypassed by modifying frontend JavaScript
[ ] Ensure initDataUnsafe is NEVER used as the authentication authority
[ ] Fix the bottom navigation icons/buttons
[ ] Make every bottom navigation item actually work
[ ] Keep the approved Telegram-style visual theme
[ ] Check mobile/touch behavior
[ ] Check all existing TypeScript errors
[ ] Check all existing runtime errors
[ ] Run lint
[ ] Run type checking
[ ] Run tests
[ ] Run production build
[ ] Test Telegram authentication
[ ] Test invalid Telegram authentication
[ ] Test expired/stale initData
[ ] Test opening the app outside Telegram
[ ] Test dashboard navigation
[ ] Fix every failure found
[ ] Run the complete test/build suite again after fixes
[ ] Review git diff
[ ] Review git status
[ ] Commit the completed changes
[ ] Push the commit to GitHub
[ ] Verify that git push actually succeeded
[ ] Report the final commit hash
[ ] Report exactly which tests/build checks passed

AUTHENTICATION REQUIREMENTS:

Frontend:

- Use Telegram.WebApp.initData as the authentication payload.
- Do not trust Telegram.WebApp.initDataUnsafe.user for authentication.
- initDataUnsafe may only be used for non-security-sensitive UI convenience if necessary.
- The backend must be the authority.

Backend:

Verify Telegram Mini App initData according to Telegram's official validation algorithm.

The verification must:
1. Parse initData.
2. Extract hash.
3. Remove hash from the parameters.
4. Sort the remaining parameters.
5. Construct the data-check-string.
6. Derive the Telegram WebApp secret key using the bot token.
7. Calculate HMAC-SHA256.
8. Compare the calculated hash with the supplied hash using a constant-time comparison.
9. Validate auth_date so old/replayed authentication data is rejected.
10. Extract the Telegram user only after successful verification.

SECURITY:

- NEVER expose the Telegram bot token to frontend code.
- NEVER put the bot token in NEXT_PUBLIC_* variables.
- NEVER authenticate solely from initDataUnsafe.
- NEVER accept a Telegram user ID supplied independently by the browser.
- The database user must be associated with the verified Telegram user ID.
- Do not log the bot token or complete sensitive initData in production logs.

NON-TELEGRAM BEHAVIOR:

When opened directly in a normal browser:

Show a dedicated authentication page:

"Telegram Required"

"Open VPN Config Hub through Telegram to access your account, configurations, subscriptions and servers."

Button:

"Open in Telegram"

The Telegram URL must come from configuration/environment rather than being hard-coded if the project architecture supports this.

Do NOT display:
- dashboard
- fake user
- fake subscription
- fake Stars
- fake configuration
- fake traffic

NAVIGATION:

Keep the existing design.

Use simple icons similar to the approved HTML reference:

Home     Store     Nodes     Guides     Help

Each must:
- respond to click/touch
- activate the correct content
- visually indicate the active tab
- not break when switching repeatedly
- preserve state appropriately

FAKE DATA:

Search the entire project, not just the main page, for:
- Alex Johnson
- alex_v2ray
- fake Stars
- mock users
- mock configs
- mock traffic
- simulated API responses
- random ping generation
- placeholder account data

Remove or isolate development mock data so it cannot appear as real production account data.

IMPORTANT:
If some backend functionality does not exist yet, do NOT invent a fake successful response. Show an honest loading/empty/unavailable state and add the missing backend work to the TODO.

TESTING:

Before completion run the project's appropriate commands, including where applicable:

- npm/pnpm/yarn install checks
- lint
- TypeScript/typecheck
- unit tests
- integration tests
- production build

Also manually/test-programmatically verify:

1. Valid Telegram initData → authenticated.
2. Modified initData → rejected.
3. Invalid hash → rejected.
4. Expired auth_date → rejected.
5. Browser outside Telegram → Telegram-required page.
6. Real Telegram user → real profile displayed.
7. Navigation → all five tabs work.
8. Production build → succeeds.

If a test fails:
DO NOT commit yet.
Fix it and run the test again.

GIT REQUIREMENT:

When everything is working:

git status
git diff
git add <appropriate files>
git commit -m "feat: integrate Telegram Mini App authentication"
git push

Do not claim success unless git push returns success.

After pushing, verify the repository/branch state and provide:

- branch
- commit hash
- commit message
- tests passed
- typecheck result
- lint result
- production build result
- any remaining TODOs

Do not stop merely because the code compiles. Test the actual behavior and fix discovered bugs before committing.
```

One important addition:

The agent should **not fabricate a Telegram login URL**. It should inspect the existing bot/Mini App configuration and use the actual configured bot/app URL. If that configuration doesn't exist yet, it should add an environment variable and clearly report that it needs the real Telegram bot/Mini App URL configured.
