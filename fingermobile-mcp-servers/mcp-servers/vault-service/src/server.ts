import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";;
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey"; // Should be a strong, unique key

app.use(cors());
app.use(express.json());

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize(
  process.env.PG_DATABASE || "vault_db",
  process.env.PG_member || "member",
  process.env.PG_PASSWORD || "password",
  {host: process.env.PG_HOST || "localhost",
  dialect: "postgres",
  logging: false
  },
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the PostgreSQL,
database:", err);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("Vault Service is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Vault Service listening on port ${PORT}`);
});
