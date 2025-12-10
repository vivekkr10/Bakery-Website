const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(403).json({ message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Invalid admin token", error: err.message });
  }
};

module.exports = adminMiddleware;
