import React from "react";
import { Button } from "./Button";

export const Task = ({ task, onGenerate, loading }) => {
  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: "легку",
      medium: "середню",
      hard: "складну",
    };
    return texts[difficulty] || "нову";
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Задача</h2>
        <Button onClick={onGenerate} disabled={loading} variant="primary">
          {loading
            ? "Генерація..."
            : `Згенерувати ${getDifficultyText(task?.difficulty)} задачу`}
        </Button>
      </div>

      {task ? (
        <div className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg p-6 text-gray-200">
          {task.title && (
            <h3 className="text-xl font-semibold mb-4 text-white">
              {task.title}
            </h3>
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
