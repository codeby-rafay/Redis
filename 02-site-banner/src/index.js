import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

app.post("/banner", async (req, res) => {
  try {
    await redis.set(BANNER_KEY, req.body.banner || "redis!");
    res.json({ success: true });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.get("/banner", async (req, res) => {
  try {
    const banner = await redis.get(BANNER_KEY);
    res.json({ banner });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.delete("/banner", async (req, res) => {
  try {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.get("/banner/exists", async (req, res) => {
  try {
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
