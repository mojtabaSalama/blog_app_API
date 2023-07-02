module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define(
    "notification",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
      status: {
        type: DataTypes.ENUM("like", "comment", "follow"),
        allowNull: false,
      },
      is_seen: {
        type: DataTypes.BOOLEAN, //0 means not seen , 1 seen
        allowNull: false,
        defaultValue: false,
      },
      sender_id: {
        type: DataTypes.UUID,

        allowNull: false,
      },
      reciever_id: {
        type: DataTypes.UUID,

        allowNull: false,
      },
    },
    {
      freezTableName: true,
    }
  );

  return notification;
};
