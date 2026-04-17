# 🧠 Profile API Backend (Stage 1)

A Node.js + Express backend API that generates user profile data using external APIs and stores results in a SQLite database.

---

## 🚀 Features

- Create profile with name
- Fetch gender, age, and nationality using external APIs
- Store profiles in SQLite database
- Prevent duplicate entries (idempotency)
- Get all profiles
- Get single profile
- Delete profile

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- SQLite
- Axios
- UUID

---

## 📦 Installation

npm install

---

## ▶️ Run Server

node src/server.js

Server runs at:
http://localhost:3000

---

## 📡 API DOCUMENTATION

### Create Profile

POST /api/profiles

Request Body:
{
"name": "john"
}

Response:
{
"status": "success",
"data": {
"id": "uuid",
"name": "john",
"gender": "male",
"gender_probability": 0.98,
"sample_size": 1000,
"age": 30,
"age_group": "adult",
"country_id": "NG",
"country_probability": 0.87,
"created_at": "timestamp"
}
}

---

### Get All Profiles

GET /api/profiles

Response:
{
"status": "success",
"data": []
}

---

### Get Single Profile

GET /api/profiles/:id

Response:
{
"status": "success",
"data": {
"id": "uuid",
"name": "john",
"gender": "male",
"age": 30,
"age_group": "adult"
}
}

---

### Delete Profile

DELETE /api/profiles/:id

Response:
{
"status": "success",
"message": "Profile deleted"
}

---

## 🧪 CURL EXAMPLES

Create Profile:

curl -X POST http://localhost:3000/api/profiles \
-H "Content-Type: application/json" \
-d '{"name":"john"}'

---

Get All Profiles:

curl http://localhost:3000/api/profiles

---

Get Single Profile:

curl http://localhost:3000/api/profiles/<id>

---

Delete Profile:

curl -X DELETE http://localhost:3000/api/profiles/<id>

---

## 🌐 External APIs Used

- https://api.genderize.io
- https://api.agify.io
- https://api.nationalize.io

---

## 📁 Project Structure

src/
├── controllers/
├── routes/
├── db/
├── services/
├── app.js
└── server.js

---

## ✨ Author

Built by Shadrach-stack
