import React from "react";

const TaskScore = ({ score, feedback }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white">Оценка:</span>
          <span className="text-white font-bold">{score}/100</span>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getScoreColor(
              score
            )} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-white font-semibold mb-2">Отзыв:</h3>
        <p className="text-gray-300 text-sm">{feedback}</p>
      </div>
    </div>
  );
};

export default TaskScore;
