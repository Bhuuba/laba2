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
        <h2 className="text-2xl font-bold">Задача</h2>
        <Button onClick={onGenerate} disabled={loading} variant="primary">
          {loading
            ? "Генерація..."
            : `Згенерувати ${getDifficultyText(task?.difficulty)} задачу`}
        </Button>
      </div>

      {task ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="whitespace-pre-wrap">{task.task}</p>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            Натисніть кнопку "Згенерувати нову задачу" для початку
          </p>
        </div>
      )}
    </section>
  );
};
