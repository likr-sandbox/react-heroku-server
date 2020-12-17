import fetch from "node-fetch";

export async function getUser(token) {
  const auth0Request = await fetch(
    "https://dev-ajrt-kp3.us.auth0.com/userinfo",
    {
      headers: {
        Authorization: token,
      },
    },
  );
  return auth0Request.json();
}
