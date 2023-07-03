module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      freezTableName: true,
    }
  );

  return comment;
};
