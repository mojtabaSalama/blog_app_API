module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define(
    "like",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
    },
    {
      freezTableName: true,
    }
  );

  return like;
};
