import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./Button";
import TaskScore from "./TaskScore";
import { evaluateTask } from "../services/openaiService";

export const CodeEditor = ({ language, value, onChange, task }) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);

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
            model: "gpt-3.5-turbo",
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
            model: "gpt-3.5-turbo",
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
          setOutput(result);
          break;

        case "c++":
          result = await executeCpp(value);
          setOutput(result);
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
    try {
      const result = await evaluateTask(task, value);
      setScore(result.score);
      setFeedback(result.feedback);
    } catch (error) {
      setOutput("Ошибка при проверке решения: " + error.message);
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
          {evaluating ? "Проверка..." : "Сдать задачу"}
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

      {output && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white mb-2">Вывод:</h3>
          <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {score !== null && <TaskScore score={score} feedback={feedback} />}
    </div>
  );
};
