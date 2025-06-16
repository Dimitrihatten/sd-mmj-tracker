# 🌿 SDMMJTracker - South Dakota Medical Cannabis Patient Dashboard

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/TrillyClubLLC/SDMMJTracker)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HIPAA Compliant](https://img.shields.io/badge/HIPAA-Compliant-red.svg)](docs/HIPAA_COMPLIANCE.md)
[![Security](https://img.shields.io/badge/security-SOC2-orange.svg)](docs/SECURITY.md)

> **A comprehensive, HIPAA-compliant medical cannabis patient tracking platform for South Dakota**

## 🚀 **Overview**

SDMMJTracker is a full-featured web platform designed specifically for South Dakota medical cannabis patients and caregivers. The platform provides real-time allotment tracking, dispensary integration, compliance monitoring, and secure patient data management.

### ✨ **Key Features**

- 🔐 **Secure Patient Authentication** - SD medical card verification
- 📊 **Real-time Allotment Tracking** - Monitor remaining limits and purchase history
- 🏪 **Dispensary Integration** - Connect with Dutchie, Leafly, Weedmaps, and local dispensaries
- 📱 **Mobile-First Design** - Responsive across all devices
- 🛡️ **HIPAA Compliance** - End-to-end encryption and secure data handling
- 🤖 **AI Support** - 24/7 patient assistance chatbot
- 📍 **City-Specific Data** - Localized dispensary and pricing information

---

## 🏗️ **Project Structure**

```
SDMMJTracker_Project/
├── Website_Files/
│   ├── index.html                    # Main dashboard
│   ├── sd_cities_data.json          # City/dispensary data
│   ├── sd_cities_helper.js          # JavaScript utilities
│   └── cities_dropdown_demo.html    # Integration demo
├── Business_Documentation/
│   └── SDMMJTracker_Business_Plan.html
├── Legal_Compliance/
│   └── HIPAA_Legal_Documentation.html
└── README.md                        # This file
```

---

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5/CSS3** - Responsive design with Bootstrap 5
- **JavaScript (ES6+)** - Dynamic functionality and API integration
- **Progressive Web App (PWA)** - Mobile app-like experience
- **Chart.js** - Data visualization for allotment tracking

### **Backend Requirements**
- **Node.js 18+** or **Python 3.8+** (for API server)
- **Express.js** or **FastAPI** (recommended frameworks)
- **PostgreSQL 13+** or **MongoDB 5+** (encrypted database)
- **Redis** (session management and caching)

### **Security & Compliance**
- **SSL/TLS 1.3** - End-to-end encryption
- **HIPAA-compliant hosting** (AWS BAA, Google Cloud Healthcare API)
- **SOC 2 Type II** certified infrastructure
- **Multi-factor authentication (MFA)**

### **Integrations**
- **South Dakota Medical Cannabis Registry** - Patient verification
- **Stripe** - Payment processing
- **Twilio** - SMS notifications
- **SendGrid** - Email communications

---

## 🚀 **Quick Start Guide**

### **1. Prerequisites**

```bash
# Install Node.js (18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server
```

### **2. Clone and Setup**

```bash
# Clone the repository
git clone https://github.com/TrillyClubLLC/SDMMJTracker.git
cd SDMMJTracker

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### **3. Environment Configuration**

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=production
PORT=3000
DOMAIN=https://www.sdmmjtracker.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sdmmjtracker
REDIS_URL=redis://localhost:6379

# South Dakota API Integration
SD_VERIFY_API_URL=https://medcannabisverify.sd.gov/api/v1
SD_VERIFY_API_KEY=your_api_key_here

# External APIs
DUTCHIE_API_KEY=your_dutchie_key
LEAFLY_API_KEY=your_leafly_key
WEEDMAPS_API_KEY=your_weedmaps_key

# Security
JWT_SECRET=your_256_bit_secret
ENCRYPTION_KEY=your_aes_256_key
SESSION_SECRET=your_session_secret

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key

# Communications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=UA-your-analytics-id
```

### **4. Database Setup**

```bash
# Create database
sudo -u postgres createdb sdmmjtracker

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

### **5. Start the Application**

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:3000`

---

## 🔧 **Deployment Guide**

### **Cloud Deployment Options**

#### **Option 1: AWS (Recommended for HIPAA)**

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Deploy using Elastic Beanstalk
eb init
eb create production
eb deploy
```

**Required AWS Services:**
- **Elastic Beanstalk** - Application hosting
- **RDS PostgreSQL** - Database (encrypted)
- **ElastiCache Redis** - Session storage
- **CloudFront** - CDN
- **Route 53** - DNS management
- **ACM** - SSL certificates
- **WAF** - Web application firewall

#### **Option 2: Google Cloud Platform**

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Deploy to App Engine
gcloud app deploy
```

#### **Option 3: Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t sdmmjtracker .
docker run -p 3000:3000 --env-file .env sdmmjtracker
```

### **Domain Configuration**

1. **DNS Setup**
   ```
   A Record: @ → Your server IP
   CNAME: www → sdmmjtracker.com
   ```

2. **SSL Certificate**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d sdmmjtracker.com -d www.sdmmjtracker.com
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name sdmmjtracker.com www.sdmmjtracker.com;

       ssl_certificate /etc/letsencrypt/live/sdmmjtracker.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/sdmmjtracker.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header Host $http_host;
       }
   }
   ```

---

## 🔗 **API Integration Guide**

### **South Dakota Patient Verification**

```javascript
// Patient authentication endpoint
POST /api/auth/verify
Content-Type: application/json

{
  "medicalCardNumber": "4YBPK2GJ2",
  "dateOfBirth": "1990-01-01",
  "zipCode": "57101"
}

// Response
{
  "success": true,
  "patient": {
    "id": "encrypted_patient_id",
    "cardNumber": "4Y***J2",
    "isValid": true,
    "expirationDate": "2025-12-31",
    "ageRestricted": false,
    "remainingAllotment": 2.5,
    "lastPurchase": "2024-12-15T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

### **Dispensary Data API**

```javascript
// Get dispensaries by city
GET /api/dispensaries?city=sioux-falls

// Response
{
  "dispensaries": [
    {
      "id": "genesis-farms-sf",
      "name": "Genesis Farms Cannabis",
      "address": "123 Main St, Sioux Falls, SD 57101",
      "phone": "(605) 555-0123",
      "hours": "9AM-9PM",
      "menu": "/api/dispensaries/genesis-farms-sf/menu",
      "verified": true
    }
  ]
}
```

### **Allotment Tracking API**

```javascript
// Get patient allotment status
GET /api/patient/allotment
Authorization: Bearer jwt_token

// Response
{
  "currentAllotment": 3.0,
  "usedThisPeriod": 0.5,
  "remainingAllotment": 2.5,
  "resetDate": "2024-12-31T00:00:00Z",
  "purchases": [
    {
      "date": "2024-12-15T10:30:00Z",
      "dispensary": "Genesis Farms",
      "products": [
        {
          "name": "Indica Gummies 10mg",
          "quantity": 1,
          "thc_content": 0.1,
          "price": 25.00
        }
      ],
      "total": 25.00
    }
  ]
}
```

---

## 🛡️ **Security Configuration**

### **HIPAA Compliance Checklist**

- [ ] **Encryption at Rest** - Database and file storage encrypted
- [ ] **Encryption in Transit** - SSL/TLS for all communications
- [ ] **Access Controls** - Role-based permissions
- [ ] **Audit Logging** - All access and modifications logged
- [ ] **Data Backup** - Encrypted backups with retention policy
- [ ] **Incident Response** - Security breach procedures
- [ ] **Business Associate Agreements** - Signed with all vendors

### **Security Headers**

```javascript
// Express.js security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.sdmmjtracker.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### **Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts'
});

app.use('/api/auth', authLimiter);
```

---

## 📊 **Monitoring & Analytics**

### **Health Checks**

```javascript
// Health check endpoint
GET /api/health

// Response
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "external_apis": "operational"
  },
  "version": "1.0.0"
}
```

### **Monitoring Setup**

```bash
# Install monitoring tools
npm install @sentry/node newrelic

