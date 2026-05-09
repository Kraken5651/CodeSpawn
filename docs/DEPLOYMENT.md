# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests pass locally: `npm run test:all`
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations created and tested
- [ ] API endpoints documented
- [ ] Performance tested and optimized
- [ ] Security scan completed
- [ ] Backups configured
- [ ] Monitoring and alerting set up
- [ ] Rollback plan documented

---

## Deployment Environments

### Staging

**Purpose**: Test deployment before production
**URL**: https://staging.codespawn.dev
**Data**: Copy of production (weekly)
**Uptime SLA**: 99.0%

### Production

**Purpose**: Live user-facing environment
**URL**: https://api.codespawn.dev, https://codespawn.dev
**Data**: Real user data
**Uptime SLA**: 99.9%

---

## Deployment Platforms

### Option 1: Docker + Kubernetes (Recommended for Scale)

#### Prerequisites
- Docker Registry (Docker Hub, ECR, GCR)
- Kubernetes cluster (EKS, GKE, AKS)
- kubectl CLI
- Helm (for package management)

#### Steps

```bash
# 1. Build and push Docker images
docker build -t yourregistry/codespawn-backend:v1.0.0 ./backend
docker build -t yourregistry/codespawn-frontend:v1.0.0 ./frontend
docker push yourregistry/codespawn-backend:v1.0.0
docker push yourregistry/codespawn-frontend:v1.0.0

# 2. Create Kubernetes namespace
kubectl create namespace codespawn

# 3. Deploy database and cache
# Using Helm
helm install postgres bitnami/postgresql -n codespawn
helm install redis bitnami/redis -n codespawn

# 4. Apply Kubernetes manifests
kubectl apply -f k8s/backend.yaml -n codespawn
kubectl apply -f k8s/frontend.yaml -n codespawn
kubectl apply -f k8s/ingress.yaml -n codespawn

# 5. Verify deployment
kubectl rollout status deployment/backend -n codespawn
kubectl get pods -n codespawn
```

### Option 2: Docker + Docker Swarm

#### Steps

```bash
# 1. Initialize swarm (on manager node)
docker swarm init

# 2. Create overlay network
docker network create -d overlay codespawn

# 3. Create secrets for sensitive data
docker secret create db_password -
docker secret create jwt_secret -

# 4. Deploy stack
docker stack deploy -c docker-compose.prod.yml codespawn

# 5. View services
docker service ls
docker service ps codespawn_backend
```

### Option 3: Traditional Server (DigitalOcean, AWS EC2, Linode)

#### Prerequisites
- Ubuntu 20.04 or similar
- SSH access
- Domain name with DNS configured

#### Steps

```bash
# 1. SSH into server
ssh root@your_server_ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone https://github.com/yourusername/codespawn.git
cd codespawn

# 5. Create production .env
nano .env
# Configure production environment variables

# 6. Create docker-compose.prod.yml (see example below)

# 7. Start services
docker-compose -f docker-compose.prod.yml up -d

# 8. Setup SSL with Certbot
apt install certbot python3-certbot-nginx -y
certbot certonly --nginx -d codespawn.dev -d api.codespawn.dev
```

---

## Docker Compose Production Configuration

**File: docker-compose.prod.yml**

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: yourregistry/codespawn-backend:latest
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: postgres
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: yourregistry/codespawn-frontend:latest
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      REACT_APP_API_URL: https://api.codespawn.dev
      REACT_APP_WS_URL: wss://api.codespawn.dev
    depends_on:
      - backend
    restart: always
    deploy:
      replicas: 2

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - frontend
      - backend
    restart: always

volumes:
  postgres_data:
  redis_data:
