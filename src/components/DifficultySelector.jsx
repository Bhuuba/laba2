import React from "react";

export const DifficultySelector = ({ selectedDifficulty, onSelect }) => {
  const difficulties = [
    { id: "easy", label: "Легкий", color: "bg-green-500" },
    { id: "medium", label: "Середній", color: "bg-yellow-500" },
    { id: "hard", label: "Складний", color: "bg-red-500" },
  ];

  return (
    <div className="flex space-x-4 mb-6">
      {difficulties.map(({ id, label, color }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedDifficulty === id
              ? `${color} text-white`
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
