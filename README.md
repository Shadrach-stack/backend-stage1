# 🧠 Profile API Backend (Stage 1)

A Node.js + Serverless backend API deployed on Vercel that generates user profile data using external APIs and stores results in memory.

---

## 🚀 Live API

👉 https://backend-stage1.vercel.app/api

---

## ⚙️ Features

- Create profile using name input
- Fetch gender, age, and nationality using external APIs
- Auto-generate age group classification
- Store profiles in memory (serverless compatible)
- Prevent duplicate profiles
- Get all profiles
- Get single profile by ID
- Delete profile by ID

---

## 🧰 Tech Stack

- Node.js (Serverless Functions)
- Vercel
- External APIs (Genderize, Agify, Nationalize)
- JavaScript (ES6+)

---

## 📦 API Endpoints

---

### ➕ Create Profile

**POST**
/api

**Request Body:**
{
  "name": "john"
}

**Response:**
{
  "status": "success",
  "data": {
    "id": "123456789",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.98,
    "sample_size": 1000,
    "age": 30,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.87,
    "created_at": "2026-04-17T12:00:00.000Z"
  }
}

---

### 📥 Get All Profiles

**GET**
/api

**Response:**
{
  "status": "success",
  "data": []
}

---

### 🔍 Get Single Profile

**GET**
/api?id=<profile_id>

Example:
https://backend-stage1.vercel.app/api?id=123456789

---

### ❌ Delete Profile

**DELETE**
/api?id=<profile_id>

Example:
curl -X DELETE "https://backend-stage1.vercel.app/api?id=123456789"

Response:
{
  "status": "success",
  "message": "Deleted"
}

---

## 🧪 CURL EXAMPLES

### Create Profile
curl -X POST https://backend-stage1.vercel.app/api \
-H "Content-Type: application/json" \
-d '{"name":"john"}'

---

### Get All Profiles
curl https://backend-stage1.vercel.app/api

---

### Get Single Profile
curl https://backend-stage1.vercel.app/api?id=123456789

---

### Delete Profile
curl -X DELETE "https://backend-stage1.vercel.app/api?id=123456789"

---

## 🌐 External APIs Used

- https://api.genderize.io
- https://api.agify.io
- https://api.nationalize.io

---

## 📁 Project Structure

api/
 └── index.js

---

## ✨ Notes

- This project uses serverless in-memory storage
- Data resets on redeploy (expected on Vercel)
- Fully deployed and production-ready via Vercel

---

## 👨‍💻 Author

Built by Shadrach-stack
