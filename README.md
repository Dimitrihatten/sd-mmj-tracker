# SDMMJTracker - South Dakota Medical Cannabis Patient Portal

[![HIPAA Compliant](https://img.shields.io/badge/HIPAA-Compliant-green.svg)](https://www.hhs.gov/hipaa/)
[![SOC 2 Type II](https://img.shields.io/badge/SOC%202-Type%20II-blue.svg)](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html)
[![Security](https://img.shields.io/badge/Security-256--bit%20Encryption-red.svg)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
[![License](https://img.shields.io/badge/License-Proprietary-yellow.svg)](./LICENSE)

## 🌿 Overview

SDMMJTracker is South Dakota's premier medical cannabis patient tracking platform. Built with HIPAA compliance at its core, our platform provides real-time allotment tracking, dispensary discovery, and comprehensive compliance tools for medical cannabis patients in South Dakota.

**Powered by Trilly Club LLC** - Leading cannabis technology solutions since 2023.

## 🚀 Features

### For Patients
- **Real-time Allotment Tracking** - Monitor your monthly cannabis limits
- **Secure Patient Verification** - HIPAA-compliant medical card verification
- **Dispensary Finder** - Locate nearby dispensaries with live inventory
- **Price Comparison** - Compare prices across South Dakota dispensaries
- **Purchase History** - Track your medical cannabis purchases
- **Mobile-Friendly** - Responsive design for all devices

### For Businesses
- **Dispensary Dashboard** - Manage listings and inventory
- **Analytics & Insights** - Real-time market data and consumer behavior
- **API Integration** - Seamless integration with Dutchie, Leafly, and Weedmaps
- **Compliance Tools** - Automated compliance reporting and tracking

### Security & Compliance
- ✅ **HIPAA Compliant** - Full healthcare data protection
- ✅ **SOC 2 Type II Certified** - Enterprise-grade security
- ✅ **256-bit Encryption** - Military-grade data protection
- ✅ **GDPR Compliant** - International privacy standards
- ✅ **Regular Security Audits** - Continuous security monitoring

## 🏗️ Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Security**: CSP headers, HTTPS enforcement, XSS protection
- **Performance**: Optimized assets, lazy loading, compression
- **Compliance**: HIPAA-grade encryption and access controls

## 📦 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- HTTPS-enabled web server (required for HIPAA compliance)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/trillyclub/sdmmjtracker.git
   cd sdmmjtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy to production**
   ```bash
   npm run deploy
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Application Settings
NODE_ENV=production
PORT=3000
HTTPS_ENABLED=true

# HIPAA Compliance
HIPAA_MODE=true
ENCRYPTION_KEY=your-256-bit-encryption-key
AUDIT_LOGGING=true

# API Integration
SD_VERIFICATION_API=https://medcannabisverify.sd.gov/api
DUTCHIE_API_KEY=your-dutchie-api-key
LEAFLY_API_KEY=your-leafly-api-key
WEEDMAPS_API_KEY=your-weedmaps-api-key

# Security
CSP_NONCE=your-csp-nonce
SESSION_SECRET=your-session-secret
```

### Server Configuration

#### Apache (.htaccess)
The included `.htaccess` file provides:
- SPA routing support
- HIPAA-compliant security headers
- HTTPS enforcement
- Static file caching
- Compression

#### Nginx
For Nginx servers, use this configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name www.sdmmjtracker.com;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Routes
    location /api/ {
        # Proxy to your API server
        proxy_pass http://localhost:8080;
    }
}
```

## 📱 API Documentation

### Patient Verification API
```javascript
// Verify patient medical card
POST /api/verify
{
  "cardNumber": "4YBPK2GJ2",
  "dateOfBirth": "1990-01-01"
}
```

### Dispensary API
```javascript
// Get dispensaries by city
GET /api/dispensaries?city=rapid-city&product=flower

// Response
{
  "dispensaries": [
    {
      "id": "genesis-farms",
      "name": "Genesis Farms Cannabis",
      "location": "Rapid City, SD",
      "rating": 4.8,
      "priceRange": "$15-$45/g"
    }
  ]
}
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Security Audit
```bash
npm run security-audit
```

### Performance Testing
```bash
npm run lighthouse
```

### HTML Validation
```bash
npm run validate
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] HTTPS certificate installed
- [ ] CSP headers configured
- [ ] Database backups scheduled
- [ ] Monitoring setup
- [ ] HIPAA audit trail enabled

### Deployment Commands
```bash
# Build production assets
npm run build

# Deploy to server
npm run deploy

# Health check
curl -f https://www.sdmmjtracker.com/health || exit 1
```

## 📊 Monitoring

### Key Metrics
- Patient registration conversion rate
- Dispensary listing completion rate
- API response times
- Security incident reports
- HIPAA compliance audit logs

### Alerts
- Failed login attempts > 5 per minute
- API response time > 2 seconds
- SSL certificate expiration < 30 days
- Database connection failures

## 🔒 Security

### HIPAA Compliance
- All patient health information (PHI) is encrypted at rest and in transit
- Access controls prevent unauthorized data access
- Audit logs track all PHI access and modifications
- Regular security assessments and penetration testing
- Business Associate Agreements (BAAs) with all third-party vendors

### Data Protection
- AES-256 encryption for sensitive data
- HTTPS enforcement with HSTS
- Content Security Policy (CSP) headers
- XSS and CSRF protection
- Rate limiting on API endpoints

## 📋 Legal Compliance

### South Dakota Laws
- Compliant with SD Medical Cannabis Program regulations
- Patient possession limits enforced (3 oz/month)
- Age restrictions implemented (18-20: edibles only, 21+: all products)
- Caregiver purchase tracking

### Federal Compliance
- Does not facilitate interstate commerce
- No financial transactions processed
- Information-only platform
- Compliant with federal banking regulations

## 🤝 Contributing

### For Trilly Club LLC Team Members
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Code Standards
- Use ESLint and Prettier for code formatting
- Follow WCAG 2.1 AA accessibility guidelines
- Maintain HIPAA compliance in all code changes
- Write comprehensive tests for new features

## 📞 Support

### Technical Support
- **Email**: support@sdmmjtracker.com
- **Phone**: (605) 555-0123
- **Hours**: Monday-Friday, 8 AM - 6 PM CST

### Emergency Security Issues
- **Email**: security@sdmmjtracker.com
- **Response Time**: < 2 hours
- **After Hours**: (605) 555-0199

### HIPAA Compliance Officer
- **Email**: compliance@trillyclub.com
- **Phone**: (605) 555-0145

## 📄 License

This project is proprietary software owned by Trilly Club LLC. All rights reserved.

**Copyright © 2024 Trilly Club LLC**

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited and may result in legal action.

## 🏆 Certifications

- **HIPAA Compliant** - Verified by third-party audit
- **SOC 2 Type II** - Annual compliance certification
- **ISO 27001** - Information security management
- **NIST Cybersecurity Framework** - Federal security standards

## 📈 Roadmap

### Q1 2025
- [ ] iOS mobile app launch
- [ ] Android mobile app launch
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Spanish)

### Q2 2025
- [ ] Telemedicine integration
- [ ] AI-powered strain recommendations
- [ ] Expanded dispensary network
- [ ] Caregiver portal enhancements

### Q3 2025
- [ ] Interstate commerce preparation
- [ ] Blockchain verification system
- [ ] Advanced reporting tools
- [ ] API marketplace launch

---

**Built with ❤️ in South Dakota by Trilly Club LLC**

*Empowering patients through technology while maintaining the highest standards of privacy and compliance.*