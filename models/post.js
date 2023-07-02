module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezTableName: true,
    }
  );

  return post;
};
