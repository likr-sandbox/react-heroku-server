import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const sequelize = new Sequelize(process.env.DATABASE_URL);

export const User = sequelize.define(
  "user",
  {
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const Restaurant = sequelize.define(
  "restaurant",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.BLOB,
    },
    map: {
      type: DataTypes.TEXT,
    },
  },
  { underscored: true },
);

export const Review = sequelize.define(
  "review",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
      },
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const Bookmark = sequelize.define(
  "bookmark",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
      },
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Review,
      },
    },
  },
  { underscored: true },
);

Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);
User.hasMany(Review);
Review.belongsTo(User);
Review.hasMany(Bookmark);
Bookmark.belongsTo(Review);
