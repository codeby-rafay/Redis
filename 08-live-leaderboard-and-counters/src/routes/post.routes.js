const express = require("express");
const router = express.Router();
const { incrementPostView } = require("../controllers/post.controller");

router.post("/:id/view", incrementPostView);

module.exports = router;