```

---

## Nginx Reverse Proxy Configuration

**File: nginx.conf**

```nginx
upstream backend {
    least_conn;
    server backend:5000 max_fails=3 fail_timeout=30s;
    server backend:5000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name codespawn.dev api.codespawn.dev;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name api.codespawn.dev;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # GZIP compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
    
    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket
    location /api/ws {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}

server {
    listen 443 ssl http2;
    server_name codespawn.dev;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    root /usr/share/nginx/html;
    
    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Database Migration in Production

```bash
# 1. Connect to production database
ssh root@production_server

# 2. Backup database before migration (CRITICAL!)
docker-compose exec postgres pg_dump -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Run migrations
docker-compose exec backend npm run migrate

# 4. Verify migration success
docker-compose exec backend npm run migrate:status

# 5. If needed, rollback
docker-compose exec backend npm run migrate:rollback
# Restore from backup if necessary
psql -U $DB_USER $DB_NAME < backup_*.sql
```

---

## Monitoring & Logging

### Health Checks

```bash
# Backend health endpoint
curl https://api.codespawn.dev/api/health

# Response should be
{
  "status": "ok",
  "database": "connected",
  "redis": "connected",
  "uptime": 86400
}
```

### Logging Services

```yaml
# Using ELK Stack (Elasticsearch, Logstash, Kibana)
- Backend logs → Logstash → Elasticsearch → Kibana
- Frontend logs → Sentry or similar

# Or cloud services
- CloudWatch (AWS)
- Stackdriver (GCP)
- Application Insights (Azure)
```

### Key Metrics to Monitor

```
- API response time (target: <200ms)
- Error rate (target: <0.1%)
- Database query time (target: <100ms)
- Memory usage (target: <80%)
- CPU usage (target: <70%)
- Disk usage (target: <80%)
- Code execution timeout rate
- Failed submission rate
```

---

## Security in Production

### Environment Variables

Never commit `.env` to repository!

```bash
# Use secure secrets management
# AWS Secrets Manager
aws secretsmanager create-secret --name codespawn/jwt-secret

# Or use .env.production (gitignored)
# Load via: source .env.production
```

### SSL/TLS Certificates

```bash
# Auto-renewal with Let's Encrypt
apt install certbot python3-certbot-nginx
certbot renew --dry-run  # Test renewal

# Auto-renewal cron job
0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall & Security Groups

```bash
# Only allow necessary ports
# Port 80: HTTP (redirect to HTTPS)
# Port 443: HTTPS
# Port 22: SSH (from specific IPs only)

# Block direct database access
# Block direct Redis access
```

### Rate Limiting

Configure in backend/src/middleware/rateLimit.js:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## Backup & Recovery

### Automated Backups

```bash
# Daily database backup
0 2 * * * docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $DB_USER $DB_NAME | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Weekly S3 upload
0 3 * * 0 aws s3 sync /backups s3://codespawn-backups/

# Retention: Keep 30 days locally, 1 year in S3
```

### Recovery Procedure

```bash
# 1. Stop services
docker-compose -f docker-compose.prod.yml down

# 2. Restore from backup
gunzip < /backups/db_20240101.sql.gz | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER $DB_NAME

# 3. Start services
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify
docker-compose -f docker-compose.prod.yml exec backend npm run migrate:status
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# Load balancer distributes traffic
Load Balancer
    ↓
├── Backend Pod 1 (5000)
├── Backend Pod 2 (5000)
└── Backend Pod 3 (5000)

# Database
├── Primary PostgreSQL (writes)
└── Read Replicas (reads)

# Cache
└── Redis Cluster (multiple nodes)
```

### When to Scale

- CPU > 70% consistently
- Memory > 85%
- API response time > 500ms
- Database connections maxed out
- Queue backlog growing

### Auto-Scaling Configuration

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-autoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Troubleshooting Production Issues

### Service Won't Start

```bash
# Check logs
docker-compose logs backend

# Check resource availability
docker stats

# Verify environment variables
docker-compose config | grep -A5 "backend:"
```

### Database Connection Errors

```bash
# Check database status
docker-compose ps postgres

# Verify connection string
echo $DB_URL

# Test connection
docker-compose exec postgres psql -U $DB_USER -c "SELECT 1"
```

### High Memory Usage

```bash
# Identify leaking process
docker stats --no-stream

# Review logs for memory-intensive operations
docker-compose logs backend | grep -i memory

# Restart service
docker-compose restart backend
```

### Certificate Renewal Issues

```bash
# Test renewal
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal

# Check certificate
openssl x509 -in /etc/letsencrypt/live/codespawn.dev/cert.pem -text -noout
```

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Revert to previous image
docker-compose -f docker-compose.prod.yml down
docker rmi yourregistry/codespawn-backend:v1.1.0
docker-compose -f docker-compose.prod.yml up -d -f docker-compose.old.yml

# 2. Verify health
curl https://api.codespawn.dev/api/health

# 3. Check logs
docker-compose logs backend

# 4. If database migrations caused issue:
docker-compose exec backend npm run migrate:rollback
```

---

## Performance Optimization

### CDN Configuration

```nginx
# Cache frontend assets in CDN
# Using CloudFront, Cloudflare, or similar
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    # Serve from CDN
}
```

### Database Query Optimization

```sql
-- Add indexes for frequent queries
CREATE INDEX idx_problems_published ON problems(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_submissions_user_created ON submissions(user_id, created_at DESC);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM problems WHERE is_published = TRUE;

-- Monitor slow queries
-- Enable slow query log in PostgreSQL
```

### API Response Caching

```javascript
// Cache GET requests in Redis
app.get('/api/problems/:id', (req, res, next) => {
    const cacheKey = `problem:${req.params.id}`;
    redis.get(cacheKey, (err, data) => {
        if (data) return res.json(JSON.parse(data));
        next();
    });
});
```

---

## Maintenance Windows

Schedule maintenance during low-traffic periods:

```
Day: Tuesday
Time: 2:00 AM - 4:00 AM UTC
Frequency: Monthly

Activities:
- Database maintenance (VACUUM, ANALYZE)
- Security updates
- SSL certificate renewal
- Log rotation
- Cache clearing
```

Status page: https://status.codespawn.dev

