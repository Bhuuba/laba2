import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./Button";
import TaskScore from "./TaskScore";
import { evaluateTask } from "../services/openaiService";
import { getCurrentUser, updateUserStats } from "../services/firebaseService";

// Список подозрительных слов и фраз
const SUSPICIOUS_PATTERNS = [
  /зарахуй/i,
  /будь ласка/i,
  /поставь/i,
  /дай відповідь/i,
  /правильн[аеиі] відповід[ьі]/i,
  /розвяжи/i,
  /виріши/i,
  /допоможи/i,
  /chat/i,
  /gpt/i,
  /openai/i,
  /api[._-]?key/i,
];

// Проверка кода на попытки обмана
const checkCodeSecurity = (code) => {
  // Проверка на подозрительные фразы
  const containsSuspiciousPatterns = SUSPICIOUS_PATTERNS.some((pattern) =>
    pattern.test(code.toLowerCase())
  );

  // Проверка на наличие HTTP запросов
  const containsHttpRequests = /fetch|xhr|axios|http|api\.openai\.com/.test(
    code
  );

  // Проверка на eval и подобные функции
  const containsUnsafeFunctions =
    /eval|Function|require|import|process\.env/.test(code);

  if (containsSuspiciousPatterns) {
    throw new Error(
      "⚠️ Виявлено спробу обману! Будь ласка, пишіть тільки код для розв'язання задачі."
    );
  }

  if (containsHttpRequests) {
    throw new Error(
      "⚠️ Заборонено використовувати зовнішні API та HTTP запити."
    );
  }

  if (containsUnsafeFunctions) {
    throw new Error(
      "⚠️ Виявлено небезпечні функції. Використовуйте тільки стандартний код."
    );
  }

  return true;
};

const languageThemes = {
  javascript: {
    editor: {
      background: "rgba(255, 206, 0, 0.05)",
      borderColor: "rgba(255, 206, 0, 0.2)",
    },
    console: "bg-yellow-900/30",
    button: "bg-yellow-500 hover:bg-yellow-600",
  },
  python: {
    editor: {
      background: "rgba(59, 130, 246, 0.05)",
      borderColor: "rgba(59, 130, 246, 0.2)",
    },
    console: "bg-blue-900/30",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  "c++": {
    editor: {
      background: "rgba(168, 85, 247, 0.05)",
      borderColor: "rgba(168, 85, 247, 0.2)",
    },
    console: "bg-purple-900/30",
    button: "bg-purple-500 hover:bg-purple-600",
  },
};

export const CodeEditor = ({
  language,
  value,
  onChange,
  task,
  onTaskCompleted,
  difficulty,
}) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [startTime] = useState(new Date());

  const currentTheme =
    languageThemes[language.toLowerCase()] || languageThemes.javascript;

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

  const getLanguageTemplate = () => {
    switch (language.toLowerCase()) {
      case "python":
        return "def solution(input):\n    # Ваш код тут\n    pass";
      case "c++":
        return "#include <iostream>\n#include <vector>\n\nauto solution(auto input) {\n    // Ваш код тут\n    return 0;\n}";
      default:
        return "function solution(input) {\n    // Ваш код тут\n    return null;\n}";
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
      // Проверяем код на безопасность перед выполнением
      checkCodeSecurity(value);

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
          const sandbox = {
            console: {
              log: (...args) => {
                setOutput((prev) => prev + args.join(" ") + "\n");
              },
            },
          };

          const fn = new Function("console", value);
          fn.call(sandbox, sandbox.console);
          break;
      }
    } catch (error) {
      setOutput(error.message + "\n");
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
      // Проверяем код на безопасность перед отправкой
      checkCodeSecurity(value);

      const result = await evaluateTask(task, value);
      setScore(result.score);
      setFeedback(result.feedback);

      const timeSpentMinutes = Math.round((new Date() - startTime) / 60000);

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
            difficulty: difficulty || "medium",
          };

          await updateUserStats(currentUser.uid, solutionData);
          setSaveSuccess(true);
          setOutput(
            `✨ Вітаємо! Ваше рішення успішно додано до профілю!\n` +
              `📊 Результат: ${result.score}%\n` +
              `⏱️ Час виконання: ${timeSpentMinutes} хвилин\n` +
              `🌟 Мова програмування: ${language}\n` +
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
      setOutput(error.message || "Помилка при перевірці рішення");
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    if (!value && language) {
      onChange(getLanguageTemplate());
    }
  }, [language]);

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={clearConsole}
          variant="secondary"
          disabled={loading}
          className={currentTheme.button}
        >
          Очистити консоль
        </Button>
        <Button
          onClick={handleRunCode}
          disabled={loading}
          variant="primary"
          className={currentTheme.button}
        >
          {loading ? "Виконання..." : "Запустити код"}
        </Button>
        <Button
          onClick={handleSubmitSolution}
          disabled={evaluating}
          variant="secondary"
          className={currentTheme.button}
        >
          {evaluating ? "Перевірка..." : "Здати задачу"}
        </Button>
      </div>
      <div
        className={`h-[400px] rounded-lg overflow-hidden mb-4 transition-colors duration-300`}
        style={{
          border: `1px solid ${currentTheme.editor.borderColor}`,
          background: currentTheme.editor.background,
        }}
      >
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
        <div className={`p-4 rounded-lg mt-4 ${currentTheme.console}`}>
          <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};
