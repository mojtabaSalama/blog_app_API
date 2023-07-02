const express = require("express");
const router = express.Router();
const notify = require("../controllers/notification/notifyController");
const validUser = require("../middlewares/auth/userAuth");

router.get("/", validUser, notify.notification);
router.post("/is_seen", validUser, notify.is_seen);

//---------------------------

module.exports = router;
