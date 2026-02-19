# Production Deployment Guide

## ✅ Pre-Deployment Checklist

### Security
- [ ] Generate and set `SECRET_KEY` in environment variables
- [ ] Rotate all API keys (Supabase, etc.)
- [ ] Remove `.env` files from git history
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DEBUG=False`
- [ ] Configure HTTPS/SSL certificates
- [ ] Update CORS origins to production domains
- [ ] Enable database encryption
- [ ] Set up firewall rules
- [ ] Configure rate limiting (consider Redis)

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Enable database encryption at rest
- [ ] Set up database monitoring

### Infrastructure
- [ ] Set up load balancer
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (Sentry, DataDog, etc.)
- [ ] Configure logging aggregation
- [ ] Set up health check endpoints
- [ ] Configure auto-scaling

### Compliance
- [ ] Review HIPAA compliance requirements
- [ ] Review GDPR compliance requirements
- [ ] Set up audit logging
- [ ] Configure data retention policies
- [ ] Set up patient consent tracking
- [ ] Create privacy policy
- [ ] Create terms of service

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Environment
ENVIRONMENT=production
DEBUG=False

# Database (PostgreSQL recommended for production)
DATABASE_URL=postgresql+asyncpg://user:password@db-host:5432/pharmaguard

# Security (REQUIRED)
SECRET_KEY=<generate-with-openssl-rand-hex-32>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

# Rate Limiting (use Redis in production)
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60

# File Upload
MAX_UPLOAD_SIZE=5242880

# Logging
LOG_LEVEL=WARNING

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

### Frontend (.env)

```bash
# API
VITE_API_URL=https://api.yourdomain.com

# Supabase (if using)
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

---

## 🚀 Deployment Steps

### 1. Generate Secret Key

```bash
# Generate a secure secret key
openssl rand -hex 32
```

### 2. Set Up PostgreSQL Database

```bash
# Create database
createdb pharmaguard

# Run migrations
cd backend
alembic upgrade head
```

### 3. Build Frontend

```bash
cd pharmaguard-clinical-insights-main
npm run build

# Output will be in dist/ directory
```

### 4. Deploy Backend

#### Option A: Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```bash
# Build and run
docker build -t pharmaguard-backend .
docker run -p 8000:8000 --env-file .env pharmaguard-backend
```

#### Option B: Systemd Service

```ini
# /etc/systemd/system/pharmaguard.service
[Unit]
Description=PharmaGuard API
After=network.target

[Service]
Type=notify
User=pharmaguard
WorkingDirectory=/opt/pharmaguard/backend
Environment="PATH=/opt/pharmaguard/venv/bin"
EnvironmentFile=/opt/pharmaguard/backend/.env
ExecStart=/opt/pharmaguard/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable pharmaguard
sudo systemctl start pharmaguard
```

### 5. Deploy Frontend

#### Option A: Nginx

```nginx
# /etc/nginx/sites-available/pharmaguard
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    root /var/www/pharmaguard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pharmaguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Monitoring Setup

### 1. Application Monitoring (Sentry)

```python
# In backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if settings.environment == "production":
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        environment=settings.environment,
    )
```

### 2. Health Checks

Set up monitoring for:
- `/health` endpoint (every 30 seconds)
- Database connectivity
- API response times
- Error rates

### 3. Logging

```python
# Use structured logging
from pythonjsonlogger import jsonlogger

logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
```

---

## 🔒 Security Hardening

### 1. Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. SSL/TLS Configuration

```bash
# Use Let's Encrypt for free SSL
sudo certbot --nginx -d yourdomain.com
```

### 3. Database Security

```sql
-- Create read-only user for reporting
CREATE USER pharmaguard_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE pharmaguard TO pharmaguard_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pharmaguard_readonly;

-- Enable SSL connections
ALTER SYSTEM SET ssl = on;
```

### 4. Rate Limiting with Redis

```python
# Install: pip install redis slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)
limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/v1/analyze")
@limiter.limit("10/minute")
async def analyze_vcf(...):
    ...
```

---

## 🧪 Testing Before Deployment

### 1. Security Testing

```bash
# Run security audit
npm audit
pip-audit

# Test SSL configuration
ssllabs.com/ssltest

# Penetration testing
OWASP ZAP or Burp Suite
```

### 2. Load Testing

```bash
# Install locust
pip install locust

# Run load test
locust -f load_test.py --host=https://yourdomain.com
```

### 3. Smoke Tests

```bash
# Test health endpoint
curl https://yourdomain.com/health

# Test API endpoint
curl -X POST https://yourdomain.com/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d @test_data.json
```

---

## 📋 Post-Deployment

### 1. Monitoring Dashboard

Set up dashboards for:
- Request rate
- Error rate
- Response time (p50, p95, p99)
- Database connections
- Memory usage
- CPU usage

### 2. Alerts

Configure alerts for:
- Error rate > 1%
- Response time > 2s
- Database connection failures
- Disk space < 20%
- Memory usage > 80%

### 3. Backup Strategy

```bash
# Daily database backups
0 2 * * * pg_dump pharmaguard | gzip > /backups/pharmaguard_$(date +\%Y\%m\%d).sql.gz

# Retain backups for 30 days
find /backups -name "pharmaguard_*.sql.gz" -mtime +30 -delete
```

---

## 🆘 Rollback Plan

### 1. Database Rollback

```bash
# Rollback migration
alembic downgrade -1
```

### 2. Application Rollback

```bash
# Docker
docker pull pharmaguard-backend:previous-tag
docker-compose up -d

# Systemd
sudo systemctl stop pharmaguard
# Restore previous version
sudo systemctl start pharmaguard
```

---

## 📞 Support & Maintenance

### Regular Tasks

- **Daily**: Check error logs and monitoring dashboards
- **Weekly**: Review security alerts and update dependencies
- **Monthly**: Security audit and penetration testing
- **Quarterly**: Disaster recovery drill

### Emergency Contacts

- DevOps Team: devops@yourdomain.com
- Security Team: security@yourdomain.com
- On-Call: +1-XXX-XXX-XXXX

---

## 📚 Additional Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)
- [GDPR Guidelines](https://gdpr.eu/)

---

**Last Updated**: 2026-02-19  
**Version**: 1.0.0
