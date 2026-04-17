const app = require("./app");

const PORT = process.env.PORT || 3000;

// Only run locally (NOT on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
