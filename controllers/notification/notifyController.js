const db = require("../../models/index");
const Notify = db.models.notification;
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const notification = {
  notification: async (req, res) => {
    let user = req.app.locals.user;
    let notify = await Notify.findAll({ where: { reciever_id: user.id } });
    if (notify.length == 0) {
      return res.status(200).json("no notification yet");
    }
    await res.json({
      notifications: notify,
    });
  },

  is_seen: async (req, res) => {
    let { id } = req.body;
    if (!id) return res.status(400).json("please enter id");
    let notify = Notify.findOne({ where: { id } });
    if (!notify) return res.status(400).json("notification is not existed");

    if (notify.is_seen == true) {
      return res.status(403).json("notification is seen before");
    }
    notify.is_seen = true;
    await notify.save();
  },
};
module.exports = notification;
