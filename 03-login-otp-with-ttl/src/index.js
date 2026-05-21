import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await redis.set(otpKey(phone), otp, "EX", 30);
    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: "OTP sent", otp }); // In production, do not send OTP in response
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const savedOtp = await redis.get(otpKey(phone));
    if (!savedOtp) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }
    if (savedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (savedOtp === otp) {
      await redis.del(otpKey(phone));
      res.json({ message: "OTP verified" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  try {
    const ttl = await redis.ttl(otpKey(phone));
    res.json({ ttl });
  } catch (error) {
    res.status(503).json({ error: "Redis unavailable" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
