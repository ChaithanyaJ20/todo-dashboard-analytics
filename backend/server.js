require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// =======================
// GET TODOS
// =======================
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// =======================
// ADD TODO
// =======================
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todos (title) VALUES($1) RETURNING *",
      [title]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// =======================
// TOGGLE COMPLETE
// =======================
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2",
      [completed, id]
    );

    res.json({
      message: "Todo updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// =======================
// EDIT TODO
// =======================
app.put("/todos/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2",
      [title, id]
    );

    res.json({
      message: "Todo edited successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to edit todo" });
  }
});

// =======================
// DELETE TODO
// =======================
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );

    res.json({
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("Todo Dashboard API is running 🚀");
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});