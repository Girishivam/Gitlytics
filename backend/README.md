# Backend

## Local setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql://gitlytics:gitlytics@localhost:5432/gitlytics'
python app.py
```

Health:
`GET http://localhost:5000/api/health`

Repositories:
`GET http://localhost:5000/api/repositories?username=torvalds`
