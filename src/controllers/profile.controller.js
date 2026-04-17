const { v4: uuidv4 } = require("uuid");
const profiles = require("../db/memory");

const {
  getGender,
  getAge,
  getNationality,
} = require("../services/externalApis.service");

// age group helper
const getAgeGroup = (age) => {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
};

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    console.log("CREATE PROFILE HIT");

    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Missing or invalid name",
      });
    }

    const cleanName = name.toLowerCase();

    // check duplicate
    const existing = profiles.find((p) => p.name === cleanName);

    if (existing) {
      return res.json({
        status: "success",
        message: "Profile already exists",
        data: existing,
      });
    }

    // call external APIs
    const [genderRes, ageRes, natRes] = await Promise.all([
      getGender(cleanName),
      getAge(cleanName),
      getNationality(cleanName),
    ]);

    const genderData = genderRes.data;
    const ageData = ageRes.data;
    const natData = natRes.data;

    if (!genderData?.gender || genderData.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Gender API failed",
      });
    }

    if (!ageData?.age) {
      return res.status(502).json({
        status: "error",
        message: "Age API failed",
      });
    }

    if (!natData?.country || natData.country.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "Nationality API failed",
      });
    }

    const topCountry = natData.country[0];

    const profile = {
      id: uuidv4(),
      name: cleanName,
      gender: genderData.gender,
      gender_probability: genderData.probability,
      sample_size: genderData.count,
      age: ageData.age,
      age_group: getAgeGroup(ageData.age),
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date().toISOString(),
    };

    profiles.push(profile);

    return res.status(201).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.log("ERROR:", error.message);

    return res.status(500).json({
      status: "error",
      message: "External API failure",
    });
  }
};

// GET ALL
const getAllProfiles = (req, res) => {
  return res.json({
    status: "success",
    data: profiles,
  });
};

// GET ONE
const getProfile = (req, res) => {
  const { id } = req.params;

  const profile = profiles.find((p) => p.id === id);

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found",
    });
  }

  return res.json({
    status: "success",
    data: profile,
  });
};

// DELETE
const deleteProfile = (req, res) => {
  const { id } = req.params;

  const index = profiles.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found",
    });
  }

  profiles.splice(index, 1);

  return res.json({
    status: "success",
    message: "Profile deleted",
  });
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfile,
  deleteProfile,
};
