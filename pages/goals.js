import { useState } from "react";
import Layout from "../components/Layout"; 

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addGoal = (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    const newGoal = {
      id: Date.now(),
      title,
      dueDate,
      completed: false,
    };
    setGoals((prev) => [...prev, newGoal]);
    setTitle("");
    setDueDate("");
  };

  const toggleComplete = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <Layout> 
      <h1>My Goals</h1>
      <p>Track and manage your academic goals 🎯</p>

      <form
        onSubmit={addGoal}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>

      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {goals.map((goal) => (
          <li
            key={goal.id}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <h3
              style={{
                textDecoration: goal.completed ? "line-through" : "none",
                marginBottom: "10px",
              }}
            >
              {goal.title}
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Due: {new Date(goal.dueDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => toggleComplete(goal.id)}
              style={{
                backgroundColor: goal.completed ? "gray" : "green",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {goal.completed ? "Undo" : "Mark Complete"}
            </button>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
