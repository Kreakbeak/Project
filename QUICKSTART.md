# QUICK START GUIDE

## 1. Install Dependencies

### Backend
```
cd backend
npm install
```

### Frontend
```
cd frontend
npm install
```

## 2. Configure Environment

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/pest-disease-reporting
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

Create .env file from .env.example:
```
cd backend
copy .env.example .env
```

## 3. Start MongoDB
Make sure MongoDB is running on your system

## 4. Run the Application

### Terminal 1 - Backend
```
cd backend
npm run dev
```
Runs on: http://localhost:5000

### Terminal 2 - Frontend
```
cd frontend
npm start
```
Runs on: http://localhost:3000

## 5. Access the Application

- Open http://localhost:3000 in your browser
- You'll be redirected to login page
- Register as Farmer or Admin
- Start using the system

## Key Files to Know

- Backend API: `backend/src/routes/`
- Database Models: `backend/src/models/`
- Frontend Pages: `frontend/src/pages/`
- API Client: `frontend/src/api.js`
- Styles: `frontend/src/styles/App.css`

## Common Issues

1. **MongoDB not connecting?**
   - Make sure MongoDB is installed and running
   - Check MONGODB_URI in .env file

2. **Port already in use?**
   - Backend: Change PORT in .env
   - Frontend: Use `PORT=3001 npm start`

3. **CORS errors?**
   - Ensure backend is running on 5000
   - Frontend proxy is configured correctly

## Testing Quickly

1. Register as Farmer
2. Submit a test report (copy a test image from web)
3. Register as Admin
4. View the report and add treatment
5. Login back as Farmer to see update

That's it! Happy testing!
