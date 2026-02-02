import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "aws-amplify/auth";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Goals() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "General",
    priority: "Medium",
    color: "#3b82f6",
  });

  // Filter/sort state
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");

  // Categories and priority options
  const categories = [
    "General",
    "Health",
    "Career",
    "Education",
    "Finance",
    "Personal",
  ];
  const priorities = ["Low", "Medium", "High"];
  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
  ];

  // Initialize and load user
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        const userSub = user?.userId || user?.sub || user?.username;
        setUserId(userSub);
        await loadGoals(userSub);
      } catch (err) {
        console.error("Auth error:", err);
        setError("Please log in to view your goals");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [router]);

  // Load goals from DynamoDB via API
  const loadGoals = async (uid) => {
    try {
      setError(null);
      const response = await fetch(`/api/goals?userId=${uid}`);
      const data = await response.json();

      if (data.success) {
        setGoals(data.goals || []);
      } else {
        // Handle specific errors with helpful messages
        if (data.tableName) {
          setError(
            `⚠️ DynamoDB Setup Required: ${data.message}\n\nTo enable persistent goals:\n1. Create DynamoDB table: ${data.tableName}\n2. See ${data.instructions}\n\nFor now, goals will not persist.`,
          );
        } else {
          setError(data.message || data.error || "Failed to load goals");
        }
      }
    } catch (err) {
      console.error("Load goals error:", err);
      setError(
        "Failed to connect to server. Check that the dev server is running.",
      );
    }
  };

  // Add new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Goal title is required");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/goals?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Goal created successfully! 🎉");
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          category: "General",
          priority: "Medium",
          color: "#3b82f6",
        });
        setFormOpen(false);
        await loadGoals(userId);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to create goal");
      }
    } catch (err) {
      console.error("Add goal error:", err);
      setError("Failed to create goal");
    }
  };

  // Toggle goal completion
  const handleToggleComplete = async (goal) => {
    try {
      setError(null);
      const response = await fetch(`/api/goals?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: goal.goalId,
          completed: !goal.completed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGoals(
          goals.map((g) =>
            g.goalId === goal.goalId ? { ...g, completed: !g.completed } : g,
          ),
        );
      } else {
        setError(data.error || "Failed to update goal");
      }
    } catch (err) {
      console.error("Toggle goal error:", err);
      setError("Failed to update goal");
    }
  };

  // Edit goal
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      dueDate: goal.dueDate || "",
      category: goal.category || "General",
      priority: goal.priority || "Medium",
      color: goal.color || "#3b82f6",
    });
    setFormOpen(true);
  };

  // Update goal
  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Goal title is required");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/goals?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: editingGoal.goalId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Goal updated successfully! 🎉");
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          category: "General",
          priority: "Medium",
          color: "#3b82f6",
        });
        setEditingGoal(null);
        setFormOpen(false);
        await loadGoals(userId);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to update goal");
      }
    } catch (err) {
      console.error("Update goal error:", err);
      setError("Failed to update goal");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      category: "General",
      priority: "Medium",
      color: "#3b82f6",
    });
    setFormOpen(false);
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      setError(null);
      const response = await fetch(`/api/goals?userId=${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId }),
      });

      const data = await response.json();

      if (data.success) {
        setGoals(goals.filter((g) => g.goalId !== goalId));
        setSuccess("Goal deleted");
        setTimeout(() => setSuccess(null), 2000);
      } else {
        setError(data.error || "Failed to delete goal");
      }
    } catch (err) {
      console.error("Delete goal error:", err);
      setError("Failed to delete goal");
    }
  };

  // Filter and sort goals
  const filteredGoals = goals
    .filter(
      (goal) => filterCategory === "All" || goal.category === filterCategory,
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return (
          new Date(a.dueDate || "9999-12-31") -
          new Date(b.dueDate || "9999-12-31")
        );
      }
      if (sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return (
          (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        );
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const completedCount = goals.filter((g) => g.completed).length;
  const completionRate =
    goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  if (loading) {
    return (
      <Layout>
        <div className="page-header text-center">
          <div className="animate-spin">⏳</div>
          <p>Loading your goals...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        {/* Page Header */}
        <div className="page-header">
          <h1>🎯 My Goals</h1>
          <p>Set, track, and achieve your goals</p>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="alert alert-danger"
            style={{ whiteSpace: "pre-line" }}
          >
            <span>⚠️</span>
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✓</span>
            <p>{success}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-2 mb-lg">
          <div className="card">
            <div className="flex-between">
              <div>
                <p style={{ color: "var(--gray-500)", margin: 0 }}>
                  Total Goals
                </p>
                <h2 style={{ margin: 0, color: "var(--primary)" }}>
                  {goals.length}
                </h2>
              </div>
              <div style={{ fontSize: "2.5rem" }}>🎯</div>
            </div>
          </div>

          <div className="card">
            <div className="flex-between">
              <div>
                <p style={{ color: "var(--gray-500)", margin: 0 }}>
                  Completion Rate
                </p>
                <h2 style={{ margin: 0, color: "var(--success)" }}>
                  {completionRate}%
                </h2>
                <div
                  className="progress"
                  style={{ marginTop: "var(--spacing-sm)", height: "6px" }}
                >
                  <div
                    className="progress-bar"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ fontSize: "2.5rem" }}>📈</div>
            </div>
          </div>
        </div>

        {/* Add Goal Button & Controls */}
        <div
          className="flex-between mb-lg"
          style={{ flexWrap: "wrap", gap: "var(--spacing-md)" }}
        >
          <div
            className="flex filter-controls"
            style={{ gap: "var(--spacing-sm)", flexWrap: "wrap" }}
          >
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={() => setFormOpen(!formOpen)}
          >
            {formOpen ? "✕ Cancel" : "+ New Goal"}
          </button>
        </div>

        {/* Add/Edit Goal Form */}
        {formOpen && (
          <div className="card mb-lg animate-scale">
            <h3>{editingGoal ? "✏️ Edit Goal" : "Create New Goal"}</h3>
            <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}>
              <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                {/* Title */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 600,
                    }}
                  >
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Learn React Advanced Concepts"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 600,
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Add more details about your goal..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Row: Category, Priority, Due Date */}
                <div className="grid grid-3">
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontWeight: 600,
                      }}
                    >
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontWeight: 600,
                      }}
                    >
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      {priorities.map((pri) => (
                        <option key={pri} value={pri}>
                          {pri}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontWeight: 600,
                      }}
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontWeight: 600,
                    }}
                  >
                    Color
                  </label>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border:
                            formData.color === color
                              ? "3px solid var(--gray-900)"
                              : "2px solid var(--gray-300)",
                          cursor: "pointer",
                          transition: "all var(--transition-base)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div
                  className="goal-form-actions"
                  style={{
                    display: "flex",
                    gap: "var(--spacing-md)",
                    marginTop: "var(--spacing-md)",
                  }}
                >
                  <button type="submit" className="btn-primary">
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <div
            className="card text-center"
            style={{ padding: "var(--spacing-2xl)" }}
          >
            <div
              style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}
            >
              🎯
            </div>
            <h3>No goals yet</h3>
            <p style={{ color: "var(--gray-500)" }}>
              {goals.length === 0
                ? "Create your first goal to get started!"
                : "No goals match your current filters."}
            </p>
            {goals.length === 0 && (
              <button
                className="btn-primary mt-md"
                onClick={() => setFormOpen(true)}
              >
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid">
            {filteredGoals.map((goal) => (
              <div
                key={goal.goalId}
                className="card"
                style={{
                  borderLeft: `4px solid ${goal.color || "var(--primary)"}`,
                  opacity: goal.completed ? 0.7 : 1,
                }}
              >
                <div className="card-header">
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--spacing-sm)",
                        alignItems: "flex-start",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => handleToggleComplete(goal)}
                        style={{
                          marginTop: "6px",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            textDecoration: goal.completed
                              ? "line-through"
                              : "none",
                            color: goal.completed
                              ? "var(--gray-400)"
                              : "var(--gray-900)",
                            margin: 0,
                          }}
                        >
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p
                            style={{
                              margin: "var(--spacing-xs) 0 0 0",
                              fontSize: "0.9rem",
                              color: "var(--gray-500)",
                              textDecoration: goal.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => handleEditGoal(goal)}
                      style={{ padding: "4px 12px" }}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDeleteGoal(goal.goalId)}
                      style={{ padding: "4px 12px" }}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: "var(--spacing-md)",
                    marginTop: "var(--spacing-md)",
                  }}
                >
                  {goal.category && (
                    <div>
                      <small
                        style={{
                          color: "var(--gray-500)",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Category
                      </small>
                      <div className="badge badge-primary">{goal.category}</div>
                    </div>
                  )}

                  {goal.priority && (
                    <div>
                      <small
                        style={{
                          color: "var(--gray-500)",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Priority
                      </small>
                      <div
                        className={`badge badge-${goal.priority === "High" ? "danger" : goal.priority === "Medium" ? "warning" : "primary"}`}
                      >
                        {goal.priority}
                      </div>
                    </div>
                  )}

                  {goal.dueDate && (
                    <div>
                      <small
                        style={{
                          color: "var(--gray-500)",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Due Date
                      </small>
                      <div
                        style={{ color: "var(--gray-700)", fontWeight: 600 }}
                      >
                        {new Date(goal.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {goal.completed && (
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <span
                        style={{ color: "var(--success)", fontSize: "1.5rem" }}
                      >
                        ✓ Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-spin {
          display: inline-block;
          animation: spin 1s linear infinite;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Layout>
  );
}
