# SDMMJTracker - South Dakota Medical Cannabis Patient Portal

## Overview

SDMMJTracker is a HIPAA-compliant web platform designed to help South Dakota medical cannabis patients track their monthly allotments, verify their patient status, find licensed dispensaries, and maintain compliance with state regulations.

## Features

### 🔐 Patient Verification
- Real-time verification against South Dakota Department of Health database
- Secure medical card number and personal information validation
- HIPAA-compliant data handling and encryption

### 📊 Allotment Tracking
- Monthly cannabis allotment monitoring (3 oz limit)
- Purchase history management and tracking
- Automatic allotment reset calculations
- Compliance alerts and notifications

### 🏪 Dispensary Integration
- Licensed dispensary directory with real-time information
- Price comparison tools across dispensaries
- Location-based dispensary search
- Integration with dispensary POS systems

### ⚖️ Compliance Monitoring
- South Dakota medical cannabis law updates
- Automated compliance reporting
- Age-based product restrictions (18-20: edibles only, 21+: all products)
- Purchase limit enforcement

### 📱 Mobile-Responsive Design
- Progressive Web App (PWA) capabilities
- Responsive design for desktop, tablet, and mobile
- Touch-optimized interface
- Offline functionality for critical features

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern responsive design with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
- **Progressive Web App**: Service workers for offline functionality

### Backend Requirements
- **Server**: Node.js, Python (Django/Flask), or PHP
- **Database**: PostgreSQL with encryption for PHI data
- **Authentication**: OAuth 2.0 + JWT tokens
- **API**: RESTful APIs with JSON responses

### Security & Compliance
- **HIPAA Compliance**: Full PHI protection and audit trails
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **Authentication**: Multi-factor authentication (MFA)
- **CSRF Protection**: Token-based CSRF protection on all forms
- **Content Security Policy**: Strict CSP headers

## Installation & Setup

### Prerequisites
- Web server (Apache, Nginx, or similar)
- SSL/TLS certificate (required for HTTPS)
- Database server (PostgreSQL recommended)
- SMTP server for email notifications

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/trillyclub/sdmmjtracker.git
   cd sdmmjtracker
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**
   ```bash
   # For Node.js backend
   npm install

   # For Python backend
   pip install -r requirements.txt

   # For PHP backend
   composer install
   ```

4. **Database Setup**
   ```bash
   # Create database and run migrations
   npm run db:migrate
   # or
   python manage.py migrate
   ```

5. **Configure SSL Certificate**
   ```bash
   # Ensure HTTPS is configured on your web server
   # SDMMJTracker requires HTTPS for HIPAA compliance
   ```

6. **Start the Application**
   ```bash
   npm start
   # or
   python manage.py runserver
   # or configure with your web server
   ```

### Environment Configuration

Create a `.env` file with the following configuration:

```env
# Application Settings
NODE_ENV=production
PORT=3000
APP_URL=https://your-domain.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sdmmjtracker
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# Encryption Keys
APP_SECRET_KEY=your_256_bit_secret_key
ENCRYPTION_KEY=your_aes_256_encryption_key

# SMTP Configuration
SMTP_HOST=your_smtp_server
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

# API Keys
SD_HEALTH_API_KEY=your_sd_health_api_key
GOOGLE_ANALYTICS_ID=your_ga_tracking_id

# Security Settings
CSRF_SECRET=your_csrf_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# HIPAA Compliance
AUDIT_LOG_RETENTION_DAYS=2190  # 6 years
BACKUP_ENCRYPTION_KEY=your_backup_encryption_key
```

## Security Configuration

### Server Security Headers

Configure your web server to include these security headers:

```nginx
# Nginx Configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://medcannabisverify.sd.gov;" always;
```

```apache
# Apache Configuration (.htaccess)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://medcannabisverify.sd.gov;"
```

### Database Security

1. **Enable SSL/TLS for database connections**
2. **Use encrypted storage for PHI data**
3. **Implement row-level security policies**
4. **Regular security updates and patches**
5. **Database access logging and monitoring**

## API Documentation

### Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer your_jwt_token" \
     -H "Content-Type: application/json" \
     https://api.sdmmjtracker.com/v1/patients/verify
```

### Key Endpoints

#### Patient Verification
```
POST /api/v1/patients/verify
Content-Type: application/json

