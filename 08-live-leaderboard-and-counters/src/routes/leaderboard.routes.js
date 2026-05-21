const express = require("express");
const router = express.Router();

const {
  addScore,
  getTopLeaders,
  getUserRank,
} = require("../controllers/leaderboard.controller");

router.post("/score", addScore);
router.get("/", getTopLeaders);
router.get("/:userId/rank", getUserRank);

module.exports = router;
