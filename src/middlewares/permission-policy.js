


const setPermissionPolicy = (req, res, next) => {
  const permission = "camera=(), microphone=(), geolocation=()";
  res.setHeader("Permissions-Policy", permission);
  next();
};

module.exports = { setPermissionPolicy };
