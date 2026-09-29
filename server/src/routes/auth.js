import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import pool from "../utils/db.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();
const loginSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Username/email and password are required",
      });
    }

    const { login, password } = parsed.data;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        username,
        email,
        password_hash,
        role
      FROM users
      WHERE LOWER(email) = LOWER($1)
         OR LOWER(username) = LOWER($1)
      LIMIT 1
      `,
      [login]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        username,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Current user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

export default router;