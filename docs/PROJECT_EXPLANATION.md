# Gitlytics - Interview Explanation

##  explanation
Gitlytics takes information from a GitHub profile, such as repositories, stars, forks and programming languages, and shows it in one simple dashboard with charts.

## Technical explanation
Gitlytics is a full-stack GitHub analytics application. The React frontend sends requests to a Flask REST API. Flask communicates with GitHub's public API, processes repository data and stores a normalized copy in PostgreSQL. The React dashboard presents summary metrics, repository tables and charts. Docker Compose runs the frontend, backend and PostgreSQL services together.

## Request flow
Browser -> React -> Flask REST API -> GitHub API
                               |
                               -> PostgreSQL

## Technologies
- React: frontend UI and dashboard
- Flask: REST API and backend logic
- PostgreSQL: persistent data storage
- GitHub API: repository data source
- Docker: containerization
- Docker Compose: multi-container orchestration

## Resume-safe statement
This version implements GitHub API integration and Docker/PostgreSQL. OAuth and Celery/Redis are planned next features and should not be claimed until implemented.
