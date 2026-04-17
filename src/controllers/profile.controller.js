const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

const {
  getGender,
  getAge,
  getNationality,
} = require("../services/externalApis.service");

const createProfile = (req, res) => {
  console.log("STEP 1: controller hit");

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing name",
    });
  }

  const cleanName = name.toLowerCase();

  console.log("STEP 2: checking DB");

  db.get(
    "SELECT * FROM profiles WHERE name = ?",
    [cleanName],
    async (err, existing) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "DB error",
        });
      }

      if (existing) {
        return res.json({
          status: "success",
          message: "Profile already exists",
          data: existing,
        });
      }

      try {
        console.log("STEP 3: calling APIs");

        const [genderRes, ageRes, natRes] = await Promise.all([
          getGender(cleanName),
          getAge(cleanName),
          getNationality(cleanName),
        ]);

        console.log("STEP 4: APIs done");

        const genderData = genderRes.data;
        const ageData = ageRes.data;
        const natData = natRes.data;

        const topCountry = natData.country?.[0];

        const profile = {
          id: uuidv4(),
          name: cleanName,
          gender: genderData.gender,
          gender_probability: genderData.probability,
          sample_size: genderData.count,
          age: ageData.age,
          age_group:
            ageData.age <= 12
              ? "child"
              : ageData.age <= 19
                ? "teenager"
                : ageData.age <= 59
                  ? "adult"
                  : "senior",
          country_id: topCountry?.country_id,
          country_probability: topCountry?.probability,
          created_at: new Date().toISOString(),
        };

        console.log("STEP 5: inserting");

        db.run(
          `INSERT INTO profiles 
          (id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          Object.values(profile),
          function (err) {
            if (err) {
              return res.status(500).json({
                status: "error",
                message: "Insert failed",
              });
            }

            console.log("STEP 6: success");

            return res.status(201).json({
              status: "success",
              data: profile,
            });
          },
        );
      } catch (error) {
        console.log("ERROR:", error.message);

        return res.status(500).json({
          status: "error",
          message: "External API failure",
        });
      }
    },
  );
};
// GET ALL PROFILE(here)
const getAllProfiles = (req, res) => {
  db.all("SELECT * FROM profiles", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    return res.json({
      status: "success",
      data: rows,
    });
  });
};
// GET SINGLE PROFILE(here)
const getProfile = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM profiles WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (!row) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    return res.json({
      status: "success",
      data: row,
    });
  });
};
// DELETE PROFILE (here)
const deleteProfile = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM profiles WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    return res.json({
      status: "success",
      message: "Profile deleted",
    });
  });
};

module.exports = {
  createProfile,
  getProfile,
  getAllProfiles,
  deleteProfile,
};
