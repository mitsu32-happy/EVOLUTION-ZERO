# Main Push Requirements

Codex must complete these steps before every commit and push to `main`.

## 1. Update In-App News

Update `src/data/update_news.js` with a short user-facing summary of the current update.

Required for:

- Feature additions
- UI improvements
- Balance changes
- Bug fixes

Do not push to `main` if the news entry is missing.

## 2. Update App Version

Update `src/data/app_version.js` or the current shared version definition on every push.

Version increment rules:

- Small fix: increment patch version
- Larger feature addition: increment minor version
- Large update: increment major version

Confirm that the title screen `VERSION` text uses the updated value.

Do not push to `main` if the version update is missing.

## 3. Verify Before Push

Required checks:

- `node --check` for changed or important JavaScript files
- `npm.cmd run build`
- Runtime console error/warn count: 0

## 4. Commit And Push

Only commit and push after news, version, build, and runtime checks pass.

Push target:

- `origin/main`

Do not force push.

## Completion Report

Every main push completion report must include:

- Updated news title
- News summary
- Previous version
- New version
- Commit hash
- Push result
