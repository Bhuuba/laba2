import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./Button";

export const CodeEditor = ({ language, value, onChange }) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleRunCode = async () => {
    setLoading(true);
    try {
      // Создаем безопасную среду выполнения
      const sandbox = {
        console: {
          log: (...args) => {
            setOutput((prev) => prev + args.join(" ") + "\n");
          },
        },
      };

      // Выполняем код
      const fn = new Function("console", value);
      fn.call(sandbox, sandbox.console);
    } catch (error) {
      setOutput((prev) => prev + "Помилка: " + error.message + "\n");
    } finally {
      setLoading(false);
    }
  };

  const clearConsole = () => {
    setOutput("");
  };

  return (
    <section className="mb-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Редактор коду</h3>
          <div className="space-x-2">
            <Button
              onClick={clearConsole}
              variant="secondary"
              disabled={loading}
            >
              Очистити консоль
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Виконання..." : "Запустити код"}
            </Button>
          </div>
        </div>
        <div className="h-[400px] border rounded mb-4">
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
              automaticLayout: true,
            }}
          />
        </div>
        <div className="border rounded p-4 bg-gray-900 text-white font-mono text-sm h-[200px] overflow-auto">
          <pre>
            {output || "Консоль пуста. Запустіть код, щоб побачити результат."}
          </pre>
        </div>
      </div>
    </section>
  );
};
