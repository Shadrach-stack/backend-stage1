let profiles = [];

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const method = req.method;
  const id = req.query?.id;

  // GET ALL
  if (method === "GET" && !id) {
    return res.status(200).json({
      status: "success",
      data: profiles,
    });
  }

  // GET ONE
  if (method === "GET" && id) {
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

  // POST
  if (method === "POST") {
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    if (!body?.name) {
      return res.status(400).json({
        status: "error",
        message: "Name required",
      });
    }

    const profile = {
      id: Date.now().toString(),
      name: body.name,
    };

    profiles.push(profile);

    return res.status(201).json({
      status: "success",
      data: profile,
    });
  }

  // DELETE
  if (method === "DELETE" && id) {
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
}
