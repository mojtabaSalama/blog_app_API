const express = require("express");
const router = express.Router();
const user = require("../controllers/users/userController");
const follow = require("../controllers/users/follow_user");

const validUser = require("../middlewares/auth/userAuth");
const multer = require("multer");
const user_following = require("../models/user_following");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//routes -------------------
router.post("/register", user.register);

router.post("/login", user.login);

router.post("/update", validUser, user.update);

router.post(
  "/update-image",
  validUser,
  upload.single("file"),
  user.updateImage
);

router.post("/get-user", validUser, user.getbyid);
router.post("/remove_user", validUser, user.remove_user);

router.post("/follow", validUser, follow.follow_and_unfollow);
router.post("/all_followers", validUser, follow.all_followers);
router.post("/all_following", validUser, follow.all_following);

//---------------------------

module.exports = router;
