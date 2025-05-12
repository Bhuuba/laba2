import React from "react";

const TaskScore = ({ score, feedback }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    if (score >= 70) return "bg-blue-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Відмінно! Задачу додано до профілю 🏆";
    if (score >= 80) return "Дуже добре! Задачу додано до профілю 🌟";
    if (score >= 70) return "Добре! Задачу додано до профілю ✅";
    return "Спробуйте ще раз, потрібно набрати мінімум 70% ⚠️";
  };

  return (
    <div className="mt-4 p-6 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-lg">Результат:</span>
          <span className="text-white text-xl font-bold">{score}/100</span>
        </div>
        <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getScoreColor(
              score
            )} transition-all duration-500 relative`}
            style={{ width: `${score}%` }}
          >
            {score >= 70 && (
              <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-50"></div>
            )}
          </div>
          <div
            className="absolute h-full w-1 bg-yellow-300 opacity-50"
            style={{ left: "70%", marginTop: "-20px" }}
          ></div>
        </div>
        <div className="mt-2 text-center">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getScoreMessage(score)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-white font-semibold mb-2">Відгук:</h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-300 text-sm whitespace-pre-wrap">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskScore;
