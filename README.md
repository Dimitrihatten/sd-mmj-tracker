# SD MMJ Tracker - Medical Cannabis Patient Portal

A HIPAA-compliant platform for South Dakota medical cannabis patient verification and allotment tracking.

## Overview

SD MMJ Tracker provides a comprehensive solution for managing medical cannabis patient verification, allotment tracking, and compliance monitoring in South Dakota. Our platform ensures HIPAA compliance while streamlining operations for dispensaries, healthcare providers, and patients.

## Features

### For Patients
- ✅ Real-time patient status verification
- ✅ Monthly allotment tracking
- ✅ Purchase history monitoring
- ✅ Dispensary location finder
- ✅ Secure, HIPAA-compliant data handling

### For Dispensaries
- ✅ Instant patient verification
- ✅ POS system integration
- ✅ Automated compliance reporting
- ✅ Inventory management tools
- ✅ Sales analytics and reporting

### For Healthcare Providers
- ✅ Patient management portal
- ✅ Recommendation tracking
- ✅ Compliance monitoring
- ✅ Secure patient communication
- ✅ Progress reporting tools

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Responsive Design:** Mobile-first approach
- **Security:** HTTPS, CSP headers, CSRF protection
- **Compliance:** HIPAA-compliant architecture
- **Accessibility:** WCAG 2.1 AA standards
- **Performance:** Optimized for sub-3-second load times

## Security Features

- 🔒 End-to-end encryption
- 🔒 Multi-factor authentication
- 🔒 CSRF token protection
- 🔒 XSS prevention
- 🔒 Secure headers implementation
- 🔒 Regular security audits

## Compliance

- **HIPAA Compliant:** Full compliance with HIPAA Privacy Rule
- **State Regulations:** Adherent to South Dakota medical cannabis laws
- **SOC 2 Type II:** Certified data handling and storage
- **Accessibility:** WCAG 2.1 AA compliance

## Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- HTTPS-enabled web server
- SSL/TLS certificate

### Deployment
1. Upload files to your web server
2. Ensure HTTPS is properly configured
3. Configure security headers (CSP, HSTS, etc.)
4. Test all functionality across devices

### Configuration
- Update API endpoints in configuration files
- Set up CSRF token generation
- Configure email notification settings
- Set up database connections (if applicable)

## Usage

### Patient Portal
1. Navigate to the patient verification section
2. Enter your patient ID and date of birth
3. View your current allotment status
4. Browse licensed dispensaries
5. Track your purchase history

### Business Portal
1. Access the partnership section
2. Submit business inquiry form
3. Schedule integration consultation
4. Begin implementation process

## File Structure

```
/
├── index.html              # Main application file
├── privacy-policy.md       # Privacy policy document
├── hipaa-notice.md        # HIPAA compliance notice
├── terms-of-service.md    # Terms of service
├── business-plan.md       # Business plan overview
├── partnership-opportunities.md # Partnership documentation
└── README.md              # This file
```

## API Integration

### Patient Verification
```javascript
POST /api/verify-patient
{
  "patient_id": "string",
  "date_of_birth": "YYYY-MM-DD",
  "csrf_token": "string"
}
```

### Allotment Check
```javascript
GET /api/patient-allotment/{patient_id}
Headers: {
  "Authorization": "Bearer {token}"
}
```

## Support

### Technical Support
- **Email:** support@sdmmjtracker.com
- **Phone:** 1-800-SD-CANNABIS
- **Hours:** Mon-Fri 8AM-6PM CST

### Business Inquiries
- **Email:** business@sdmmjtracker.com
- **Phone:** (605) 555-BUSINESS

### Privacy and Compliance
- **Privacy Officer:** privacy@sdmmjtracker.com
- **Phone:** 1-800-SD-PRIVACY

## Contributing

We welcome contributions from the community. Please follow our contribution guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Follow code review process

### Code Standards
- Follow accessibility guidelines (WCAG 2.1 AA)
- Maintain HIPAA compliance
- Use semantic HTML
- Implement proper error handling
- Include comprehensive comments

## License

This project is proprietary software owned by SD MMJ Tracker. All rights reserved.

## Compliance Notice

This software is designed to handle Protected Health Information (PHI) and must be deployed in a HIPAA-compliant environment. Ensure all security measures are properly implemented before use in production.

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Patient verification system
- Allotment tracking
- Dispensary directory
- Business partnership portal
- HIPAA compliance implementation

## Roadmap

### Upcoming Features
- Mobile application
- Advanced analytics dashboard
- Multi-state expansion
- Integration with additional POS systems
- Telehealth consultation features

### Long-term Goals
- AI-powered compliance monitoring
- Predictive analytics for inventory management
- Blockchain-based verification system
- Advanced reporting and analytics

## Contact

**SD MMJ Tracker**  
123 Medical Plaza  
Pierre, SD 57501  
Email: info@sdmmjtracker.com  
Website: https://www.sdmmjtracker.com
```

For more information about our services or to inquire about partnerships, please visit our website or contact our team directly.