import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: "Missing required fields: to, subject, body" });
  }

  const emailData = JSON.stringify({ to, subject, body });
  await redis.lpush(QUEUE_KEY, emailData);
  res.json({ queued: true, emailData: { to, subject, body } });
});

app.get("/emails/process-one", async (req, res) => {
  const rawEmailData = await redis.rpop(QUEUE_KEY);
  if (!rawEmailData) {
    return res.json({ processed: false, message: "No emails in queue" });
  }
  const emailData = JSON.parse(rawEmailData);
  res.json({ message: "Email sent", emailData });
});

app.listen(3000, () => {
  console.log("Email queue server running on port 3000");
});
