let profiles = [];

const getJSONBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body || "{}");
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });

module.exports = async (req, res) => {
  try {
    // GET all profiles
    if (req.method === "GET") {
      return res.status(200).json({
        status: "success",
        data: profiles,
      });
    }

    // POST create profile
    if (req.method === "POST") {
      const body = await getJSONBody(req);
      const { name } = body;

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
          message: "Profile already exists",
          data: existing,
        });
      }

      // fake simple profile (to avoid API crash for now)
      const profile = {
        id: Date.now().toString(),
        name: cleanName,
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
    console.log("ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
