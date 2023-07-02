const express = require("express");
const router = express.Router();
const comment = require("../controllers/posts/commentController");
const validUser = require("../middlewares/auth/userAuth");

router.post("/create", validUser, comment.create);
router.post("/update", validUser, comment.update);
router.post("/all_comments", validUser, comment.all_post_comments);
router.post("/delete", validUser, comment.delete);

module.exports = router;
