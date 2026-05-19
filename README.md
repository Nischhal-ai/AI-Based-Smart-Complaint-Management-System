# AI-Based Smart Complaint Management System

An AI-powered MERN Stack web application designed to register, manage, and analyze public complaints intelligently using AI-generated insights.

The system allows users to:
- Register complaints
- Track complaint status
- Update complaint progress
- Search complaints by location
- Generate AI-based complaint analysis
- Manage complaints securely using authentication

---

# Live Demo

## Frontend
https://ai-based-smart-complaint-management-gl8v.onrender.com/

## Backend API
https://ai-based-smart-complaint-management-6fbv.onrender.com/api

---

# Features

## Authentication System
- User Registration
- User Login
- JWT Authentication
- Protected Dashboard Routes

---

## Complaint Management
- Register New Complaints
- Automatic Pending Status
- Update Complaint Status
- Delete Complaints
- Search Complaints by Location

---

## AI Functionalities
The AI module can:
- Analyze complaint severity
- Generate complaint summaries
- Suggest responsible departments
- Recommend actions
- Generate professional auto responses

---

# Tech Stack

## Frontend
- React.js
- Vite
- Axios
- React Router DOM
- CSS3

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- OpenRouter AI API

---

# Folder Structure

```bash
backend/
│
├── models/
│   ├── User.js
│   └── Complaint.js
│
├── .env
├── index.js
├── package.json
└── package-lock.json


frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
└── vite.config.js
````

---

# Installation Guide

## Clone Repository

```bash
git clone <your-github-repository-link>
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Run Backend Server:

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoints

# Authentication APIs

| Method | Route         | Description   |
| ------ | ------------- | ------------- |
| POST   | /api/register | Register User |
| POST   | /api/login    | Login User    |

---

# Complaint APIs

| Method | Route                  | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | /api/complaints        | Get All Complaints            |
| POST   | /api/complaints        | Add Complaint                 |
| PUT    | /api/complaints/:id    | Update Complaint Status       |
| DELETE | /api/complaints/:id    | Delete Complaint              |
| GET    | /api/complaints/search | Search Complaints By Location |

---

# AI APIs

| Method | Route           | Description           |
| ------ | --------------- | --------------------- |
| POST   | /api/ai/analyze | AI Complaint Analysis |

---

# Database Schema

## User Schema

```js
{
  name: String,
  email: String,
  password: String
}
```

---

## Complaint Schema

```js
{
  name: String,
  email: String,
  title: String,
  description: String,
  category: String,
  location: String,
  status: String,
  createdAt: Date
}
```

---

# AI Analysis Output

The AI system generates:

* Complaint Priority
* Responsible Department
* Complaint Summary
* Automated Citizen Response
* Recommended Action

---

# Security Features

* Password Hashing using bcrypt
* JWT Token Authentication
* Protected API Routes
* Unauthorized Access Prevention

---

# Future Improvements

* Admin Dashboard
* Complaint Analytics Graphs
* Email Notifications
* File/Image Upload
* Complaint Category Filters
* AI Sentiment Analysis
* Real-Time Complaint Tracking

---

# Deployment

## Frontend Deployment

* Render

## Backend Deployment

* Render

## Database

* MongoDB Atlas

---

# Author

Nischhal

---

# Project Type

Full Stack MERN + AI Integration Project

---

# License

This project is developed for educational and learning purposes.


