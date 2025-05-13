import React from "react";

export const DifficultySelector = ({ selectedDifficulty, onSelect }) => {
  const difficulties = [
    {
      id: "easy",
      label: "Легкий",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "medium",
      label: "Середній",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
    },
    {
      id: "hard",
      label: "Складний",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ];

  return (
    <div className="flex space-x-4 mb-6">
      {difficulties.map(({ id, label, color, hoverColor }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`px-6 py-2.5 rounded-lg transition-all duration-300 font-medium ${
            selectedDifficulty === id
              ? `${color} text-white shadow-lg scale-105`
              : "bg-white/10 text-white hover:bg-white/20"
          } ${hoverColor}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
