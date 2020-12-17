import express from "express";
import cors from "cors";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import sequelize from "sequelize";
import { Restaurant, Review, User } from "./db.js";
import { getUser } from "./auth0.js";

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-ajrt-kp3.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://review-app",
  issuer: `https://dev-ajrt-kp3.us.auth0.com/`,
  algorithms: ["RS256"],
});

app.get("/restaurants", async (req, res) => {
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const restaurants = await Restaurant.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM reviews AS r WHERE r.restaurant_id = restaurant.id)`,
          ),
          "review_count",
        ],
      ],
    },
    include: { model: Review, limit: 3, include: { model: User } },
    order: [[sequelize.literal("review_count"), "DESC"]],
    limit,
    offset,
  });
  res.json(restaurants);
});

app.get("/restaurants/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findByPk(restaurantId);
  res.json(restaurant);
});

app.get("/restaurants/:restaurantId/reviews", async (req, res) => {
  const { restaurantId } = req.params;
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const reviews = await Review.findAndCountAll({
    include: { model: User },
    where: { restaurantId },
    limit,
    offset,
  });
  res.json(reviews);
});

app.post("/restaurants/:restaurantId/reviews", checkJwt, async (req, res) => {
  const auth0User = await getUser(req.get("Authorization"));
  const [user, created] = await User.findOrCreate({
    where: { sub: auth0User.sub },
    defaults: {
      nickname: auth0User.nickname,
    },
  });
  if (!created) {
    user.nickname = auth0User.nickname;
    await user.save();
  }
  const review = await Review.create(
    Object.assign({}, req.body, { userId: user.id }),
  );
  res.json(review);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
