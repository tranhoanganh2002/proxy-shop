# Deployment Guide - Proxy Shop

## 📋 Prerequisites

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Minimum 2GB RAM, 2 CPU cores
- 20GB disk space
- Node.js 18+ installed
- PostgreSQL 15+ installed
- Redis 7+ installed
- Nginx installed
- Domain name with DNS configured

### Local Requirements
- Git
- SSH access to server
- SSL certificate (Let's Encrypt recommended)

## 🚀 Deployment Steps

### 1. Server Preparation

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Install Redis
```bash
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis
```

#### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE proxyshop;
CREATE USER proxyshop WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE proxyshop TO proxyshop;
\q
```

### 3. Clone and Setup Backend

```bash
# Create application directory
sudo mkdir -p /var/www/proxy-shop
sudo chown -R $USER:$USER /var/www/proxy-shop
cd /var/www/proxy-shop

# Clone repository
git clone https://github.com/yourusername/proxy-shop.git .

# Setup backend
cd backend
npm install --production

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://proxyshop:your-secure-password@localhost:5432/proxyshop
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
# Add other environment variables...
EOF

# Build application
npm run build

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start with PM2
pm2 start dist/main.js --name proxy-shop-backend
pm2 save
pm2 startup
```

### 4. Setup Frontend

```bash
cd /var/www/proxy-shop/frontend
npm install

# Create .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ZALO_SUPPORT_LINK=https://zalo.me/your-zalo-id
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name proxy-shop-frontend -- start
pm2 save
```

### 5. Configure Nginx

#### Backend Configuration
```bash
sudo nano /etc/nginx/sites-available/proxy-shop-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Configuration
```bash
sudo nano /etc/nginx/sites-available/proxy-shop-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Sites
```bash
sudo ln -s /etc/nginx/sites-available/proxy-shop-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/proxy-shop-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 7. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 8. Setup Monitoring

#### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y
```

## 🔄 Deployment Updates

### Update Backend
```bash
cd /var/www/proxy-shop/backend
git pull origin main
npm install
npm run build
npm run prisma:generate
npm run prisma:migrate
pm2 restart proxy-shop-backend
```

### Update Frontend
```bash
cd /var/www/proxy-shop/frontend
git pull origin main
npm install
npm run build
pm2 restart proxy-shop-frontend
```

## 💾 Backup Configuration

### Automated Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-proxyshop.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/proxyshop"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U proxyshop proxyshop | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-proxyshop.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-proxyshop.sh
```

## 🔍 Monitoring & Logs

### View Logs
```bash
# PM2 logs
pm2 logs proxy-shop-backend
pm2 logs proxy-shop-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### PM2 Monitoring
```bash
pm2 monit
pm2 status
```

## 🚨 Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs proxy-shop-backend

# Check environment variables
cat /var/www/proxy-shop/backend/.env

# Check database connection
cd /var/www/proxy-shop/backend
npx prisma db pull
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='proxyshop';"
```

### Frontend Build Errors
```bash
# Clear cache and rebuild
cd /var/www/proxy-shop/frontend
rm -rf .next node_modules
npm install
npm run build
```

## 🔐 Security Hardening

### PostgreSQL
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Allow only local connections
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
```

### Redis
```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Bind to localhost only
bind 127.0.0.1
requirepass your-redis-password
```

### Nginx
```bash
# Add security headers
sudo nano /etc/nginx/snippets/security-headers.conf
```

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

Include in site configs:
```nginx
include snippets/security-headers.conf;
```

## 📊 Performance Optimization

### Enable Gzip Compression
```bash
sudo nano /etc/nginx/nginx.conf
```

Uncomment gzip settings:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript 
           application/json application/javascript application/xml+rss;
```

### Enable Caching
Add to Nginx site configs:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## ✅ Post-Deployment Checklist

- [ ] All services running (PM2, PostgreSQL, Redis, Nginx)
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Firewall configured
- [ ] Automated backups set up
- [ ] Monitoring tools configured
- [ ] Security headers enabled
- [ ] Logs rotation configured
- [ ] DNS properly configured
- [ ] Test all critical features
- [ ] Performance optimization applied
- [ ] Security scan completed

## 📞 Support

For deployment issues:
- Email: admin@example.com
- Documentation: See README.md and SECURITY.md

---

**Last Updated:** 2024-01-12  
**Deployment Version:** 1.0.0
