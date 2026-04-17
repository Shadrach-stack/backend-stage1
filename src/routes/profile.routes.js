const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  getAllProfiles,
  deleteProfile,
} = require("../controllers/profile.controller");

router.post("/profiles", createProfile);
router.get("/profiles", getAllProfiles);
router.get("/profiles/:id", getProfile);
router.delete("/profiles/:id", deleteProfile);

module.exports = router;
