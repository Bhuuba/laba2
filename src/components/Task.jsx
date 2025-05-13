import React from "react";
import { Button } from "./Button";

const languageStyles = {
  javascript: {
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/20",
    button: "bg-yellow-500 hover:bg-yellow-600",
    header: "from-yellow-500/20 to-transparent",
  },
  python: {
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    button: "bg-blue-500 hover:bg-blue-600",
    header: "from-blue-500/20 to-transparent",
  },
  "c++": {
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    button: "bg-purple-500 hover:bg-purple-600",
    header: "from-purple-500/20 to-transparent",
  },
};

export const Task = ({ task, onGenerate, loading }) => {
  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: "легку",
      medium: "середню",
      hard: "складну",
    };
    return texts[difficulty] || "нову";
  };

  const currentStyle = task?.language
    ? languageStyles[task.language.toLowerCase()]
    : languageStyles.javascript;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Задача</h2>
        <Button
          onClick={onGenerate}
          disabled={loading}
          variant="primary"
          className={task?.language && currentStyle.button}
        >
          {loading
            ? "Генерація..."
            : `Згенерувати ${getDifficultyText(task?.difficulty)} задачу`}
        </Button>
      </div>

      {task ? (
        <div
          className={`backdrop-blur-sm shadow-lg rounded-lg p-6 text-gray-200 border ${currentStyle.bg} ${currentStyle.border}`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-b ${currentStyle.header} rounded-t-lg`}
          />
          {task.title && (
            <h3 className="text-xl font-semibold mb-4 text-white">
              {task.title}
            </h3>
          )}
          {task.language && (
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${currentStyle.bg} ${currentStyle.border}`}
              >
                {task.language.toUpperCase()}
              </span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{task.task}</p>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-800/30 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-700">
          <p className="text-gray-400">
            Натисніть кнопку "Згенерувати нову задачу" для початку
          </p>
        </div>
      )}
    </section>
  );
};
