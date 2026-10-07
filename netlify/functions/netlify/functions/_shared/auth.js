const db = require("./supabase-admin");

async function getUser(event) {
  const h = event.headers || {};
  const auth =
    h.authorization ||
    h.Authorization ||
    "";

  if (!auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.slice(7).trim();

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

function res(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(body),
  };
}

module.exports = {
  getUser,
  res,
};
``
