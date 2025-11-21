// BLOCK 1: Importing Dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./components/TodoList.tsx";
import "./App.css";

// BLOCK 2: Defining Task Interface
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

// Fun helpers
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getFunMessage = (remaining: number) => {
  if (remaining === 0) return "Everything is done. Soft life activated. ✨";
  if (remaining <= 3) return "Just a few more — you got this. 💪🏾";
  if (remaining <= 7) return "One task at a time. You’re still that girl. 👑";
  return "Booked, busy & blessed. Let’s prioritize. 📋";
};

// BLOCK 3: Setting Up State Variables
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  // BLOCK 4: Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Task[]>(BASE_URL);
        setTasks(response.data);
      } catch (err: unknown) {
        console.error("Error fetching tasks:", err);
        setError(
          "Having trouble reaching the server. If this is a demo link, the free hosting may need 20–30 seconds to wake up."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [BASE_URL]);

  // BLOCK 5: Adding a Task
  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const response = await axios.post<Task>(
        BASE_URL,
        { title: task.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      setTasks((prev) => [...prev, response.data]);
      setTask("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Could not add the task. Please try again.");
    }
  };

  // BLOCK 6: Delete a task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Could not delete the task. Please try again.");
    }
  };

  // BLOCK 7: Updating a Task
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put<Task>(
        `${BASE_URL}/${id}`,
        updatedTask,
        { headers: { "Content-Type": "application/json" } }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, ...response.data } : task
        )
      );
      setEditingTaskId(null);
      setEditingTitle("");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Could not update the task. Please try again.");
    }
  };

  // BLOCK 8: Handling Edits
  const startEditing = (id: string) => {
    setEditingTaskId(id);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  // Derived stats for “fun” UI
  const completedCount = tasks.filter((t) => t.completed).length;
  const remaining = tasks.length - completedCount;
  const percent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  // BLOCK 9: Render the app
  return (
    <div className="app-shell">
      <header className="todo-header">
        <div>
          <p className="todo-eyebrow">{getGreeting()}, Adrienne</p>
          <h1 className="todo-title">Today’s Focus</h1>
          <p className="todo-sub">
            {tasks.length === 0
              ? "Add a few things so Future You can relax."
              : getFunMessage(remaining)}
          </p>
        </div>

        <div className="progress-card">
          <p className="progress-label">Progress</p>
          <div className="progress-circle">
            <span>{percent}%</span>
          </div>
          <p className="progress-meta">
            {completedCount}/{tasks.length} done
          </p>
        </div>
      </header>

      {/* Input row */}
      <div className="input-row">
        <input
          type="text"
          value={task}
          className="todo-input"
          onChange={(e) => setTask(e.target.value)}
          placeholder="What’s one thing Future You will thank you for?"
        />
        <button onClick={addTask} className="btn btn-primary">
          Add Task
        </button>
      </div>

      {/* Loading / error state */}
      {loading && (
        <div className="status-message">
          <div className="spinner" />
          <p>Warming up your task server… This may take a few seconds on free hosting.</p>
        </div>
      )}

      {error && !loading && (
        <div className="status-message status-error">
          {error}
        </div>
      )}

      {/* Main todo list */}
      {!loading && (
        <TodoList
          tasks={tasks}
          deleteTask={deleteTask}
          updateTask={updateTask}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          startEditing={startEditing}
          handleEditChange={handleEditChange}
        />
      )}

      {/* Celebration when everything is done */}
      {tasks.length > 0 && remaining === 0 && !loading && (
        <div className="celebration">
          🎉 Everything is checked off. Go do something for YOU.
        </div>
      )}
    </div>
  );
};

// BLOCK 10: Exporting the Component
export default App;
