export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res.status(500).json({ error: "ADMIN_TOKEN_NOT_CONFIGURED" });
  }

  const token =
    req.header("x-admin-token") ||
    (req.header("authorization")?.startsWith("Bearer ")
      ? req.header("authorization").slice("Bearer ".length)
      : null);

  if (!token || token !== expected) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  next();
}

