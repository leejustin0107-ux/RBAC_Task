import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import pool from "../utils/db.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();

const roleSchema = z.enum(["admin", "manager", "user"]);
const createUserSchema = z.object({
  name: z.string().trim().min(1),
  username: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema,
});
const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    username: z.string().trim().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: roleSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        username,
        email,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      users: result.rows,
    });
  } catch (error) {
    console.error("List users error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid user data",
        errors: parsed.error.issues,
      });
    }

    const {
      name,
      username,
      email,
      password,
      role,
    } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        username,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4, $5)

      RETURNING
        id,
        name,
        username,
        email,
        role,
        created_at
      `,
      [
        name,
        username,
        email,
        passwordHash,
        role,
      ]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid update data",
        errors: parsed.error.issues,
      });
    }

    const data = parsed.data;

    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      values.push(data.name);
      updates.push(`name = $${values.length}`);
    }

    if (data.username !== undefined) {
      values.push(data.username);
      updates.push(`username = $${values.length}`);
    }

    if (data.email !== undefined) {
      values.push(data.email);
      updates.push(`email = $${values.length}`);
    }

    if (data.role !== undefined) {
      values.push(data.role);
      updates.push(`role = $${values.length}`);
    }

    if (data.password !== undefined) {
      const passwordHash = await bcrypt.hash(
        data.password,
        10
      );
      values.push(passwordHash);
      updates.push(
        `password_hash = $${values.length}`
      );
    }

    values.push(userId);

    const result = await pool.query(
      `
      UPDATE users
      SET
        ${updates.join(", ")},
        updated_at = NOW()
      WHERE id = $${values.length}

      RETURNING
        id,
        name,
        username,
        email,
        role,
        updated_at
      `,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;