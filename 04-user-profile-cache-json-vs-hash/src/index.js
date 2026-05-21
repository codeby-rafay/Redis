import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  try {
    await redis.set(`user:${userId}:json`, JSON.stringify(userData));
    res.json({ savedAs: "json" });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.get("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  try {
    const userData = await redis.get(`user:${userId}:json`);
    if (userData) {
      res.json({ user: userData ? JSON.parse(userData) : null });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.post("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  try {
    await redis.hset(`user:${userId}:hash`, userData);
    res.json({ savedAs: "hash" });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.get("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  try {
    const userData = await redis.hgetall(`user:${userId}:hash`);
    if (Object.keys(userData).length > 0) {
      res.json({ user: userData });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
