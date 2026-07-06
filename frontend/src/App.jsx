import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/todos`;

  useEffect(() => {
    getTodos();
  }, []);

  // GET TODOS
  const getTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ADD TODO
  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(API_URL, {
        title,
      });

      setTitle("");
      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        completed: !completed,
      });

      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // START EDIT
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      await axios.put(
        `${API_URL}/edit/${id}`,
        {
          title: editText,
        }
      );

      setEditingId(null);
      setEditText("");

      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // STATS
  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingCount = todos.filter(
    (todo) => !todo.completed
  ).length;

  const chartData = [
    {
      name: "Completed",
      value: completedCount,
    },
    {
      name: "Pending",
      value: pendingCount,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          Todo Dashboard
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <div className="bg-green-600 p-6 rounded-2xl text-center shadow-lg">
            <h2 className="text-4xl font-bold text-white">
              {completedCount}
            </h2>

            <p className="text-white">
              Completed Tasks
            </p>
          </div>

          <div className="bg-red-600 p-6 rounded-2xl text-center shadow-lg">
            <h2 className="text-4xl font-bold text-white">
              {pendingCount}
            </h2>

            <p className="text-white">
              Pending Tasks
            </p>
          </div>

        </div>

        {/* PIE CHART */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 shadow-lg">

          <h2 className="text-white text-2xl font-semibold text-center mb-4">
            Task Analytics
          </h2>

          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={120}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* TODO SECTION */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">

          {/* ADD TODO */}
          <div className="flex gap-3 mb-6">

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter task..."
              className="flex-1 p-3 rounded-lg outline-none"
            />

            <button
              onClick={addTodo}
              className="bg-green-500 hover:bg-green-600 px-5 rounded-lg text-white font-semibold"
            >
              Add
            </button>

          </div>

          {/* TODO LIST */}
          <div className="space-y-3">

            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-slate-700 p-4 rounded-lg flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      toggleComplete(
                        todo.id,
                        todo.completed
                      )
                    }
                  />

                  {editingId === todo.id ? (
                    <input
                      value={editText}
                      onChange={(e) =>
                        setEditText(
                          e.target.value
                        )
                      }
                      className="p-2 rounded text-black"
                    />
                  ) : (
                    <span
                      className={
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }
                    >
                      {todo.title}
                    </span>
                  )}

                </div>

                <div className="flex gap-2">

                  {editingId === todo.id ? (
                    <button
                      onClick={() =>
                        saveEdit(todo.id)
                      }
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        startEdit(todo)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteTodo(todo.id)
                    }
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;