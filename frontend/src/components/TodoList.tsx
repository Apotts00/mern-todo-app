// BLOCK 1: Importing Dependencies
import React from "react";
import "./TodoList.css";

// BLOCK 2: Defining Interfaces
interface Task {
  _id: string;        // Unique ID for the task
  title: string;      // Task name
  completed: boolean; // True if done, False if not
}

interface TodoListProps {
  tasks: Task[];
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  startEditing: (id: string) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// BLOCK 3: Declares the TodoList Component
const TodoList: React.FC<TodoListProps> = ({
  tasks,
  deleteTask,
  updateTask,
  editingTitle,
  setEditingTitle,
  editingTaskId,
  setEditingTaskId,
  startEditing,
  handleEditChange,
}) => {
  // BLOCK 4: Rendering the Task List and handling task actions
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <li
          key={task._id}
          className={`todo-item ${task.completed ? "completed" : ""}`}
        >
          {/* Left side: checkbox + text / edit input */}
          <label className="todo-left">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                updateTask(task._id, { completed: !task.completed })
              }
            />

            {editingTaskId === task._id ? (
              <input
                type="text"
                className="todo-edit-input"
                value={editingTitle}
                onChange={handleEditChange}
                placeholder="Edit task..."
              />
            ) : (
              <span className="todo-text">{task.title}</span>
            )}
          </label>

          {/* Right side: action buttons */}
          <div className="todo-actions">
            {editingTaskId === task._id ? (
              <>
                <button
                  className="action-btn save"
                  onClick={() => {
                    updateTask(task._id, { title: editingTitle });
                    setEditingTaskId(null);
                    setEditingTitle("");
                  }}
                >
                  Save
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => {
                    setEditingTaskId(null);
                    setEditingTitle("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="action-btn edit"
                  onClick={() => {
                    startEditing(task._id);
                    setEditingTitle(task.title); // prefill edit input
                  }}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => deleteTask(task._id)}
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

// BLOCK 5: Exporting the Component
export default TodoList;
