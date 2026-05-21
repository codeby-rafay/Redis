const redis = require("../redisClient");

const LEADERBOARD_KEY = "leaderboard";

exports.addScore = async (req, res) => {
  try {
    const { userId, score } = req.body;

    // ZINCRBY = add points
    await redis.zincrby(LEADERBOARD_KEY, score, userId);

    res.json({ message: "Score updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopLeaders = async (req, res) => {
  try {
    // ZREVRANGE = highest score first
    const leaders = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "WITHSCORES");

    // format response
    const result = [];
    for (let i = 0; i < leaders.length; i += 2) {
      result.push({
        userId: leaders[i],
        score: Number(leaders[i + 1]),
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);

    if (rank === null) {
      return res.json({ message: "User not found" });
    }

    res.json({
      userId,
      rank: rank + 1, // 0-based -> 1-based
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
