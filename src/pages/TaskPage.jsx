import React, { useState } from "react";
import { Task } from "../components/Task";
import { CodeEditor } from "../components/CodeEditor";
import { generateTask } from "../services/openaiService";
import { updateUserStats, getCurrentUser } from "../services/firebaseService";
import { DifficultySelector } from "../components/DifficultySelector";

const TaskPage = () => {
  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  const handleGenerateTask = async () => {
    setLoading(true);
    try {
      const result = await generateTask(difficulty, "javascript", []);
      setTask({
        ...result,
        difficulty: difficulty, // Убеждаемся, что сложность всегда установлена
      });
      setCode(result.template || "");
    } catch (error) {
      console.error("Error generating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompleted = async (taskResult) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const fullTaskResult = {
        ...taskResult,
        difficulty: difficulty,
        task: task.task,
        title: task.title,
        solution: code,
        language: "javascript",
      };

      console.log("Sending task result:", fullTaskResult);
      await updateUserStats(currentUser.uid, fullTaskResult);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Виберіть рівень складності:
            </h2>
            <DifficultySelector
              selectedDifficulty={difficulty}
              onSelect={setDifficulty}
            />
          </div>

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
              difficulty={difficulty}
              onTaskCompleted={handleTaskCompleted}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TaskPage;
