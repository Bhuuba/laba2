import { useState, useEffect } from "react";
import { generateTask } from "../services/openaiService";

const HISTORY_KEY = "leetgpt_task_history";

export const useTaskState = () => {
  const [difficulty, setDifficulty] = useState("Легка");
  const [language, setLanguage] = useState("JavaScript");
  const [task, setTask] = useState("");
  const [solution, setSolution] = useState("");
  const [loadingTask, setLoadingTask] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleGenerateTask = async () => {
    setLoadingTask(true);
    setError("");

    try {
      const payload = await generateTask(difficulty, language, history);

      if (!payload || !payload.task) {
        throw new Error("Некоректний формат завдання");
      }

      setTask(payload.task);
      setSolution(payload.template || "");
      setHistory((prev) => [...prev, payload.task]);
    } catch (e) {
      console.error("Error generating task:", e);
      setError("Помилка генерації задачі: " + e.message);
      setTask("");
      setSolution("");
    } finally {
      setLoadingTask(false);
    }
  };

  return {
    difficulty,
    setDifficulty,
    language,
    setLanguage,
    task,
    solution,
    setSolution,
    loadingTask,
    error,
    handleGenerateTask,
  };
};
