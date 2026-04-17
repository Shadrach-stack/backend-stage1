# 🚀 Stage 1 Backend API

## 📌 Overview

This is a simple REST API built with Node.js and Express. It supports creating, reading, filtering, and deleting user profiles. The API is deployed on Vercel.

---

## 🌐 Live API

https://backend-stage1.vercel.app

---

## 📍 Base URL

https://backend-stage1.vercel.app/api/users

---

## 📚 Endpoints

### ➕ Create User (POST)

POST /api/users

Request Body:
{
"name": "michael",
"gender": "male",
"age": 25,
"country_id": "NG"
}

---

### 📄 Get All Users (GET)

GET /api/users

---

### 🔍 Get User by ID (GET)

GET /api/users/:id

---

### ❌ Delete User (DELETE)

DELETE /api/users/:id

---

## 🔎 Query Filters

You can filter users using query parameters:

gender → male / female  
country_id → e.g. NG  
age_group → child / young_adult / adult / senior

Examples:
GET /api/users?gender=male  
GET /api/users?country_id=NG  
GET /api/users?age_group=young_adult

---

## 🧪 Testing with curl

Create User:
curl -X POST https://backend-stage1.vercel.app/api/users -H "Content-Type: application/json" -d '{"name":"michael","gender":"male","age":25,"country_id":"NG"}'

Get All Users:
curl https://backend-stage1.vercel.app/api/users

Get User by ID:
curl https://backend-stage1.vercel.app/api/users/:id

Delete User:
curl -X DELETE https://backend-stage1.vercel.app/api/users/:id

---

## 🛠 Tech Stack

Node.js  
Express.js  
Vercel

---

## ✅ Features

UUID-based user IDs  
Idempotency (prevents duplicate users)  
Filtering by gender, country, age group  
Proper error handling  
ISO 8601 timestamps (created_at)  
RESTful API design

---

## 📦 Author

Shadrach-stack
Built for Stage 1 Backend Task
