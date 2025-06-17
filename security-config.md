# SDMMJTracker Security Configuration Guide

## Overview

This document provides comprehensive security configuration guidelines for deploying SDMMJTracker in a production environment. All configurations are designed to meet HIPAA compliance requirements and industry security best practices.

## Server Security Configuration

### Web Server Security Headers

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/sdmmjtracker
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sdmmjtracker.com www.sdmmjtracker.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/sdmmjtracker.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sdmmjtracker.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    # SSL Protocols and Ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (ngx_http_headers_module is required)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://medcannabisverify.sd.gov https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

    # Hide Nginx version
    server_tokens off;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=general:10m rate=200r/m;

    # Document Root
    root /var/www/sdmmjtracker/public;
    index index.html index.php;

    # API Rate Limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Login Rate Limiting
    location /login {
        limit_req zone=login burst=3 nodelay;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # General Rate Limiting
    location / {
        limit_req zone=general burst=50 nodelay;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Security: Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|log|ini)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Enable GZIP compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Log Configuration
    access_log /var/log/nginx/sdmmjtracker_access.log;
    error_log /var/log/nginx/sdmmjtracker_error.log;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sdmmjtracker.com www.sdmmjtracker.com;
    return 301 https://$server_name$request_uri;
}
```

#### Apache Configuration

```apache
# /etc/apache2/sites-available/sdmmjtracker.conf
<VirtualHost *:443>
    ServerName sdmmjtracker.com
    ServerAlias www.sdmmjtracker.com
    DocumentRoot /var/www/sdmmjtracker/public

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/sdmmjtracker.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/sdmmjtracker.com/privkey.pem
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder on

    # Security Headers
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://medcannabisverify.sd.gov;"

    # Hide Apache version
    ServerTokens Prod
    ServerSignature Off

    # Rate Limiting (requires mod_evasive)
    DOSHashTableSize    2048
    DOSPageCount        5
    DOSSiteCount        100
    DOSPageInterval     1
    DOSSiteInterval     1
    DOSBlockingPeriod   600

    # Directory Security
    <Directory "/var/www/sdmmjtracker/public">
        Options -Indexes -Includes
        AllowOverride All
        Require all granted
    </Directory>

    # Deny access to sensitive files
    <FilesMatch "\.(env|log|ini|conf)$">
        Require all denied
    </FilesMatch>

    # Log Configuration
    LogLevel warn
    CustomLog /var/log/apache2/sdmmjtracker_access.log combined
    ErrorLog /var/log/apache2/sdmmjtracker_error.log
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName sdmmjtracker.com
    ServerAlias www.sdmmjtracker.com
    Redirect permanent / https://sdmmjtracker.com/
</VirtualHost>
```

## Database Security Configuration

### PostgreSQL Security Settings

```sql
-- /etc/postgresql/14/main/postgresql.conf

# Connection Settings
listen_addresses = 'localhost'
port = 5432
max_connections = 100

# SSL Settings
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL'
ssl_prefer_server_ciphers = on

# Logging
log_destination = 'csvlog'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'ddl'
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0

# Security
shared_preload_libraries = 'pg_stat_statements,auto_explain'
track_functions = all
```

```sql
-- Database Security Setup
-- /var/lib/postgresql/security_setup.sql

-- Create database with encryption
CREATE DATABASE sdmmjtracker 
    WITH ENCODING 'UTF8' 
    LC_COLLATE = 'en_US.UTF-8' 
    LC_CTYPE = 'en_US.UTF-8';

-- Create application user with limited privileges
CREATE USER sdmmj_app WITH PASSWORD 'secure_random_password_here';

-- Grant only necessary privileges
GRANT CONNECT ON DATABASE sdmmjtracker TO sdmmj_app;
GRANT USAGE ON SCHEMA public TO sdmmj_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sdmmj_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sdmmj_app;

-- Enable row-level security
ALTER DATABASE sdmmjtracker SET row_security = on;

-- Create audit table for HIPAA compliance
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    user_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### Database Connection Security

```javascript
// Database connection with SSL (Node.js example)
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync('/path/to/ca.crt').toString(),
        cert: fs.readFileSync('/path/to/client.crt').toString(),
        key: fs.readFileSync('/path/to/client.key').toString(),
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

## Application Security Configuration

### Environment Variables Security

```bash
# /etc/systemd/system/sdmmjtracker.service
[Unit]
Description=SDMMJTracker Application
After=network.target

[Service]
Type=simple
User=sdmmjtracker
WorkingDirectory=/var/www/sdmmjtracker
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

# Secure environment variables
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/etc/sdmmjtracker/environment

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/sdmmjtracker/storage
ReadWritePaths=/var/log/sdmmjtracker

[Install]
WantedBy=multi-user.target
```

```bash
# /etc/sdmmjtracker/environment (secured with 600 permissions)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sdmmjtracker
DB_USER=sdmmj_app
DB_PASSWORD=secure_database_password_here
APP_SECRET_KEY=256_bit_secret_key_here
ENCRYPTION_KEY=aes_256_encryption_key_here
CSRF_SECRET=csrf_protection_secret_here
JWT_SECRET=jwt_signing_secret_here
SESSION_SECRET=session_encryption_secret_here
```

### CSRF Protection Configuration

```javascript
// CSRF protection middleware (Express.js example)
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({
    cookie: {
        httpOnly: true,
        secure: true, // HTTPS only
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
    }
}));

