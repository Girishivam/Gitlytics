# Gitlytics

GitHub analytics dashboard built with Flask, React, PostgreSQL and Docker.

## Features
- React dashboard
- Flask REST API
- PostgreSQL database
- GitHub public API integration
- Repository, stars, forks, language and commit statistics
- Docker Compose setup

## Quick start

### Option A: Docker
```bash
docker compose up --build
```
Open http://localhost

### Option B: Backend locally
See `backend/README.md`.

## Important
This MVP uses GitHub's public API for a supplied GitHub username. It does not yet implement GitHub OAuth, Celery or Redis. Those can be added as the next version rather than claiming them before they are implemented.
