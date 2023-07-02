const express = require("express");
const router = express.Router();
const like = require("../controllers/posts/likeController");
const validUser = require("../middlewares/auth/userAuth");

router.post("/", validUser, like.like_and_unlike);
router.post("/all_likers", validUser, like.all_likers);

module.exports = router;
