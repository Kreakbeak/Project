# API Testing Guide

Use any API testing tool (Postman, Insomnia, Thunder Client, or cURL)

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "farmer",
  "location": "Delhi, India"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

---

## 2. REPORT ENDPOINTS (Farmer)

### Create Report (Farmer Only)
```
POST /reports
Authorization: Bearer <farmer_token>
Content-Type: multipart/form-data

Form Data:
- cropType: Tomato
- description: Brown spots on leaves, wilting stems
- location: Haryana, India
- image: <image_file>

Response:
{
  "success": true,
  "message": "Report created successfully",
  "report": {
    "_id": "507f1f77bcf86cd799439011",
    "farmerId": "507f1f77bcf86cd799439012",
    "cropType": "Tomato",
    "imagePath": "/uploads/image-1234567890.jpg",
    "description": "Brown spots on leaves, wilting stems",
    "location": "Haryana, India",
    "status": "Pending",
    "treatment": "",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get My Reports (Farmer Only)
```
GET /reports/my-reports
Authorization: Bearer <farmer_token>

Response:
{
  "success": true,
  "count": 3,
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "farmerId": "507f1f77bcf86cd799439012",
      "cropType": "Tomato",
      "imagePath": "/uploads/image-1234567890.jpg",
      "description": "Brown spots on leaves",
      "location": "Haryana, India",
      "status": "Identified",
      "treatment": "Spray fungicide...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Delete Report (Farmer Only)
```
DELETE /reports/:id
Authorization: Bearer <farmer_token>

Response:
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## 3. REPORT ENDPOINTS (Admin)

### Get All Reports (Admin Only)
```
GET /reports
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 5,
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "farmerId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "location": "Haryana, India"
      },
      "cropType": "Tomato",
      "imagePath": "/uploads/image-1234567890.jpg",
      "description": "Brown spots on leaves",
      "location": "Haryana, India",
      "status": "Pending",
      "treatment": "",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Report Detail (Admin Only)
```
GET /reports/:id
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "report": {
    "_id": "507f1f77bcf86cd799439011",
    "farmerId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "location": "Haryana, India"
    },
    "cropType": "Tomato",
    "imagePath": "/uploads/image-1234567890.jpg",
    "description": "Brown spots on leaves, wilting stems",
    "location": "Haryana, India",
    "status": "Pending",
    "treatment": "",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Report Status & Treatment (Admin Only)
```
PUT /reports/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Identified",
  "treatment": "This appears to be Early Blight. Spray Chlorothalonil or Mancozeb fungicide every 7-10 days. Remove affected leaves. Ensure proper plant spacing for air circulation."
}

Response:
{
  "success": true,
  "message": "Report updated successfully",
  "report": {
    "_id": "507f1f77bcf86cd799439011",
    "farmerId": "507f1f77bcf86cd799439012",
    "cropType": "Tomato",
    "imagePath": "/uploads/image-1234567890.jpg",
    "description": "Brown spots on leaves",
    "location": "Haryana, India",
    "status": "Identified",
    "treatment": "This appears to be Early Blight...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

---

## 4. HEALTH CHECK

### Server Health
```
GET /health

Response:
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is invalid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'farmer' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Report not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Sequence

1. **Register Farmer**
   - POST /auth/register with role: "farmer"
   - Copy the token

2. **Create Report**
   - POST /reports with the farmer token
   - Include an image file

3. **Get My Reports**
   - GET /reports/my-reports with farmer token
   - Verify report is created with "Pending" status

4. **Register Admin**
   - POST /auth/register with role: "admin"
   - Copy the admin token

5. **Get All Reports**
   - GET /reports with admin token
   - Should see farmer's report

6. **Update Report**
   - PUT /reports/:id with admin token
   - Change status to "Identified"
   - Add treatment recommendation

7. **Check Updated Report**
   - GET /reports/my-reports with farmer token
   - Should see updated status and treatment

---

## cURL Examples

### Register Farmer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "farmer@test.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "farmer",
    "location": "Haryana"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123"
  }'
```

### Get My Reports
```bash
curl -X GET http://localhost:5000/api/reports/my-reports \
  -H "Authorization: Bearer <token>"
```

### Create Report with Image
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer <token>" \
  -F "cropType=Tomato" \
  -F "description=Brown spots on leaves" \
  -F "location=Haryana" \
  -F "image=@/path/to/image.jpg"
```

---

## Status Values
- `Pending` - Report submitted, awaiting expert review
- `Identified` - Pest/disease has been identified with recommendations
- `Resolved` - Issue has been resolved

## Crop Types
- `Tomato`
- `Cucumber`

---

## Notes
- Image file size limit: 5MB
- Allowed formats: JPEG, JPG, PNG, GIF
- JWT tokens expire after 7 days
- All timestamps are in UTC ISO format
