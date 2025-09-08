import { useEffect, useState } from "react";
import { api } from "./api";
import ExportButton from "../components/ExportButton";

export default function App() {
  // State for List
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // State for Create Form
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editEstimatedHours, setEditEstimatedHours] = useState("");
  const [updating, setUpdating] = useState(false);
  const [toggleBusyId, setToggleBusyId] = useState(null);
  const [deleteBusyId, setDeleteBusyId] = useState(null);

  // Load Tasks from API
  async function loadTasks() {
    try {
      setErrors([]);
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setErrors(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  // Handle Create
  async function handleAdd(e) {
    e.preventDefault();
    if (checkErrors(title, category, estimatedHours)) {
      return;
    }

    try {
      setSaving(true);
      setErrors([]);

      // Send null if no date picked; the API accepts either ISO date or null
      await api.createTask({
        title: title.trim(),
        isDone: false,
        dueDate: dueDate || null,
        category: category.trim(),
        estimatedHours: parseInt(estimatedHours) || 0,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Reset form + Refresh List
      setTitle("");
      setDueDate("");
      setCategory("");
      setEstimatedHours("");
      await loadTasks();

      
    } catch (err) {
      setErrors(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  // Handle update : toggle task done
  async function toggleDone(task) {
    try {
      setErrors([]);
      setToggleBusyId(task.id);
      // Send full object as our API expects the complete entity on PUT
      await api.updateTask(task.id, { ...task, isDone: !task.isDone });
      await loadTasks();
    } catch (err) {
      setErrors(err.message || "Failed to update task.")
    } finally {
      setToggleBusyId(null);
    }
  }

  // Handle update : Start edit task
  function startEdit(task) {
    setEditId(task.id);
    setEditTitle(task.title);
    const d = task.dueDate ? new Date(task.dueDate) : null;
    const ymd = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      : "";
    setEditDueDate(ymd);
    setEditCategory(task.category);
    setEditEstimatedHours(task.estimatedHours);
  }

  // Handle update : Cancel edit
  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditDueDate("");
    setEditCategory("");
    setEditEstimatedHours("");
  }

  // Handle update : Save edit
  async function saveEdit(originalTask) {
    if (checkErrors(editTitle, editCategory, editEstimatedHours)) {
      return;
    }

    try {
      setUpdating(true);
      setErrors([]);

      const payload = {
        ...originalTask,
        title: editTitle.trim(),
        dueDate: editDueDate ? editDueDate : null,
        category: editCategory.trim(),
        estimatedHours: editEstimatedHours ? parseInt(editEstimatedHours) : 0,
      };

      await api.updateTask(originalTask.id, payload);
      cancelEdit();
      await loadTasks();
    } catch (err) {
      setErrors(err.message || "Failed to update task.");
    } finally {
      setUpdating(false);
    }
  }

  // Handle remove task
  async function remove(id) {
    try {
      setErrors([]);
      setDeleteBusyId(id);
      await api.deleteTask(id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadTasks();

    } catch (err) {
      setErrors(err.message || "Failed to delete  task.")
    } finally {
      setDeleteBusyId(null);
    }
  }

  function checkErrors(title, category, estimatedHours) {
    const errorList = [];
    if (!title.trim()) {
      errorList.push("Title is required.");
    }

    if (!category.trim()) {
      errorList.push("Category is required.");

    }

    if (
      estimatedHours !== "" &&
      estimatedHours !== undefined &&
      (!Number.isInteger(Number(estimatedHours)) || Number(estimatedHours) < 0)
    ) {
      errorList.push("Estimated hours input is invalid.");
    }

    if (errorList.length > 0) {
      setErrors(errorList);
      return true;
    }
  }

  const sorted = [...tasks].sort((a, b) => {
    // Pending first (false < true)
    if (a.isDone !== b.isDone) return a.isDone - b.isDone;
    // Then by due date (nulls last)
    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return ad - bd
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="flex max-w-4xl mx-auto p-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold">Tasks</h1>
          <p className="text-gray-600">Create a task and it will appear below</p>
        </div>

        <ExportButton tasks={tasks} />
      </header>


      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Create Form */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-end">

          {/* Title Input */}
          <div className="flex-1 min-w-106">
            <label className="block text-sm text-gray-600 mb-1">Title *</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Learn CRUD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due date</label>
            <input
              type="date"
              className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Category Input */}
          <div className="flex-1 min-w-106">
            <label className="block text-sm text-gray-600 mb-1">Category *</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Work, Health, Entertainment..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Estimated Hours Input */}
          <div className="flex-1 min-w-16">
            <label className="block text-sm text-gray-600 mb-1">Estimated Hours</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0+"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className={`rounded-xl px-4 py-2 text-white ${saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>
            {saving ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Errors/Loading */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            {errors.map((err, i) => (
              <div key={i}>• {err}</div>
            ))}
          </div>
        )}
        {loading && <div className="text-gray-600">Loading...</div>}

        {/* Task List */}
        <ul className="bg-white rounded-2xl shadow divide-y divide-gray-100">
          {/* Check if task/s exists */}
          {(sorted ?? tasks).length === 0 && !loading && (
            <li className="p-8 text-center text-gray-500">
              <div className="text-lg font-medium">No tasks yet</div>
              <div className="text-sm">Add your first task using the form above</div>
            </li>
          )}

          {/*  Show tasks if found */}
          {(sorted ?? tasks).map((task) => {
            const isEditing = editId === task.id;
            const rowBusy = toggleBusyId === task.id || deleteBusyId === task.id;

            return (
              <li key={task.id} className="p-4 flex items-center gap-3">
                {/* Done Checkbox */}
                <input
                  type="checkbox"
                  className="size-5 accent-blue-600"
                  checked={task.isDone}
                  onChange={() => toggleDone(task)}
                  disabled={rowBusy || isEditing}
                  aria-label={`Toggle ${task.title}`}
                />

                {/* Title and Due date Content Area */}
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <div className={`font-medium ${task.isDone ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </div>
                      {task.dueDate && (
                        <div className={`text-sm flex ${task.isDone ? "line-through text-gray-400" : ""}`}>
                          <div className="min-w-50 max-w-50">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</div>
                          <div className="min-w-50 max-w-50">Category: {task.category || "Uncategorized"}</div>
                          <div className="min-w-50 max-w-50">Estimated Hours: {task.estimatedHours}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <input
                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-36 flex-1"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        disabled={updating}
                      />
                      <input
                        type="date"
                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-36 flex-1"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        disabled={updating}
                      />
                      <input
                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-36 flex-1"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        placeholder="Category"
                        disabled={updating}
                      />
                      <input
                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-4 flex-1"
                        value={editEstimatedHours}
                        onChange={(e) => setEditEstimatedHours(e.target.value)}
                        placeholder="Estimated Hours"
                        disabled={updating}
                      />
                    </div>
                  )}
                </div>



                {/* Right side actions : Edit and Delete */}
                {!isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      disabled={rowBusy}
                      className={`rounded-lg px-3 py-1 text-gray-700 ${rowBusy ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${task.title}"?`)) remove(task.id);
                      }}
                      disabled={rowBusy}
                      className={`rounded-lg px-3 py-1 text-gray-700 ${rowBusy ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      aria-label={`Delete ${task.title}`}
                    >
                      {deleteBusyId === task.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveEdit(task)}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1"
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1 text-gray-700"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}