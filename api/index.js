// api/index.js

const { v4: uuidv4 } = require("uuid");

let profiles = [];

// external API helpers
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

module.exports = async (req, res) => {
  try {
    // GET ALL
    if (req.method === "GET" && req.url === "/api") {
      return res.status(200).json({
        status: "success",
        data: profiles,
      });
    }

    // CREATE PROFILE
    if (req.method === "POST" && req.url === "/api") {
      const { name } = req.body;

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

      // call APIs
      const [genderData, ageData, natData] = await Promise.all([
        getGender(cleanName),
        getAge(cleanName),
        getNationality(cleanName),
      ]);

      const topCountry = natData.country?.[0];

      const profile = {
        id: uuidv4(),
        name: cleanName,
        gender: genderData.gender,
        gender_probability: genderData.probability,
        sample_size: genderData.count,
        age: ageData.age,
        age_group: getAgeGroup(ageData.age),
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

    return res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
