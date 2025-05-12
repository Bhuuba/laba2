import { useState, useEffect } from "react";
import { generateTask } from "../services/openaiService";
import { executeCode } from "../services/codeExecutionService";

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
  const [testResults, setTestResults] = useState([]);
  const [score, setScore] = useState(null);
  const [loadingTests, setLoadingTests] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleGenerateTask = async () => {
    setLoadingTask(true);
    setError("");
    setTestResults([]);
    setScore(null);

    try {
      const payload = await generateTask(difficulty, language, history);

      if (!payload || !payload.task) {
        throw new Error("Некоректний формат завдання");
      }

      setTask(payload.task);
      setSolution(payload.template || "");
      setCurrentTask(payload);
      setHistory((prev) => [...prev, payload.task]);
    } catch (e) {
      console.error("Error generating task:", e);
      setError("Помилка генерації задачі: " + e.message);
      setTask("");
      setSolution("");
      setCurrentTask(null);
    } finally {
      setLoadingTask(false);
    }
  };

  const handleRunTests = async () => {
    if (!currentTask || !currentTask.tests || !solution) {
      setError("Немає задачі або розв'язку для тестування");
      return;
    }

    setLoadingTests(true);
    setError("");
    setTestResults([]);
    setScore(null);

    try {
      const results = [];
      for (const test of currentTask.tests) {
        const result = await executeCode(solution, language, test);
        results.push({
          input: test.input,
          expected: test.expected,
          actual: result.output,
          passed:
            result.success &&
            JSON.stringify(result.output) === JSON.stringify(test.expected),
          error: result.error,
        });
      }

      setTestResults(results);

      // Вычисляем процент успешных тестов
      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;
      setScore(Math.round((passedCount / totalCount) * 100));
    } catch (e) {
      console.error("Error running tests:", e);
      setError("Помилка виконання тестів: " + e.message);
    } finally {
      setLoadingTests(false);
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
    handleRunTests,
    testResults,
    score,
    loadingTests,
  };
};
