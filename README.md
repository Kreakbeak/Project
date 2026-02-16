# 🌾 Pest & Disease Reporting System (PDRS)

> A modern, MERN-stack based agricultural solution connecting farmers with experts for rapid pest and disease diagnosis.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-green)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Real-World Impact](#-real-world-impact)
- [System Architecture & Workflow](#-system-architecture--workflow)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🔭 Project Overview

The **Pest & Disease Reporting System (PDRS)** is a centralized digital platform designed to bridge the gap between farmers and agricultural officers. It allows farmers to report crop issues in real-time by uploading images and location data, enabling experts to provide timely diagnosis and treatment recommendations.

This project was built as a comprehensive Summer Project to demonstrate full-stack web development capabilities using the MERN stack.

---

## 🚩 Problem Statement

In traditional agriculture, identifying crop diseases effectively is a major challenge for farmers, often leading to:
1.  **Delayed Diagnosis**: Farmers often have to travel long distances to visit agricultural offices.
2.  **Crop Loss**: Unidentified pests can destroy entire harvests before expert help arrives.
3.  **Misinformation**: Reliance on unverified advice can lead to incorrect chemical usage, harming the soil and crop.

There is a critical need for a **digital, accessible, and rapid reporting mechanism**.

---

## 🎯 Objectives

-   **Digitize Reporting**: Create a paperless, instant reporting channel for farmers.
-   **Speed Up Diagnosis**: Reduce the turnaround time for disease identification from days to hours.
-   **Centralize Data**: Maintain a database of outbreaks to help authorities track disease spread.
-   **Accessibility**: Provide a simple, user-friendly interface for non-technical users.

---

## 🌍 Real-World Impact

Implementing this system at scale would verify:
-   **Increased Yield**: Timely intervention saves crops.
-   **Data-Driven Decisions**: Officers can spot outbreak trends (e.g., "Tomato Blight is spreading in Region X") and issue proactive warnings.
-   **Cost Efficiency**: Reduces the need for physical field visits for minor issues.

---

## 🏗 System Architecture & Workflow

This system follows a standard **Model-View-Controller (MVC)** architecture.

### 1. How It Works
1.  **Farmer** logs in and submits a report (Image + Description + Location).
2.  **Frontend (React)** sends the data (with the image) to the **Backend (Express)**.
3.  **Backend** validates the user's role (JWT Auth) and saves the image to the server (Multer).
4.  **Database (MongoDB)** stores the report details and image path.
5.  **Admin (Officer)** logs in, views the report, identifies the issue, and sends a "Treatment Plan".
6.  **Farmer** sees the status change to "Resolved" and views the treatment.

### 2. Key Technical Concepts (Viva/Presentation Points)

#### 🔐 Authentication (JWT)
Think of **JWT (JSON Web Token)** as a digital ID card.
-   When a user logs in, the server gives them a "Token".
-   This token is stored in the browser (`localStorage`).
-   For every request (like "Submit Report"), the browser shows this token.
-   The server checks the token to know **who** the user is and **what** role they have (Farmer vs. Admin).

#### 🖼 Image Upload (Multer)
We use a middleware called **Multer** to handle image files.
-   React sends the image as `FormData`.
-   Multer intercepts the request before it reaches the controller.
-   It saves the file to the `backend/uploads/` folder and gives us the filename.
-   We only store the **path (URL)** of the image in MongoDB, not the image itself (best practice).

#### 🛡 Role-Based Access Control (RBAC)
-   **Farmers** can *Create* reports but cannot *Edit* them after submission.
-   **Admins** can *View* and *Update* all reports but cannot *Create* them.
-   This is enforced using middleware that checks `req.user.role`.

---

## 🚀 Features

### 👨‍🌾 Farmer Module
-   **Secure Registration/Login**: Personalized dashboard.
-   **Quick Reporting**: Upload photo, select crop (e.g., Tomato, Cucumber), describe issue.
-   **Status Tracking**: See if the report is *Pending*, *Identified*, or *Resolved*.
-   **Treatment View**: Access expert advice directly on the report card.

### 👮‍♂️ Admin (Agricultural Officer) Module
-   **Centralized Dashboard**: View all incoming reports from different farmers.
-   **Diagnosis Tools**: Update status and prescribe treatments.
-   **Filtering**: Sort reports by status to prioritize pending cases.

---

## 💻 Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (v18) | Component-based UI, Hooks for state management. |
| **Routing** | React Router v6 | For seamless navigation (SPA). |
| **HTTP Client** | Axios | Handling API requests to the backend. |
| **Backend** | Node.js & Express | RESTful API to handle logic and routing. |
| **Database** | MongoDB | NoSQL database for flexible data storage. |
| **ODM** | Mongoose | Schema validation and database interaction. |
| **Auth** | JWT & bcryptjs | Secure stateless authentication & password hashing. |
| **Uploads** | Multer | Handling multipart/form-data (images). |

---

## 🛠 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Locally installed or MongoDB Atlas URL)
-   Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pest-disease-reporting.git
cd pest-disease-reporting
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file in the backend folder and add:
# MONGODB_URI=mongodb://localhost:27017/pest_db
# PORT=5000
# JWT_SECRET=your_super_secret_key

# Start the Server
npm run dev
```
*Server runs on port 5000.*

### 3. Frontend Setup
Open a new terminal.
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React App
npm start
```
*App runs on http://localhost:3000.*

---

## 🔌 API Documentation

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login and receive JWT | Public |
| **POST** | `/api/reports` | Submit a new pest report | Farmer |
| **GET** | `/api/reports/my-orders` | View logged-in farmer's reports | Farmer |
| **GET** | `/api/reports` | View all reports | Admin |
| **PUT** | `/api/reports/:id` | Update status & add treatment | Admin |

---

## ❓ Troubleshooting

**Q: Images are not loading?**
*A: Ensure the backend server is running. Images are served statically from the backend. Check if `http://localhost:5000/uploads/filename.jpg` is accessible.*

**Q: "Network Error" on Frontend?**
*A: Check if the backend is running on port 5000. If you changed the port, update the `proxy` in `frontend/package.json`.*

**Q: MongoDB Connection Failed?**
*A: Make sure your MongoDB service is running locally (`mongod`) or your Atlas IP whitelist allows your connection.*

---

## 📜 License

This project is licensed under the **ISC License**.

> **Academic Note**: This project was developed for educational purposes as part of the BSc/BE curriculum.
