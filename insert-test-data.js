import { Review, User } from "./db.js";

const users = [
  { sub: "testuser1", nickname: "testuser1" },
  { sub: "testuser2", nickname: "testuser2" },
];

for (const record of users) {
  await User.create(record);
}

const reviews = [
  { restaurantId: 1, title: "テスト1", comment: "コメント", userId: 1 },
  { restaurantId: 2, title: "テスト2", comment: "コメント", userId: 1 },
  { restaurantId: 3, title: "テスト3", comment: "コメント", userId: 1 },
  { restaurantId: 4, title: "テスト4", comment: "コメント", userId: 1 },
  { restaurantId: 1, title: "テスト5", comment: "コメント", userId: 2 },
  { restaurantId: 2, title: "テスト6", comment: "コメント", userId: 2 },
  { restaurantId: 3, title: "テスト7", comment: "コメント", userId: 2 },
  { restaurantId: 4, title: "テスト8", comment: "コメント", userId: 2 },
];

for (const record of reviews) {
  await Review.create(record);
}
