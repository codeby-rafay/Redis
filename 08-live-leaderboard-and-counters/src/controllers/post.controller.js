const redis = require("../redisClient");

exports.incrementPostView = async (req, res) => {
  try {
    const { id } = req.params;

    const key = `post:${id}:views`;

    // INCR = atomic counter
    const views = await redis.incr(key);

    res.json({
      postId: id,
      views,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
