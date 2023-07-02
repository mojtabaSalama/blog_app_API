const db = require("../../models/index");
const User = db.models.user;
const Follow = db.models.user_following;
const Notify = db.models.notification;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const follow_user = {
  follow_and_unfollow: async (req, res) => {
    try {
      let { id } = req.body;

      //check req.body
      if (!id) {
        return res.status(400).json({ msg: " please enter user's id" });
      }

      // check the id belongs to an existed user
      let check_user = await User.findOne({ where: { id } });
      if (!check_user)
        return res.status(403).json("there is no user with id provided ");

      let user = req.app.locals.user;

      let follow = await Follow.findOne({
        where: { following_id: id, follower_id: user.id },
      }); //see if right

      if (!follow) {
        const newfollow = await Follow.create({
          following_id: id,
          follower_id: user.id,
        });
        const notify = await Notify.create({
          sender_id: user.id,
          reciever_id: id,
          status: "follow",
        });

        return res.status(200).json({ msg: " user followed successfully" });
      } else {
        Follow.destroy({ where: { id: follow.id } })
          .then((num) => {
            if (num == 1) {
              res.send({ message: "you unfollowed the use " });
            } else {
              res.send("can't make the proccess");
            }
          })
          .catch((err) => {
            res.status(404).send({ message: err });
          });
      }
    } catch (error) {
      console.log(error);
    }
  },

  all_followers: async (req, res) => {
    let { id } = req.body;
    if (!id) return res.status(400).json("please enter the id");

    let followers = await Follow.findAll({ where: { following_id: id } });

    await res.json({
      followers: followers,
    });
  },
  all_following: async (req, res) => {
    let { id } = req.body;
    if (!id) return res.status(400).json("please enter the id");

    let following = await Follow.findAll({ where: { follower_id: id } });

    res.json({
      following: following,
    });
  },
};
module.exports = follow_user;
