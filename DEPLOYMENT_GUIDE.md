# 🚀 Deployment & Maintenance Guide

## Pre-Deployment Checklist

### Backend
- [ ] Update `JWT_SECRET` in `.env` to a strong random string
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Verify MongoDB connection string (use Atlas for production)
- [ ] Test all API endpoints with real data
- [ ] Check error handling and logging
- [ ] Validate CORS settings for production domain
- [ ] Test image upload with various file types and sizes
- [ ] Run security audit (npm audit)
- [ ] Set up MongoDB backup strategy

### Frontend
- [ ] Run `npm run build` to create production build
- [ ] Update API base URL for production
- [ ] Test all user flows in production build
- [ ] Verify responsive design on mobile
- [ ] Check console for errors and warnings
- [ ] Test image loading from production server
- [ ] Optimize bundle size
- [ ] Add analytics tracking (optional)

### Security
- [ ] Change default passwords for all test accounts
- [ ] Review and update CORS whitelist
- [ ] Enable HTTPS for production
- [ ] Set up rate limiting on API endpoints
- [ ] Implement request logging
- [ ] Regular security updates for dependencies

---

## 🌐 Production Deployment Options

### Option 1: Traditional Server (AWS EC2, DigitalOcean, etc.)
```bash
# Backend
1. SSH into server
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: npm install
5. Configure .env with production values
6. Start with PM2: pm2 start server.js
7. Set up nginx reverse proxy

# Frontend
1. Build: npm run build
2. Serve with: pm2 serve dist/ 3000
3. Or use nginx to serve static files
```

### Option 2: Docker Deployment
```dockerfile
# Dockerfile for Backend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t pest-disease-backend .
docker run -p 5000:5000 -e MONGODB_URI=... pest-disease-backend
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Backend
heroku login
heroku create pest-disease-api
heroku config:set JWT_SECRET=xxx
heroku config:set MONGODB_URI=xxx
git push heroku main

# Frontend
Build → Deploy to Netlify/Vercel
```

#### Vercel/Netlify (Frontend)
```bash
npm run build
# Push to GitHub
# Connect GitHub repo to Vercel/Netlify
# Auto-deploy on push
```

#### MongoDB Atlas (Database)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Set up user credentials
4. Get connection string
5. Update MONGODB_URI in .env

---

## 📦 Production Environment Setup

### Backend (.env for Production)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pest-disease-reporting
JWT_SECRET=your_very_secure_random_string_here_minimum_32_chars
PORT=5000
NODE_ENV=production
```

### Frontend (.env for Production)
```
REACT_APP_API_URL=https://your-production-api.com
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to production
      run: npm run deploy
```

---

## 🛡️ Security Best Practices

### API Security
```javascript
// Example: Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### HTTPS/SSL
- Use Let's Encrypt for free SSL certificates
- Force HTTPS in production
- Set secure cookie flags

### Database
- Use strong MongoDB credentials
- Enable MongoDB auth
- Regular backups
- Monitor database performance

### Dependencies
```bash
# Regular security updates
npm audit
npm audit fix
npm update
```

---

## 📊 Monitoring & Logging

### Backend Logging
```javascript
// Example: Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Server started');
logger.error('Error message', error);
```

### Monitoring Tools
- **PM2 Plus:** Monitoring Node.js applications
- **DataDog:** Application performance monitoring
- **Sentry:** Error tracking
- **New Relic:** Performance monitoring

---

## 🐛 Troubleshooting Production Issues

### Issue: Reports can't be uploaded
```
Solution:
1. Check /uploads directory exists and writable
2. Verify file size limit in multer.js
3. Check disk space on server
4. Review server logs for multer errors
```

### Issue: Slow image loading
```
Solution:
1. Implement image compression
2. Use CDN for image delivery
3. Optimize database queries
4. Add caching headers
```

### Issue: Database connection errors
```
Solution:
1. Verify MongoDB connection string
2. Check database credentials
3. Ensure database is running/accessible
4. Check MongoDB Atlas IP whitelist
```

### Issue: Token expiration errors
```
Solution:
1. Extend token expiration time (if needed)
2. Implement refresh token mechanism
3. Clear localStorage if token invalid
4. Redirect to login on 401
```

---

## 📈 Scaling Recommendations

### Phase 1: Current Setup
- Single server for backend
- Single database instance
- Basic monitoring

### Phase 2: Improved Infrastructure
- Load balancer for backend scaling
- Database replication
- Caching layer (Redis)
- CDN for static files and images

### Phase 3: Enterprise Scale
- Horizontal scaling with Kubernetes
- Database sharding
- Microservices architecture
- Advanced monitoring and analytics

---

## 🔄 Backup & Recovery

### MongoDB Backup
```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster..." --out ./backup

# Restore
mongorestore ./backup
```

### Application Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ./uploads

# Backup source code
git push origin main
```

---

## 🚨 Incident Response

### If Database is Down
1. Check database status
2. Review error logs
3. Restart database service
4. Restore from backup if corrupted
5. Notify users

### If Server is Down
1. Check server status/resources
2. Review error logs
3. Restart application
4. Check dependencies
5. Scale if needed

### If Image Upload Issues
1. Check disk space
2. Verify directory permissions
3. Check file size limits
4. Review Multer configuration
5. Clear cache if needed

---

## 📝 Maintenance Tasks

### Daily
- Monitor server and database performance
- Check error logs
- Verify uploads are working

### Weekly
- Review security logs
- Check for critical updates
- Test backup restoration

### Monthly
- Update dependencies securely
- Review performance metrics
- Optimize database queries
- Cleanup old temporary files

### Quarterly
- Security audit
- Load testing
- Documentation review
- Disaster recovery drill

---

## 📞 Support & Documentation

### For Developers
- API Documentation: API_TESTING.md
- Architecture: ARCHITECTURE.md
- Setup Guide: QUICKSTART.md
- Implementation Details: IMPLEMENTATION_SUMMARY.md

### For Users
- Quick Start: QUICKSTART.md
- User Guide: README.md
- System Features: README.md

---

## 🎓 Training & Knowledge Transfer

### Developer Training
1. System architecture overview
2. API endpoint walkthrough
3. Database schema explanation
4. Authentication flow
5. Common issues and solutions

### User Training
1. Registration and login
2. Submitting reports
3. Viewing reports
4. Admin dashboard features
5. System navigation

---

## 📞 Contact & Support

For deployment assistance or issues:
1. Review documentation files
2. Check error logs
3. Review git history for recent changes
4. Contact development team

---

**Last Updated:** January 17, 2026
**Status:** Production Ready ✅
