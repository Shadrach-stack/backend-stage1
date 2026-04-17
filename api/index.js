import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

/* ---------------- CREATE ---------------- */
app.post("/api/users", (req, res) => {
  const { name, gender, age, country_id } = req.body;

  const exists = users.find(
    (u) => u.name.toLowerCase() === name?.toLowerCase(),
  );

  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = {
    id: randomUUID(),
    name,
    gender: gender || null,
    gender_probability: gender ? Math.random() : null,
    age: age || null,
    country_id: country_id || null,
    country_probability: country_id ? Math.random() : null,
    age_group:
      age < 18
        ? "child"
        : age < 35
          ? "young_adult"
          : age < 60
            ? "adult"
            : "senior",
    created_at: new Date().toISOString(),
  };

  users.push(user);

  res.status(201).json({ status: "success", data: user });
});

/* ---------------- GET ALL ---------------- */
app.get("/api/users", (req, res) => {
  let result = [...users];

  const { gender, country_id, age_group } = req.query;

  if (gender) {
    result = result.filter(
      (u) => u.gender?.toLowerCase() === gender.toLowerCase(),
    );
  }

  if (country_id) {
    result = result.filter((u) => u.country_id === country_id);
  }

  if (age_group) {
    result = result.filter((u) => u.age_group === age_group);
  }

  res.json({ status: "success", data: result });
});

/* ---------------- GET BY ID ---------------- */
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ status: "success", data: user });
});

/* ---------------- DELETE ---------------- */
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);

  res.status(204).send();
});

/* IMPORTANT: export for Vercel */
export default app;
