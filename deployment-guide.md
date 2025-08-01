# Deployment Guide - Business Management System

## Overview

This guide covers deploying the white-label business management system to production environments, including server setup, environment configuration, and ongoing maintenance procedures.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 14.0 or higher  
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB available space
- **Network**: HTTPS capability with valid SSL certificate

### Development Tools
- Git for version control
- npm or yarn package manager
- Database administration tool (pgAdmin, DBeaver, etc.)
- Process manager (PM2 recommended)

## Environment Setup

### 1. Server Preparation

**Ubuntu/Debian:**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2
```

**CentOS/RHEL:**
```bash
# Update system packages
sudo yum update -y

# Install Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Database Configuration

**Create Database and User:**
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE business_management;

-- Create user with password
CREATE USER bms_user WITH ENCRYPTED PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE business_management TO bms_user;

-- Exit PostgreSQL
\q
```

**Configure PostgreSQL for remote connections (if needed):**
```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add/modify:
listen_addresses = '*'

# Edit pg_hba.conf for authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add line for application connection:
host    business_management    bms_user    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Application Deployment

### 1. Clone and Setup

```bash
# Clone repository
git clone <your-repository-url> business-management-system
cd business-management-system

# Install dependencies
npm install

# Build application
npm run build
```

### 2. Environment Configuration

**Create production environment file:**
```bash
# Create .env file
nano .env
```

**Environment variables:**
```env
# Application Settings
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://bms_user:secure_password_here@localhost:5432/business_management
PGHOST=localhost
PGPORT=5432
PGDATABASE=business_management
PGUSER=bms_user
PGPASSWORD=secure_password_here

# Session Security
SESSION_SECRET=your_very_secure_session_secret_here_at_least_32_characters

# Email Configuration (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Company Configuration
COMPANY_NAME="Your Company Name"
COMPANY_TAGLINE="Your Services Description"
SUPPORT_EMAIL="support@yourcompany.com"
```

### 3. Database Migration

```bash
# Push database schema
npm run db:push

# Verify database tables
psql -U bms_user -d business_management -c "\dt"
```

### 4. Application Testing

```bash
# Test application startup
npm start

# Verify application is responding
curl http://localhost:5000/api/health

# Stop test instance
Ctrl+C
```

## Production Deployment

### 1. PM2 Process Management

**Create PM2 ecosystem file:**
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'business-management-system',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000
  }]
};
```

**Start application with PM2:**
```bash
# Create logs directory
mkdir logs

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 2. Nginx Reverse Proxy Setup

**Install Nginx:**
```bash
sudo apt-get install -y nginx
```

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/business-management
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Client upload size
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable and start Nginx:**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/business-management /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. SSL Certificate Setup

**Using Let's Encrypt (Certbot):**
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

**Using Custom Certificate:**
```bash
# Copy certificate files
sudo cp your-certificate.crt /etc/ssl/certs/
sudo cp your-private.key /etc/ssl/private/

# Set proper permissions
sudo chmod 644 /etc/ssl/certs/your-certificate.crt
sudo chmod 600 /etc/ssl/private/your-private.key
```

## Monitoring and Maintenance

### 1. Log Management

**PM2 Log Management:**
```bash
# View logs
pm2 logs business-management-system

# Rotate logs
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

**System Log Configuration:**
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/business-management
```

```
/path/to/business-management-system/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Database Backup

**Automated Backup Script:**
```bash
nano backup-database.sh
```

```bash
#!/bin/bash

# Configuration
DB_NAME="business_management"
DB_USER="bms_user"
BACKUP_DIR="/var/backups/business-management"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/$FILENAME

# Compress backup
gzip $BACKUP_DIR/$FILENAME

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/${FILENAME}.gz"
```

**Setup Cron Job:**
```bash
# Make script executable
chmod +x backup-database.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add line:
0 2 * * * /path/to/backup-database.sh
```

### 3. Application Monitoring

**Health Check Endpoint:**
```bash
# Test application health
curl https://yourdomain.com/api/health
```

**PM2 Monitoring:**
```bash
# Monitor processes
pm2 monit

# Check status
pm2 status

# View resource usage
pm2 show business-management-system
```

**Database Monitoring:**
```sql
-- Check database connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'business_management';

-- Check database size
SELECT pg_size_pretty(pg_database_size('business_management'));

-- Check table sizes
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Security Hardening

### 1. Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (if remote access needed)
sudo ufw allow 5432/tcp

# Check status
sudo ufw status verbose
```

### 2. Application Security

**Environment Variables Security:**
```bash
# Secure .env file
chmod 600 .env
chown root:root .env
```

**Database Security:**
```sql
-- Revoke unnecessary privileges
REVOKE ALL ON SCHEMA information_schema FROM bms_user;
REVOKE ALL ON SCHEMA pg_catalog FROM bms_user;

-- Set row level security (if needed)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
```

## Troubleshooting

### Common Issues

**Application Won't Start:**
```bash
# Check PM2 logs
pm2 logs business-management-system

# Check if port is in use
sudo netstat -tlnp | grep :5000

# Verify environment variables
pm2 env 0
```

**Database Connection Issues:**
```bash
# Test database connection
psql -U bms_user -h localhost -d business_management

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

**SSL Certificate Issues:**
```bash
# Check certificate validity
sudo certbot certificates

# Test SSL configuration
curl -I https://yourdomain.com

# Check Nginx configuration
sudo nginx -t
```

### Performance Optimization

**Database Optimization:**
```sql
-- Analyze database performance
ANALYZE;

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Vacuum and reindex
VACUUM ANALYZE;
REINDEX DATABASE business_management;
```

**Application Optimization:**
```bash
# Monitor memory usage
pm2 show business-management-system

# Restart application if needed
pm2 restart business-management-system

# Update application
git pull origin main
npm run build
pm2 restart business-management-system
```

## Update Procedures

### 1. Application Updates

```bash
# Backup current version
cp -r /path/to/business-management-system /backup/business-management-system-$(date +%Y%m%d)

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build application
npm run build

# Run database migrations (if any)
npm run db:push

# Restart application
pm2 restart business-management-system

# Verify deployment
curl https://yourdomain.com/api/health
```

### 2. Rollback Procedures

```bash
# Stop application
pm2 stop business-management-system

# Restore previous version
rm -rf /path/to/business-management-system
cp -r /backup/business-management-system-YYYYMMDD /path/to/business-management-system

# Restore database (if needed)
psql -U bms_user -d business_management < /var/backups/business-management/backup_YYYYMMDD_HHMMSS.sql

# Start application
pm2 start business-management-system
```

## White-Label Deployment Considerations

### Multiple Client Deployments

**Subdomain Strategy:**
```nginx
# client1.yourdomain.com
server {
    server_name client1.yourdomain.com;
    # ... configuration for client 1
}

# client2.yourdomain.com  
server {
    server_name client2.yourdomain.com;
    # ... configuration for client 2
}
```

**Environment-based Configuration:**
```bash
# Client-specific environment files
.env.client1
.env.client2

# Start with specific configuration
pm2 start ecosystem.config.js --env client1
```

---

## Support Checklist

Before going live:
- [ ] Database is properly configured and backed up
- [ ] SSL certificate is installed and working
- [ ] All environment variables are set correctly
- [ ] Application starts and responds to health checks
- [ ] Nginx reverse proxy is configured
- [ ] Firewall rules are in place
- [ ] Monitoring and logging are working
- [ ] Backup procedures are tested
- [ ] Update procedures are documented
- [ ] Rollback procedures are tested