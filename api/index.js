let profiles = [];

// =========================
// External API functions
// =========================
const getGender = async (name) => {
  const res = await fetch(`https://api.genderize.io?name=${name}`);
  return res.json();
};

const getAge = async (name) => {
  const res = await fetch(`https://api.agify.io?name=${name}`);
  return res.json();
};

const getNationality = async (name) => {
  const res = await fetch(`https://api.nationalize.io?name=${name}`);
  return res.json();
};

const getAgeGroup = (age) => {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
};

// =========================
// MAIN HANDLER
// =========================
module.exports = async (req, res) => {
  try {
    const method = req.method;
    const basePath = "/api";
    const path = req.url.split("?")[0];

    // =========================
    // GET ALL PROFILES
    // =========================
    if (method === "GET" && path === basePath) {
      return res.json({
        status: "success",
        data: profiles,
      });
    }

    // =========================
    // GET SINGLE PROFILE
    // =========================
    if (method === "GET" && path.startsWith(`${basePath}/`)) {
      const id = path.replace(`${basePath}/`, "");

      const profile = profiles.find((p) => p.id === id);

      if (!profile) {
        return res.status(404).json({
          status: "error",
          message: "Not found",
        });
      }

      return res.json({
        status: "success",
        data: profile,
      });
    }

    // =========================
    // CREATE PROFILE
    // =========================
    if (method === "POST" && path === basePath) {
      let body = req.body;

      if (typeof body === "string") {
        body = JSON.parse(body);
      }

      const { name } = body || {};

      if (!name) {
        return res.status(400).json({
          status: "error",
          message: "Name required",
        });
      }

      const cleanName = name.toLowerCase();

      // duplicate check
      const existing = profiles.find((p) => p.name === cleanName);
      if (existing) {
        return res.json({
          status: "success",
          message: "Profile already exists",
          data: existing,
        });
      }

      // external APIs
      const [gender, age, nat] = await Promise.all([
        getGender(cleanName),
        getAge(cleanName),
        getNationality(cleanName),
      ]);

      const topCountry = nat.country?.[0];

      const profile = {
        id: Date.now().toString(),
        name: cleanName,
        gender: gender.gender,
        gender_probability: gender.probability,
        sample_size: gender.count,
        age: age.age,
        age_group: getAgeGroup(age.age),
        country_id: topCountry?.country_id,
        country_probability: topCountry?.probability,
        created_at: new Date().toISOString(),
      };

      profiles.push(profile);

      return res.status(201).json({
        status: "success",
        data: profile,
      });
    }

    // =========================
    // DELETE PROFILE
    // =========================
    if (method === "DELETE" && path.startsWith(`${basePath}/`)) {
      const id = path.replace(`${basePath}/`, "");

      const index = profiles.findIndex((p) => p.id === id);

      if (index === -1) {
        return res.status(404).json({
          status: "error",
          message: "Not found",
        });
      }

      profiles.splice(index, 1);

      return res.json({
        status: "success",
        message: "Deleted",
      });
    }

    // =========================
    // FALLBACK
    // =========================
    return res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
