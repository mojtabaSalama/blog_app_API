const db = require("../../models/index");
const User = db.models.user;
const Follow = db.models.user_following;
const Notify = db.models.notification;
const Post = db.models.post;
const Like = db.models.like;

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const like_post = {
  like_and_unlike: async (req, res) => {
    try {
      let { id } = req.body;

      //check req.body
      if (!id) {
        return res.status(400).json({ msg: " please enter post's id" });
      }

      // check the id belongs to an existed post
      let post = await Post.findOne({ where: { id } });
      if (!post)
        return res.status(403).json("there is no post with id provided ");

      let user = req.app.locals.user;

      let like = await Like.findOne({
        where: { userId: user.id, postId: post.id },
      }); //see if right

      if (!like) {
        const newlike = await Like.create({
          postId: id,
          userId: user.id,
        });
        const notify = await Notify.create({
          sender_id: user.id,
          reciever_id: post.userId,
          status: "like",
        });

        return res.status(200).json({ msg: " post Liked successfully" });
      } else {
        Like.destroy({ where: { postId: post.id } })
          .then((num) => {
            if (num == 1) {
              res.send({ message: "you unliked the post " });
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
  all_likers: async (req, res) => {
    let { id } = req.body;
    if (!id) return res.status(400).json("please enter post id");

    let post = await Post.findOne({ where: { id } });
    if (!post) return res.status(403).json("wrong id , post is not existed");

    let likers = await Like.findAll({ where: { postId: id } });

    res.json({
      likers: likers,
    });
  },
};
module.exports = like_post;
