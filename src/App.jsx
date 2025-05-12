import React, { useState } from "react";
import { Task } from "./components/Task";
import { CodeEditor } from "./components/CodeEditor";
import { generateTask } from "./services/openaiService";

function App() {
  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateTask = async () => {
    setLoading(true);
    try {
      const result = await generateTask("medium", "javascript", []); // можно добавить историю задач позже
      setTask(result);
      setCode(result.template || "");
    } catch (error) {
      console.error("Error generating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            LeetGPT: Практика программирования
          </h1>
        </header>

        <main className="max-w-4xl mx-auto">
          <Task
            task={task}
            taskText={task?.task}
            onGenerate={handleGenerateTask}
            loading={loading}
          />

          {task && (
            <CodeEditor
              language="javascript"
              value={code}
              onChange={setCode}
              task={task?.task}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
