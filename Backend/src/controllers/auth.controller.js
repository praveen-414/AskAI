import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //   validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required...",
      });
    }
    //   check user already exists before signup
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists! try login...",
      });
    }

    //  create user
    const user = await userModel.create({
      name,
      email,
      password,
    });

    // generate JWT tokens
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // hash refresh token to save in DB
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },

      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    const userData = user.toObject();
    delete userData.password;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully...",
      userData,
      accessToken,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error...",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    // compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Hash refresh token
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Create session
    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        sessionId: session._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    // Store refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password before sending user
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully...",
      userData,
      accessToken,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error...",
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not found!",
      });
    }
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });
    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token!",
      });
    }
    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("LOGOUT ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error...",
    });
  }
};

const logoutAll = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token not found!",
    });
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
  await sessionModel.updateMany(
    {
      user: decoded.userId,
      revoked: false,
    },
    {
      revoked: true,
    },
  );
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out from all devices successfully...",
  });
};

const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // 1. Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    // 2. Hash received refresh token
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // 3. Find matching session
    const session = await sessionModel.findOne({
      user: decoded.userId,
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    // 4. Generate new access token
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        sessionId: session._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    // 5. Rotate refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // 6. Hash new refresh token
    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // 7. Replace old hash
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    // 8. Replace refresh-token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9. Return new access token
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export default { signup, login, logout, logoutAll, getRefreshToken };
