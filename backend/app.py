import os
from datetime import datetime

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Repository(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    github_id = db.Column(db.BigInteger, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    stars = db.Column(db.Integer, default=0)
    forks = db.Column(db.Integer, default=0)
    language = db.Column(db.String(100))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


def create_app():
    app = Flask(__name__)
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://gitlytics:gitlytics@localhost:5432/gitlytics",
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()

    @app.get("/api/health")
    def health():
        return jsonify({"status": "healthy", "service": "gitlytics-api"})

    @app.get("/api/repositories")
    def repositories():
        username = request.args.get("username", "").strip()
        if not username:
            return jsonify({"error": "username is required"}), 400

        url = f"https://api.github.com/users/{username}/repos"
        params = {"per_page": 100, "sort": "updated"}
        response = requests.get(url, params=params, timeout=15)

        if response.status_code == 404:
            return jsonify({"error": "GitHub user not found"}), 404
        if response.status_code != 200:
            return jsonify({"error": "GitHub API request failed"}), 502

        data = response.json()
        repositories = []

        for item in data:
            repo = Repository.query.filter_by(github_id=item["id"]).first()
            if not repo:
                repo = Repository(github_id=item["id"])
                db.session.add(repo)

            repo.name = item["name"]
            repo.full_name = item["full_name"]
            repo.stars = item["stargazers_count"]
            repo.forks = item["forks_count"]
            repo.language = item["language"]
            repo.updated_at = datetime.utcnow()

            repositories.append({
                "name": item["name"],
                "full_name": item["full_name"],
                "stars": item["stargazers_count"],
                "forks": item["forks_count"],
                "language": item["language"],
                "html_url": item["html_url"],
            })

        db.session.commit()

        total_stars = sum(r["stars"] for r in repositories)
        total_forks = sum(r["forks"] for r in repositories)
        languages = {}
        for r in repositories:
            if r["language"]:
                languages[r["language"]] = languages.get(r["language"], 0) + 1

        return jsonify({
            "username": username,
            "summary": {
                "repositories": len(repositories),
                "stars": total_stars,
                "forks": total_forks,
                "languages": languages,
            },
            "repositories": repositories,
        })

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
