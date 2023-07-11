const db = require("../../models/index");

const Notify = db.models.notification;
const Post = db.models.post;
const Comment = db.models.comment;

const xssFilter = require("xss-filters");
require("dotenv").config();

const comment = {
  create: async (req, res) => {
    let { content, postId } = req.body;

    //check req.body
    if (!(content && postId)) {
      return res.status(400).json({ msg: " please enter all fields" });
    }

    //filter list
    let data = [content, postId];
    //filtered data
    data.map((data) => {
      data = xssFilter.inHTMLData(data);
    });

    //make sure no admin is replicated
    let post = await Post.findOne({ where: { id: postId } });
    if (!post) return res.status(403).json("wrong id , post is not existed");

    let user = req.app.locals.user;

    const newComment = await Comment.create({
      content,
      userId: user.id,
      postId: post.id,
    });
    const notify = await Notify.create({
      sender_id: user.id,
      reciever_id: post.userId,
      status: "comment",
    });
    res.json({
      comment: newComment,
    });
  },

  update: async (req, res) => {
    try {
      let { content, id } = req.body;

      //check req.body
      if (!(content && id)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      //filter list
      let data = [content, id];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });

      //make sure no admin is replicated
      let comment = await Comment.findOne({ where: { id } });
      if (!comment)
        return res.status(403).json("wrong id , comment is not existed");

      let user = req.app.locals.user;
      if (comment.userId != user.id) {
        return res.status(403).json("unautherized user");
      } else {
        comment.content = content;
        await comment.save();

        return res.status(200).json({ updated_comment: comment });
      }
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    let { id } = req.body;

    //check req.body
    if (!id) {
      return res.status(400).json({ msg: " please enter comment id" });
    }
    //make sure no admin is replicated
    let comment = await Comment.findOne({ where: { id } });
    if (!comment)
      return res.status(403).json("wrong id , comment is not existed");

    let user = req.app.locals.user;
    if (comment.userId != user.id) {
      return res.status(403).json("unautherized user");
    } else {
      Comment.destroy({ where: { id } })
        .then((num) => {
          if (num == 1) {
            res.send({ message: "comment deleted " });
          } else {
            res.send("can't make the proccess");
          }
        })
        .catch((err) => {
          res.status(404).send({ message: err });
        });
    }
  },
  all_post_comments: async (req, res) => {
    let { id } = req.body;
    if (!id) return res.status(400).json("please enter post id");

    let post = await Post.findOne({ where: { id } });
    if (!post) return res.status(403).json("wrong id , post is not existed");

    let comments = await Comment.findAll({ where: { postId: id } });

    res.json({
      comments: comments,
    });
  },
};

module.exports = comment;
