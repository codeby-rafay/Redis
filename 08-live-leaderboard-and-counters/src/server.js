const express = require("express");
const postRoutes = require("./routes/post.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");

const app = express();
app.use(express.json());

// routes
app.use("/post", postRoutes);
app.use("/leaderboard", leaderboardRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