{
  "card_number": "SD123456789",
  "date_of_birth": "1980-01-15",
  "zip_code": "57101"
}
```

#### Get Patient Allotment
```
GET /api/v1/patients/{patient_id}/allotment
Authorization: Bearer {token}
```

#### Record Purchase
```
POST /api/v1/dispensaries/{dispensary_id}/purchases
Content-Type: application/json
Authorization: Bearer {token}

{
  "patient_id": "pat_123",
  "products": [...],
  "total_amount": 132.00
}
```

For complete API documentation, see [API Integration Guide](./Business_Documentation/api-integration-guide.md).

## Deployment

### Production Deployment Checklist

- [ ] HTTPS/SSL certificate configured
- [ ] Environment variables set securely
- [ ] Database backups configured
- [ ] Security headers implemented
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] Error monitoring setup
- [ ] Performance monitoring setup
- [ ] HIPAA compliance review completed

### Monitoring & Maintenance

#### Health Checks
```bash
# Application health endpoint
curl https://your-domain.com/health

# Database connectivity check
curl https://your-domain.com/health/database

# External API connectivity
curl https://your-domain.com/health/external-apis
```

#### Log Monitoring
- Application logs: `/var/log/sdmmjtracker/app.log`
- Security logs: `/var/log/sdmmjtracker/security.log`
- Audit logs: `/var/log/sdmmjtracker/audit.log`
- Error logs: `/var/log/sdmmjtracker/error.log`

## Testing

### Running Tests
```bash
# Unit tests
npm test
# or
python -m pytest

# Integration tests
npm run test:integration

# Security tests
npm run test:security

# HIPAA compliance tests
npm run test:hipaa
```

### Test Coverage
Maintain minimum 80% code coverage for all critical components:
- Patient verification: 95%+
- Data encryption: 100%
- API security: 95%+
- CSRF protection: 100%

## HIPAA Compliance

### Data Protection Requirements
1. **Encryption**: All PHI encrypted with AES-256
2. **Access Controls**: Role-based access with MFA
3. **Audit Logging**: Complete audit trail of PHI access
4. **Data Backup**: Encrypted backups with 6-year retention
5. **Business Associate Agreements**: BAAs with all vendors

### Compliance Monitoring
- Daily automated compliance checks
- Weekly security vulnerability scans
- Monthly HIPAA risk assessments
- Annual third-party security audits

## Contributing

### Development Guidelines
1. Follow HIPAA-compliant coding practices
2. All PHI handling must be encrypted
3. Implement comprehensive error handling
4. Add unit tests for new features
5. Update documentation with changes

### Code Style
- Use ESLint/Prettier for JavaScript
- Follow PEP 8 for Python
- Use PSR-12 for PHP
- Maintain consistent naming conventions

### Security Review Process
1. Code review by security team
2. Automated security scanning
3. HIPAA compliance verification
4. Penetration testing for major changes

## Support & Documentation

### Documentation
- [Business Plan](./Business_Documentation/business-plan.md)
- [Partnership Opportunities](./Business_Documentation/partnership-opportunities.md)
- [API Integration Guide](./Business_Documentation/api-integration-guide.md)
- [Revenue Model](./Business_Documentation/revenue-model.md)

### Legal Documentation
- [Privacy Policy](./Legal_Compliance/privacy-policy.html)
- [Terms of Service](./Legal_Compliance/terms-of-service.html)
- [HIPAA Compliance](./Legal_Compliance/hipaa-compliance.html)
- [Cookie Policy](./Legal_Compliance/cookie-policy.html)

### Technical Support
- **Email**: support@sdmmjtracker.com
- **Phone**: (605) 555-HELP
- **Emergency**: (605) 555-URGENT (24/7 for security issues)
- **Documentation**: https://docs.sdmmjtracker.com

### Security Contact
- **Security Team**: security@sdmmjtracker.com
- **HIPAA Officer**: privacy@sdmmjtracker.com
- **Vulnerability Reports**: security@trillyclub.com

## License

This project is proprietary software owned by Trilly Club LLC. All rights reserved.

## Acknowledgments

- South Dakota Department of Health for regulatory guidance
- HIPAA compliance consulting by [Compliance Partner]
- Security auditing by [Security Firm]
- Cannabis industry partners for requirements and testing

---

**SDMMJTracker** - Empowering South Dakota medical cannabis patients with secure, compliant tracking and verification tools.

For questions, support, or partnership inquiries, contact us at info@sdmmjtracker.com.
