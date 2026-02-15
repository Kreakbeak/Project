# Pest & Disease Reporting System

A web-based platform for agricultural pest and disease reporting, enabling farmers to report issues and agricultural officers (admins) to provide expert recommendations.

## Features

### Farmer Features
- ✅ Register / Login
- ✅ Submit pest/disease reports with:
  - Crop type (Tomato / Cucumber)
  - Image upload
  - Problem description
  - Location details
- ✅ View previous reports and their status
- ✅ Track treatment recommendations from experts

### Admin Features
- ✅ Login
- ✅ View all farmer reports with farmer details
- ✅ Update report status (Pending → Identified → Resolved)
- ✅ Add treatment recommendations
- ✅ Filter reports by status
- ✅ Outbreak monitoring through centralized database

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator

### Frontend
- **Library:** React.js 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3

## Project Structure

```
PROJECT/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── multer.js       # File upload configuration
│   │   ├── controllers/
│   │   │   ├── authController.js      # Login/Register logic
│   │   │   └── reportController.js    # Report CRUD operations
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   └── Report.js       # Report schema
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication & authorization
│   │   └── routes/
│   │       ├── auth.js         # Auth endpoints
│   │       └── reports.js      # Report endpoints
│   ├── uploads/                # Uploaded images directory
│   ├── server.js               # Express app setup
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── FarmerDashboard.js
    │   │   ├── SubmitReport.js
    │   │   ├── MyReports.js
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminReports.js
    │   │   └── ReportDetail.js
    │   ├── styles/
    │   │   └── App.css
    │   ├── api.js              # API calls
    │   ├── App.js              # Main component with routing
    │   └── index.js
    ├── package.json
    └── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/pest-disease-reporting
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```
(or `npm start` for production)

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (farmer/admin)
- `POST /api/auth/login` - Login user

### Reports (Protected Routes)
- `POST /api/reports` - Create report (Farmer only, requires image upload)
- `GET /api/reports/my-reports` - Get farmer's reports (Farmer only)
- `GET /api/reports` - Get all reports (Admin only)
- `GET /api/reports/:id` - Get report details (Admin only)
- `PUT /api/reports/:id` - Update report status & treatment (Admin only)
- `DELETE /api/reports/:id` - Delete report (Farmer only)

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (farmer/admin),
  location: String,
  createdAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId (ref User),
  cropType: String (Tomato/Cucumber),
  imagePath: String,
  description: String,
  location: String,
  status: String (Pending/Identified/Resolved),
  treatment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Guide

### For Farmers

1. **Register/Login**
   - Go to register page and create account
   - Choose "Farmer" role
   - Provide name, email, password, phone, and location

2. **Submit Report**
   - Click "Submit Report"
   - Select crop type (Tomato/Cucumber)
   - Upload image of affected crop
   - Describe the problem symptoms
   - Provide location
   - Click "Submit Report"

3. **View Reports**
   - Click "My Reports"
   - View status of all reports (Pending/Identified/Resolved)
   - See treatment recommendations from experts

### For Admins

1. **Login**
   - Use admin credentials to login
   - Choose "Admin" role during registration

2. **View Reports**
   - Go to Admin Dashboard
   - Click "Manage Reports" or "View All Reports"
   - Filter by status

3. **Process Report**
   - Click "View" on any report
   - See farmer information and problem details
   - Update status (Pending → Identified → Resolved)
   - Add treatment recommendation
   - Click "Update Report"

## Image Upload

- Images are stored in the `backend/uploads/` directory
- Supported formats: JPEG, JPG, PNG, GIF
- Maximum file size: 5MB
- Images are served via `/uploads/` endpoint

## Authentication

- JWT tokens are stored in localStorage
- Tokens expire after 7 days
- Authorization middleware checks role before allowing access
- Farmers can only access farmer routes
- Admins can only access admin routes

## Testing the System

### Test User Credentials (Create Your Own)

**Farmer Account:**
```
Email: farmer@test.com
Password: password123
Role: Farmer
```

**Admin Account:**
```
Email: admin@test.com
Password: password123
Role: Admin
```

### Test Workflow

1. **Register as Farmer**
   - Fill in registration form with farmer role
   - Navigate to submit report page
   - Submit a test report with an image

2. **Login as Admin**
   - Register/Login with admin credentials
   - Go to reports page
   - Find the report submitted by farmer
   - Click view and update status
   - Add a treatment recommendation

3. **Verify as Farmer**
   - Login back to farmer account
   - Check "My Reports"
   - Verify status update and recommendation visible

## Running Both Servers

Use two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Error Handling

- Server returns JSON responses with `success` flag
- Frontend displays error messages in alert boxes
- Validation errors on both frontend and backend
- JWT token expiration is handled by redirecting to login

## Security Features

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens for session management
- Role-based access control (RBAC)
- Protected API routes with authentication middleware
- File upload validation (type & size)
- Input validation using express-validator

## Future Enhancements

- Email notifications for report updates
- Advanced disease detection with ML/AI
- Mobile app version
- Multi-language support
- Data export/analytics dashboard
- Pest/disease database reference
- Weather integration
- Geolocation mapping

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or update `MONGODB_URI` with your Atlas connection string
- Check port 27017 is not blocked

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: Use `PORT=3001 npm start`

### CORS Error
- Ensure backend is running on port 5000
- Frontend proxy in `package.json` is set to `http://localhost:5000`

### Image Upload Issues
- Check `backend/uploads/` directory exists
- Ensure file size < 5MB
- Only JPEG, JPG, PNG, GIF formats allowed

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
