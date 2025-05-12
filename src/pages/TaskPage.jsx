import React, { useState } from "react";
import { Task } from "../components/Task";
import { CodeEditor } from "../components/CodeEditor";
import { generateTask } from "../services/openaiService";

const TaskPage = () => {
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
    <div className="container mx-auto px-4 py-8">
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
  );
};

export default TaskPage;
