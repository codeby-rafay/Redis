import express from "express";
import { emailQueue } from "./queue";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = emailQueue.add(
    "welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "Welcome to our service!",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  res.json({ message: "Welcome email queued successfully", jobId: job.id });
});

app.listen(3000, () => {
  console.log("API server is running on http://localhost:3000");
});
