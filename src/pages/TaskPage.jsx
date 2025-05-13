import React, { useState } from "react";
import { Task } from "../components/Task";
import { CodeEditor } from "../components/CodeEditor";
import { generateTask } from "../services/openaiService";
import { updateUserStats, getCurrentUser } from "../services/firebaseService";
import { DifficultySelector } from "../components/DifficultySelector";

// Определяем стили для разных языков
const languageStyles = {
  javascript: "bg-yellow-500/10 border-yellow-500/30",
  python: "bg-blue-500/10 border-blue-500/30",
  "c++": "bg-purple-500/10 border-purple-500/30",
};

const TaskPage = () => {
  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [language, setLanguage] = useState("javascript");

  const handleGenerateTask = async () => {
    setLoading(true);
    try {
      const result = await generateTask(difficulty, language, []);
      setTask({
        ...result,
        difficulty: difficulty,
        language: language,
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
        language: language,
      };

      console.log("Sending task result:", fullTaskResult);
      await updateUserStats(currentUser.uid, fullTaskResult);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <main>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Практичні завдання
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
              Виберіть складність та мову програмування, щоб отримати унікальну
              задачу
            </p>

            {/* Селектор сложности */}
            <div className="space-y-4 sm:space-y-6">
              <DifficultySelector
                selectedDifficulty={difficulty}
                onSelect={setDifficulty}
              />

              {/* Селектор языка */}
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {Object.keys(languageStyles).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base transition-colors ${
                      language === lang
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Task
            task={task}
            taskText={task?.task}
            onGenerate={handleGenerateTask}
            loading={loading}
          />

          {task && (
            <CodeEditor
              language={language}
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
