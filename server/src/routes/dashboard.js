import { Router } from "express";

import pool from "../utils/db.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const countResult = await pool.query(`
      SELECT COUNT(*)::int AS total_users
      FROM users
    `);

    return res.status(200).json({
      stats: {
        totalUsers: countResult.rows[0].total_users,
        activeUsers: 18,
        reportsGenerated: 42,
        systemUptime: 99.9,
      },

      userGrowth: [
        { month: "Apr", users: 8 },
        { month: "May", users: 11 },
        { month: "Jun", users: 15 },
        { month: "Jul", users: 18 },
        { month: "Aug", users: 22 },
        { month: "Sep", users: 27 },
      ],

      activity: [
        { day: "Mon", requests: 120 },
        { day: "Tue", requests: 170 },
        { day: "Wed", requests: 145 },
        { day: "Thu", requests: 210 },
        { day: "Fri", requests: 190 },
        { day: "Sat", requests: 95 },
        { day: "Sun", requests: 75 },
      ],
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;