import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sessionModel from "../models/session.model.js";
import crypto from "crypto";
dotenv.config();

const isAuth = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not found!",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.findOne({
      user: decoded.userId,
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export default isAuth;
