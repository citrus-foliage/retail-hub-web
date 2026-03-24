const admin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized. Admin access required." });
  }
};

export default admin;