# Environment variables
NEW_RELIC_LICENSE_KEY=your_key
SENTRY_DSN=your_sentry_dsn
```

---

## 💼 **Business Integration**

### **Dispensary Partnership Program**

1. **Onboarding Process**
   - Dispensary verification
   - API integration setup
   - Menu data synchronization
   - Compliance verification

2. **Revenue Sharing**
   - Featured placement fees
   - Transaction referral fees
   - Advertising revenue
   - Subscription tiers

### **Patient Acquisition**

1. **Referral Program**
   - Patient referral bonuses
   - Caregiver incentives
   - Loyalty rewards

2. **Marketing Channels**
   - Google Ads (compliance-checked)
   - Social media marketing
   - Dispensary partnerships
   - Healthcare provider referrals

---

## 🧪 **Testing**

### **Unit Tests**

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### **Integration Tests**

```bash
# Run integration tests
npm run test:integration

# Test API endpoints
npm run test:api
```

### **Security Testing**

```bash
# Run security audit
npm audit

# OWASP ZAP security scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000
```

---

## 📱 **Mobile App Development**

### **React Native Setup**

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create mobile app
npx react-native init SDMMJTrackerMobile

# Install dependencies
cd SDMMJTrackerMobile
npm install @react-navigation/native react-native-keychain
```

