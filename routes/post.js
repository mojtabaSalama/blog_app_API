const express = require("express");
const router = express.Router();
const post = require("../controllers/posts/postController");
const validUser = require("../middlewares/auth/userAuth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/create", upload.single("file"), validUser, post.create);
router.get("/index", validUser, post.get_following_posts);

router.post("/update", upload.single("file"), validUser, post.update);
router.post("/delete", validUser, post.delete_post);
router.post("/get_post", validUser, post.getbyid);

module.exports = router;
