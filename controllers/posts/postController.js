const db = require("../../models/index");
const User = db.models.user;
const Follow = db.models.user_following;
const Notify = db.models.notification;
const Post = db.models.post;
const Comment = db.models.comment;
const Like = db.models.like;

const fs = require("fs");
const path = require("path");
const xssFilter = require("xss-filters");
require("dotenv").config();

const post = {
  create: async (req, res) => {
    try {
      let filename;
      if (req.file) {
        if (typeof req.file === 1) {
          filename = req.file;
        } else {
          filename = req.file.filename;
        }
      }

      let { content } = req.body;

      //check req.body
      if (!(content || filename)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      //filter list
      let data = [content, filename];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });
      let user = req.app.locals.user;

      //save to database
      let post = await Post.create({
        content,

        userId: user.id,
      });

      if (filename != 1) {
        // check if file is an image]
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!allowedTypes.includes(req.file.mimetype)) {
          fs.unlink(
            path.join(__dirname, `../../public/images/${filename}`),
            (err) => {
              if (err) throw err;
              console.log("deleted type is not image");
            }
          );
          return res.status(400).json("File is not an image");
        }
        post.image = filename;
        await post.save();
      }

      res.json({
        Post: post,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json("something happened");
    }
  },
  update: async (req, res) => {
    try {
      const { id, content } = req.body;
      // check
      if (!(id && content)) return res.status(400).json("enter all feilds");

      //make sure no admin is replicated
      let post = await Post.findOne({ where: { id } });
      if (!post) return res.status(403).json("wrong id , post is not existed");

      let user = req.app.locals.user;
      if (post.userId != user.id) {
        return res.status(403).json("unautherized user");
      } else {
        post.content = content;
        await post.save();

        res.json({
          Post: post,
        });
      }
    } catch (error) {
      if (error) throw error;
    }
  },
  updateImage: async (req, res) => {
    try {
      let { filename } = req.file;
      let { id } = req.body;

      if (!(id && filename)) return res.status(400).json("enter all feilds");

      const post = await Post.findOne({ where: { id } });
      if (!post) return res.status(403).json("wrong id , post is not existed");
      // check if file is an image]
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlink(
          path.join(__dirname, `../../public/images/${filename}`),
          (err) => {
            if (err) throw err;
            console.log("deleted type is not image");
          }
        );
        return res.status(400).json("File is not an image");
      }

      //check if product already has an image
      let filePath = path.join(__dirname, `../../public/images/${post.image}`);

      if (fs.existsSync(filePath)) {
        //delete from fs system
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
          console.log("deleted from fs successfully");
        });
        //save the new link
        post.image = filename;
        await post.save();

        res.json({ post });
      } else {
        post.image = filename;
        await post.save();

        res.json({ post });
      }
    } catch (error) {
      if (error) throw error;
    }
  },

  delete_post: async (req, res) => {
    let { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "please enter post id" });
    }

    data = xssFilter.inHTMLData(id);
    //make sure no admin is replicated
    let post = await Post.findOne({ where: { id } });
    if (!post) return res.status(403).json("wrong id , post is not existed");

    let user = req.app.locals.user;
    if (post.userId != user.id) {
      return res.status(403).json("unautherized user");
    } else {
      Post.destroy({ where: { id } })
        .then((num) => {
          if (num == 1) {
            res.send({ message: "deleted successfully" });
          } else {
            res.send("can't delete");
          }
        })
        .catch((err) => {
          res.status(404).send({ message: err });
        });
    }
  },
  getbyid: async (req, res) => {
    try {
      let { id } = req.body;
      if (!id) {
        return res.status(400).json({ msg: "please enter post id" });
      }
      //make sure no admin is replicated
      let post = await Post.findOne({ where: { id } });
      if (!post) return res.status(403).json("wrong id , post is not existed");

      let comments = await Comment.findAll({ where: { postId: post.id } });
      res.json({
        Post: post,
        comments: comments,
      });
    } catch (error) {
      console.log(error);
    }
  },

  get_following_posts: async (req, res) => {
    try {
      let user = req.app.locals.user;

      let following = await Follow.findAll({
        where: { following_id: user.id },
      });

      let posts = await Post.findAll({
        where: { userId: following.follower_id },
      });

      for (const post of posts) {
        let comments = await Comment.findAll({ where: { postId: post.id } });
        res.json({
          Post: post,
          comments: comments,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = post;
