import React from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./Button";

export const CodeEditor = ({
  language,
  value,
  onChange,
  onRunTests,
  loadingTests,
}) => {
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

  return (
    <section className="mb-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Редактор коду</h3>
          <Button
            onClick={onRunTests}
            disabled={loadingTests}
            variant="primary"
          >
            {loadingTests ? "Перевірка..." : "Перевірити розв'язок"}
          </Button>
        </div>
        <div className="h-[400px] border rounded">
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
      </div>
    </section>
  );
};
