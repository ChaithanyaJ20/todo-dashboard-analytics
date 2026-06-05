require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.log(
      "Database connection error:",
      err.message
    );
  } else {
    console.log("Database connected");
  }
});


// ==========================
// GET ALL TODOS
// ==========================
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================
// ADD TODO
// ==========================
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const newTodo = await pool.query(
      "INSERT INTO todos (title) VALUES($1) RETURNING *",
      [title]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================
// TOGGLE COMPLETE
// ==========================
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2",
      [completed, id]
    );

    res.json({
      message: "Todo updated",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================
// EDIT TODO TITLE
// ==========================
app.put("/todos/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2",
      [title, id]
    );

    res.json({
      message: "Todo title updated",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================
// DELETE TODO
// ==========================
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );

    res.json({
      message: "Todo deleted",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================
// START SERVER
// ==========================
app.listen(5000, () => {
  console.log(
    "Server started on port 5000"
  );
});