module.exports = (sequelize, DataTypes) => {
  const user_following = sequelize.define(
    "user_following",
    // must be changed later
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },

      follower_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      following_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezTableName: true,
    }
  );

  return user_following;
};
