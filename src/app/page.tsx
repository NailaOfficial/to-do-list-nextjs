"use client";
import React, { useState, useEffect, useCallback } from "react";
import background from "../../public/bg.jpg";
import { Trash2, Check, Edit2, Calendar } from "lucide-react";

// Define a type for the Todo item
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  dueDate: string | null;
  priority: "low" | "medium" | "high";
  createdAt: string;
  placeholder: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [category, setCategory] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("advancedTodos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("advancedTodos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
      category: category || "General",
      dueDate: dueDate || null,
      priority,
      createdAt: new Date().toISOString(),
      placeholder: "Add Date",
    };

    setTodos((prev) => [...prev, newTodo]);
    resetForm();
  }, [input, category, dueDate, priority]);

  const resetForm = () => {
    setInput("");
    setCategory("");
    setDueDate("");
    setPriority("medium");
    setEditingTodo(null);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      (filter === "completed" && todo.completed) ||
      (filter === "active" && !todo.completed) ||
      filter === "all";
    return matchesSearch && matchesFilter;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
  });

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    const colorMap = {
      high: "bg-red-100 border-red-500",
      medium: "bg-yellow-100 border-yellow-500",
      low: "bg-green-100 border-green-500",
    };
    return colorMap[priority] || "";
  };

  return (
    <div
    className="min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8"
    style={{
      backgroundImage: `url(${background.src})`, // Corrected with backticks
      backgroundSize: "cover",
      backgroundPosition: "center",
      }}
      >
  
      <div className="w-full max-w-xl bg-black rounded-3xl shadow-2xl p-6 border border-gray-200">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-700">
          Todo List App
        </h1>

        {/* Input Section */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Create a new task..."
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-black py-2 px-4 rounded-xl text-sm sm:text-base hover:from-gray-600 hover:to-blue-700 transition duration-300 placeholder-black"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-lg bg-blue-500 text-white"
            >
              <option value="">Category</option>
              {["Frontend", "Backend", "Testing", "Deployment"].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="p-2 border rounded-lg bg-yellow-500 text-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 border rounded-lg bg-teal-600 text-white"  
            />
          </div>

          <button
            onClick={addTodo}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-xl text-sm sm:text-base hover:from-gray-600 hover:to-blue-700 transition duration-300"
            >
          
            Add Task
          </button>
        </div>

       {/* Search and Filter */}
        <div className="mb-4 flex flex-wrap sm:flex-nowrap space-x-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded-lg bg-purple-500 text-white hover:bg-purple-600 placeholder:text-black"
          />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "active" | "completed")
            }
            className="p-2 border rounded-lg bg-teal-500 text-white hover:bg-teal-600"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>


        {/* Todo List */}
        <ul className="space-y-3 max-h-80 sm:max-h-[500px] overflow-y-auto">
          {sortedTodos.map((todo) => (
            <li
              key={todo.id}
              className={`p-4 rounded-xl shadow-md ${getPriorityColor(
                todo.priority
              )} flex flex-wrap items-center justify-between`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setTodos((prev) =>
                      prev.map((t) =>
                        t.id === todo.id
                          ? { ...t, completed: !t.completed }
                          : t
                      )
                    )
                  }
                  className={`p-1 rounded-full ${
                    todo.completed
                      ? "bg-green-500 text-white"
                      : "border border-gray-300 text-gray-400"
                  }`}
                >
                  <Check size={16} />
                </button>
                <div>
                  <span
                    className={`text-sm sm:text-base font-medium ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="text-xs text-gray-600 flex space-x-2">
                    <span>{todo.category}</span>
                    {todo.dueDate && (
                      <span>
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingTodo(todo);
                    setInput(todo.text);
                    setCategory(todo.category);
                    setDueDate(todo.dueDate || "");
                    setPriority(todo.priority);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() =>
                    setTodos((prev) => prev.filter((t) => t.id !== todo.id))
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {sortedTodos.length === 0 && (
          <p className="text-center text-gray-500 mt-4 text-sm sm:text-base">
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
}
