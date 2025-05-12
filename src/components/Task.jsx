import React from "react";
import { Button } from "./Button";

export const Task = ({ task, onGenerate, loading, taskText }) => {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Задача</h2>
        <Button onClick={onGenerate} disabled={loading} variant="primary">
          {loading ? "Генерация..." : "Сгенерировать новую задачу"}
        </Button>
      </div>

      {task ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="whitespace-pre-wrap">{taskText}</p>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            Нажмите кнопку "Сгенерировать новую задачу" для начала
          </p>
        </div>
      )}
    </section>
  );
};
