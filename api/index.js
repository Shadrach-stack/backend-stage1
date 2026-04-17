let profiles = [];

// external APIs
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
    const { method } = req;
    const url = req.url;

    // GET ALL
    if (method === "GET" && url === "/api") {
      return res.json({ status: "success", data: profiles });
    }

    // GET ONE
    if (method === "GET" && url.startsWith("/api/")) {
      const id = url.split("/")[2];
      const profile = profiles.find((p) => p.id === id);

      if (!profile) {
        return res.status(404).json({
          status: "error",
          message: "Not found",
        });
      }

      return res.json({ status: "success", data: profile });
    }

    // CREATE
    if (method === "POST" && url === "/api") {
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

      const existing = profiles.find((p) => p.name === cleanName);
      if (existing) {
        return res.json({
          status: "success",
          message: "Profile exists",
          data: existing,
        });
      }

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
        age: age.age,
        age_group: getAgeGroup(age.age),
        country_id: topCountry?.country_id,
        created_at: new Date().toISOString(),
      };

      profiles.push(profile);

      return res.status(201).json({
        status: "success",
        data: profile,
      });
    }

    // DELETE
    if (method === "DELETE" && url.startsWith("/api/")) {
      const id = url.split("/")[2];

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
