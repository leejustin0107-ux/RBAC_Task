import bcrypt from "bcryptjs";
import pool from "../src/utils/db.js";

const users = [
  {
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    name: "Manager User",
    username: "manager",
    email: "manager@example.com",
    password: "Manager123!",
    role: "manager",
  },
  {
    name: "Normal User",
    username: "user",
    email: "user@example.com",
    password: "User123!",
    role: "user",
  },
];

async function seedUsers() {
  try {
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);

      await pool.query(
        `
        INSERT INTO users (
          name,
          username,
          email,
          password_hash,
          role
        )
        VALUES ($1, $2, $3, $4, $5)

        ON CONFLICT (username)
        DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          updated_at = NOW()
        `,
        [
          user.name,
          user.username,
          user.email,
          passwordHash,
          user.role,
        ]
      );
    }

    console.log("Demo users seeded successfully.");
  } catch (error) {
    console.error("Failed to seed users:", error);
  } finally {
    await pool.end();
  }
}

seedUsers();