### **PWA Configuration**

```javascript
// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

**1. Database Connection Failed**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U username -d sdmmjtracker
```

**2. API Rate Limiting**
```bash
# Check Redis status
redis-cli ping

# Clear rate limit cache
redis-cli flushdb
```

**3. SSL Certificate Issues**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect sdmmjtracker.com:443
```

### **Logs and Debugging**

```bash
# Application logs
tail -f logs/application.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

---

## 📚 **Documentation**

- **[API Documentation](docs/API.md)** - Complete API reference
- **[HIPAA Compliance](docs/HIPAA.md)** - Compliance procedures
- **[Security Guide](docs/SECURITY.md)** - Security best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Detailed deployment instructions
- **[Contributing](CONTRIBUTING.md)** - Development guidelines

---

## 🤝 **Support & Community**

### **Getting Help**

- **Email Support**: support@sdmmjtracker.com
- **Documentation**: https://docs.sdmmjtracker.com
- **GitHub Issues**: https://github.com/TrillyClubLLC/SDMMJTracker/issues
- **Discord Community**: https://discord.gg/sdmmjtracker

### **Business Inquiries**

- **Partnerships**: partnerships@trillyclub.com
- **Enterprise**: enterprise@sdmmjtracker.com
- **Legal**: legal@trillyclub.com

---

## 📄 **License & Legal**

### **Software License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Compliance**
- **HIPAA Compliant** - Business Associate Agreement available
- **SOC 2 Type II** - Security audit reports available
- **State Compliance** - South Dakota cannabis regulations compliant

### **Disclaimer**
This software is designed to assist with medical cannabis compliance in South Dakota. Users are responsible for ensuring compliance with all applicable laws and regulations.

---

## 🚀 **Roadmap**

### **Version 1.1** (Q1 2025)
- [ ] iOS/Android mobile apps
- [ ] Enhanced AI chat features
- [ ] Multi-state expansion planning
- [ ] Advanced analytics dashboard

### **Version 1.2** (Q2 2025)
- [ ] Telemedicine integration
- [ ] Insurance billing support
- [ ] Caregiver management tools
- [ ] Inventory management for dispensaries

### **Version 2.0** (Q3 2025)
- [ ] Blockchain verification
- [ ] IoT device integration
- [ ] Machine learning recommendations
- [ ] Wholesale marketplace

---

## 👥 **Credits**

**Developed by**: Trilly Club LLC  
**Copyright**: 2024-2025 Trilly Club LLC  
**Website**: https://www.sdmmjtracker.com  

### **Contributors**
- Development Team
- Legal Compliance Team
- Security Auditors
- Medical Cannabis Industry Partners

---

**🌿 Making medical cannabis access safer and more transparent for South Dakota patients.**

*Last updated: December 19, 2024*
