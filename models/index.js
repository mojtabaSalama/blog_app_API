require("dotenv").config();
const Sequelize = require("sequelize");

//connecting to mysql
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASSWORD,
  {
    host: process.env.DBHOST,
    dialect: process.env.DIALECT,
  }
);

//initializing db object holding db_connection && db_models
let db = {};
db.sequelize = sequelize;
db.models = {};

//require the objects
let user = require("./User")(sequelize, Sequelize.DataTypes);
let post = require("./post")(sequelize, Sequelize.DataTypes);
let comment = require("./comment")(sequelize, Sequelize.DataTypes);
let like = require("./like")(sequelize, Sequelize.DataTypes);
let user_following = require("./user_following")(
  sequelize,
  Sequelize.DataTypes
);
let notification = require("./notification")(sequelize, Sequelize.DataTypes);

// //sql relationship here -------------------------------
user.hasMany(post);
post.hasMany(comment);
comment.belongsTo(user);
post.hasMany(like);
like.belongsTo(user);
// //-----------------------------------------------------

// //add to db models
db.models.user = user;
db.models.post = post;
db.models.comment = comment;
db.models.like = like;
db.models.user_following = user_following;
db.models.notification = notification;

module.exports = db;
