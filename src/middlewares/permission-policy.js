const setPermissionPolicy = (req, res, next) => {
  const permission = "camera=(), microphone=(), geolocation=()";
  res.setHeader("Permission-Policy", permission);
  next();
};

module.exports = { setPermissionPolicy };
