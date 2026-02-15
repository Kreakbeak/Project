# ⚡ Quick Reference Card

## 🚀 Start Here (5 minutes)

```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

**Done!** Open http://localhost:3000

---

## 🧑‍🌾 Farmer Quick Start

| Action | Path |
|--------|------|
| Register | http://localhost:3000/register |
| Login | http://localhost:3000/login |
| Submit Report | http://localhost:3000/farmer/submit-report |
| View Reports | http://localhost:3000/farmer/my-reports |
| Dashboard | http://localhost:3000/farmer/dashboard |

**Report Fields:** Crop (Tomato/Cucumber), Image, Description, Location

---

## 👨‍💼 Admin Quick Start

| Action | Path |
|--------|------|
| Register | http://localhost:3000/register (select Admin) |
| Login | http://localhost:3000/login |
| View Reports | http://localhost:3000/admin/reports |
| Update Report | http://localhost:3000/admin/report/:id |
| Dashboard | http://localhost:3000/admin/dashboard |

**Update Fields:** Status (Pending/Identified/Resolved), Treatment Recommendation

---

## 🔌 API Endpoints Quick List

```bash
# Auth
POST   /api/auth/register
POST   /api/auth/login

# Farmer Reports
POST   /api/reports (with image)
GET    /api/reports/my-reports
DELETE /api/reports/:id

# Admin Reports
GET    /api/reports
GET    /api/reports/:id
PUT    /api/reports/:id

# Health
GET    /api/health
```

---

## 📁 Key Files Location

| File | Purpose |
|------|---------|
| `backend/src/models/User.js` | User schema |
| `backend/src/models/Report.js` | Report schema |
| `backend/src/controllers/authController.js` | Login/Register |
| `backend/src/controllers/reportController.js` | Report CRUD |
| `frontend/src/pages/` | All UI pages |
| `frontend/src/api.js` | API calls |

---

## 💻 Test Credentials (Create Your Own)

```
Farmer:
  Email: farmer@test.com
  Password: password123
  Role: farmer

Admin:
  Email: admin@test.com
  Password: password123
  Role: admin
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB error | Check `MONGODB_URI` in `.env` |
| Port 5000 in use | Change `PORT` in `.env` |
| Port 3000 in use | `PORT=3001 npm start` |
| CORS errors | Ensure backend on 5000 |
| Images not loading | Check `/uploads` directory |
| Token expired | Clear localStorage, login again |

---

## 🎯 Test Workflow (10 minutes)

1. **Register Farmer** (localhost:3000/register)
   - Name, Email, Password, Phone, Role: Farmer, Location

2. **Submit Report** (/farmer/submit-report)
   - Crop: Tomato
   - Image: Upload any JPG/PNG
   - Description: "Brown spots on leaves"
   - Location: "Any location"

3. **Register Admin** (localhost:3000/register)
   - Different email, Role: Admin

4. **View & Update** (/admin/reports)
   - Click "View"
   - Change Status to "Identified"
   - Add Treatment: "Spray fungicide"
   - Click "Update Report"

5. **Verify as Farmer** (/farmer/my-reports)
   - See status changed
   - See treatment recommendation

---

## 📊 Status Flow

```
Pending ──→ Identified ──→ Resolved
(Default)   (Admin adds   (Admin marks
             treatment)    complete)
```

---

## 🗄️ Database Info

**Collections:**
- `users` - All users (farmers & admins)
- `reports` - All reports with farmer references

**Connection:** MongoDB (Local or Atlas)

---

## 📱 Important Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 🔒 Authorization Rules

**Farmers can:**
- ✅ Register/Login
- ✅ Submit reports
- ✅ View own reports
- ✅ Delete own reports
- ❌ View other reports
- ❌ Update reports

**Admins can:**
- ✅ Register/Login (as admin)
- ✅ View all reports
- ✅ Update report status
- ✅ Add treatment recommendations
- ❌ Submit reports
- ❌ Delete reports

---

## 🖼️ Image Upload Rules

- **Format:** JPEG, JPG, PNG, GIF only
- **Size:** Max 5MB
- **Storage:** `/uploads/` directory
- **Serving:** Via `/uploads/:filename` endpoint

---

## 🔐 Security Features

- ✅ Passwords hashed (bcryptjs)
- ✅ JWT tokens (7-day expiry)
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Input validation
- ✅ File type validation

---

## 📂 Project Structure Summary

```
PROJECT/
├── backend/          # Node.js + Express
│   ├── src/
│   │   ├── config/   # DB & Upload config
│   │   ├── controllers/
│   │   ├── models/   # User & Report
│   │   ├── middleware/ # Auth
│   │   └── routes/   # API endpoints
│   └── uploads/      # Images stored here
│
└── frontend/         # React
    ├── src/
    │   ├── pages/    # 8 React components
    │   ├── styles/   # CSS
    │   └── api.js    # API calls
    └── public/       # HTML template
```

---

## 🚀 Ready to Deploy?

1. **Review:** DEPLOYMENT_GUIDE.md
2. **Configure:** Production `.env` variables
3. **Test:** All features working
4. **Deploy:** Using Docker, Heroku, or VPS
5. **Monitor:** Set up logging & monitoring

---

## 📚 Documentation

- 📖 **QUICKSTART.md** - Setup guide
- 📖 **README.md** - Full documentation
- 📖 **API_TESTING.md** - API reference
- 📖 **ARCHITECTURE.md** - System design
- 📖 **DEPLOYMENT_GUIDE.md** - Production setup
- 📖 **PROJECT_INDEX.md** - Complete index

---

## 💡 Pro Tips

1. Use `.env.example` as template for `.env`
2. Install dependencies before running
3. Keep MongoDB running in background
4. Check browser console for frontend errors
5. Check terminal for backend errors
6. Test with different images for uploads
7. Clear localStorage if auth issues
8. Use Postman to test APIs
9. Check `/uploads` for stored images
10. Monitor database with MongoDB Atlas

---

## ⚙️ Command Reference

```bash
# Backend
npm install              # Install dependencies
npm start               # Start production
npm run dev             # Start development (with nodemon)

# Frontend
npm install             # Install dependencies
npm start               # Start development
npm run build           # Create production build

# Testing (in backend)
node seed.js            # Seed test data

# Database
mongod                  # Start MongoDB (if local)
```

---

## ✅ Before Going Live

- [ ] Update JWT_SECRET in .env
- [ ] Update MONGODB_URI for production
- [ ] Change test user credentials
- [ ] Test all workflows
- [ ] Check error messages
- [ ] Verify image uploads
- [ ] Test on different browsers
- [ ] Run npm audit
- [ ] Set up monitoring
- [ ] Enable HTTPS
- [ ] Set strong passwords
- [ ] Backup database

---

## 🎯 Success Metrics

- [x] Users can register
- [x] Users can login
- [x] Farmers can submit reports with images
- [x] Admins can view all reports
- [x] Admins can update status & treatment
- [x] Farmers see updates
- [x] Role-based access working
- [x] Images stored & retrieved

**All metrics achieved! ✅**

---

**Version:** 1.0.0
**Status:** Production Ready ✅
**Last Updated:** January 17, 2026
