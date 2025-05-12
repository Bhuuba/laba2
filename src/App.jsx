import React from "react";
import { useTaskState } from "./hooks/useTaskState";
import { difficulties, languages } from "./constants";
import { Task } from "./components/Task";
import { CodeEditor } from "./components/CodeEditor";
import { TestResults } from "./components/TestResults";

export function App() {
  const {
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
  } = useTaskState();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">LeetGPT</h1>
          <div className="flex space-x-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingTask}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingTask}
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </header>

        <main>
          <Task
            task={task}
            onGenerate={handleGenerateTask}
            loading={loadingTask}
          />

          <CodeEditor
            language={language}
            value={solution}
            onChange={setSolution}
            onRunTests={handleRunTests}
            loadingTests={loadingTests}
          />

          <TestResults
            testResults={testResults}
            score={score}
            loading={loadingTests}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