// Make CSRF token available to templates
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
```

### Session Security Configuration

```javascript
// Secure session configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        secure: true, // HTTPS only
        httpOnly: true,
        maxAge: 1800000, // 30 minutes
        sameSite: 'strict'
    },
    name: 'sdmmj_session', // Don't use default session name
    genid: () => {
        return require('crypto').randomBytes(32).toString('hex');
    }
}));
```

## Firewall Configuration

### UFW (Ubuntu Firewall) Setup

```bash
#!/bin/bash
# Firewall configuration script

# Reset firewall to defaults
ufw --force reset

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (change port if not default)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow database connections (internal only)
ufw allow from 10.0.0.0/8 to any port 5432

# Allow specific monitoring services
ufw allow from monitoring_server_ip to any port 9100

# Enable firewall
ufw enable

# Show status
ufw status verbose
```

### iptables Configuration

```bash
#!/bin/bash
# iptables rules for enhanced security

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Set default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established and related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Rate limiting for HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -m limit --limit 100/min --limit-burst 200 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m limit --limit 100/min --limit-burst 200 -j ACCEPT

# Drop all other traffic
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4
```

## Monitoring and Alerting

### Security Event Monitoring

```bash
# /etc/rsyslog.d/50-sdmmjtracker.conf
# Log security events for monitoring

# Authentication logs
auth,authpriv.*                  /var/log/auth.log

# Application security logs
local0.*                         /var/log/sdmmjtracker/security.log

# HIPAA audit logs
local1.*                         /var/log/sdmmjtracker/audit.log

# Forward logs to SIEM (if available)
*.* @@siem.example.com:514
```

```javascript
// Security event logging (Node.js example)
const winston = require('winston');

const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: '/var/log/sdmmjtracker/security.log',
            level: 'warn'
        }),
        new winston.transports.File({ 
            filename: '/var/log/sdmmjtracker/audit.log',
            level: 'info'
        })
    ]
});

// Log security events
function logSecurityEvent(event, details) {
    securityLogger.warn({
        event: event,
        details: details,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
}
```

### Intrusion Detection

```bash
# Install and configure fail2ban
apt-get install fail2ban

# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10

[sdmmjtracker-auth]
enabled = true
filter = sdmmjtracker-auth
logpath = /var/log/sdmmjtracker/security.log
maxretry = 5
```

## Backup Security

### Encrypted Backup Configuration

```bash
#!/bin/bash
# Secure backup script with encryption

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/sdmmjtracker"
DATABASE_NAME="sdmmjtracker"
ENCRYPTION_KEY="/etc/sdmmjtracker/backup.key"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup with encryption
pg_dump $DATABASE_NAME | gzip | gpg --cipher-algo AES256 --compress-algo 2 --symmetric --output $BACKUP_DIR/db_$BACKUP_DATE.sql.gz.gpg

# Application files backup with encryption
tar -czf - /var/www/sdmmjtracker --exclude='node_modules' --exclude='*.log' | gpg --cipher-algo AES256 --compress-algo 2 --symmetric --output $BACKUP_DIR/app_$BACKUP_DATE.tar.gz.gpg

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.gpg" -mtime +30 -delete

# Verify backup integrity
gpg --quiet --batch --decrypt $BACKUP_DIR/db_$BACKUP_DATE.sql.gz.gpg > /dev/null
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_DATE"
else
    echo "Backup verification failed: $BACKUP_DATE"
    exit 1
fi
```

## Security Maintenance

### Regular Security Updates

```bash
#!/bin/bash
# Automated security update script

# Update package lists
apt-get update

# Install security updates only
apt-get -y upgrade

# Update SSL certificates
certbot renew --quiet

# Restart services if needed
systemctl reload nginx
systemctl restart sdmmjtracker

# Log update completion
echo "Security updates completed: $(date)" >> /var/log/security-updates.log
```

### Security Monitoring Checklist

Daily:
- [ ] Review authentication logs for suspicious activity
- [ ] Check SSL certificate expiration dates
- [ ] Monitor failed login attempts
- [ ] Review application error logs

Weekly:
- [ ] Update system packages and security patches
- [ ] Review firewall logs
- [ ] Check backup integrity
- [ ] Scan for malware and vulnerabilities

Monthly:
- [ ] Review user access permissions
- [ ] Update security documentation
- [ ] Conduct security risk assessment
- [ ] Review and update incident response procedures

Quarterly:
- [ ] Penetration testing
- [ ] Security audit by third party
- [ ] HIPAA compliance review
- [ ] Disaster recovery testing

## Incident Response

### Security Incident Response Plan

```bash
#!/bin/bash
# Security incident response script

INCIDENT_ID=$(date +%Y%m%d_%H%M%S)
INCIDENT_LOG="/var/log/incidents/incident_$INCIDENT_ID.log"

echo "Security incident detected: $INCIDENT_ID" | tee -a $INCIDENT_LOG
echo "Timestamp: $(date)" | tee -a $INCIDENT_LOG

# Immediate response actions
echo "1. Isolating affected systems..." | tee -a $INCIDENT_LOG
# Add specific isolation commands here

echo "2. Preserving evidence..." | tee -a $INCIDENT_LOG
# Copy relevant logs and system state

echo "3. Notifying security team..." | tee -a $INCIDENT_LOG
# Send alerts to security team

echo "4. Beginning containment procedures..." | tee -a $INCIDENT_LOG
# Implement containment measures

# Continue with investigation and recovery
```

This security configuration provides a comprehensive foundation for protecting SDMMJTracker in a production environment while maintaining HIPAA compliance requirements.
