import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./Button";
import TaskScore from "./TaskScore";
import { evaluateTask } from "../services/openaiService";
import { getCurrentUser, updateUserStats } from "../services/firebaseService";

export const CodeEditor = ({
  language,
  value,
  onChange,
  task,
  onTaskCompleted,
  difficulty, // добавляем параметр difficulty
}) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [startTime] = useState(new Date());

  const getMonacoLanguage = () => {
    switch (language.toLowerCase()) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "c++":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const executePython = async (code) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a Python interpreter. Execute the code and return ONLY the output that would appear in the console. No explanations, no code, just the output as plain text. Handle print statements and errors naturally.",
              },
              {
                role: "user",
                content: code,
              },
            ],
            temperature: 0,
          }),
        }
      );

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      return "Помилка виконання Python коду: " + error.message;
    }
  };

  const executeCpp = async (code) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a C++ interpreter. Execute the code and return ONLY the output that would appear in the console. No explanations, no code, just the output as plain text. Handle cout/printf and errors naturally.",
              },
              {
                role: "user",
                content: code,
              },
            ],
            temperature: 0,
          }),
        }
      );

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      return "Помилка виконання C++ коду: " + error.message;
    }
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      let result;

      switch (language.toLowerCase()) {
        case "python":
          result = await executePython(value);
          setOutput((prev) => prev + result);
          break;

        case "c++":
          result = await executeCpp(value);
          setOutput((prev) => prev + result);
          break;

        case "javascript":
        default:
          // Создаем безопасную среду выполнения для JavaScript
          const sandbox = {
            console: {
              log: (...args) => {
                setOutput((prev) => prev + args.join(" ") + "\n");
              },
            },
          };

          // Выполняем JavaScript код
          const fn = new Function("console", value);
          fn.call(sandbox, sandbox.console);
          break;
      }
    } catch (error) {
      setOutput((prev) => prev + "Помилка: " + error.message + "\n");
    } finally {
      setLoading(false);
    }
  };

  const clearConsole = () => {
    setOutput("");
  };

  const handleSubmitSolution = async () => {
    setEvaluating(true);
    setSaveSuccess(false);
    try {
      const result = await evaluateTask(task, value);
      setScore(result.score);
      setFeedback(result.feedback);

      const timeSpentMinutes = Math.round((new Date() - startTime) / 60000);

      // Проверяем проходной балл в зависимости от сложности
      const passingScore = difficulty?.toLowerCase() === "hard" ? 65 : 70;

      if (result.score >= passingScore) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const solutionData = {
            task,
            score: result.score,
            solution: value,
            date: new Date().toISOString(),
            language,
            timeSpent: timeSpentMinutes,
            difficulty: difficulty || "medium", // добавляем сложность
          };

          await updateUserStats(currentUser.uid, solutionData);
          setSaveSuccess(true);
          setOutput(
            `✨ Вітаємо! Ваше рішення успішно додано до профілю!\n` +
              `📊 Результат: ${result.score}%\n` +
              `⏱️ Час виконання: ${timeSpentMinutes} хвилин\n` +
              `🏆 Чудова робота! ${
                difficulty?.toLowerCase() === "hard"
                  ? "Складна задача успішно вирішена!"
                  : "Продовжуйте в тому ж дусі!"
              }`
          );
        }
      } else {
        setOutput(
          `⚠️ Для додавання в профіль потрібно набрати мінімум ${passingScore}%\n` +
            `📊 Ваш поточний результат: ${result.score}%\n` +
            `⏱️ Час виконання: ${timeSpentMinutes} хвилин\n` +
            `💡 Спробуйте покращити своє рішення!`
        );
      }

      if (onTaskCompleted) {
        onTaskCompleted({
          ...result,
          timeSpent: timeSpentMinutes,
          difficulty: difficulty || "medium",
        });
      }
    } catch (error) {
      setOutput("Помилка при перевірці рішення: " + error.message);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Button onClick={clearConsole} variant="secondary" disabled={loading}>
          Очистити консоль
        </Button>
        <Button onClick={handleRunCode} disabled={loading} variant="primary">
          {loading ? "Виконання..." : "Запустити код"}
        </Button>
        <Button
          onClick={handleSubmitSolution}
          disabled={evaluating}
          variant="secondary"
        >
          {evaluating ? "Перевірка..." : "Здати задачу"}
        </Button>
      </div>
      <div className="h-[400px] border border-gray-700 rounded-lg overflow-hidden mb-4">
        <Editor
          height="100%"
          defaultLanguage={getMonacoLanguage()}
          language={getMonacoLanguage()}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
      {score !== null && (
        <TaskScore score={score} feedback={feedback} difficulty={difficulty} />
      )}
      {output && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};
