import React from "react";

const TaskScore = ({ score, feedback, difficulty }) => {
  const getScoreColor = (score, difficulty) => {
    const thresholds = {
      hard: { excellent: 85, good: 75, pass: 65 },
      medium: { excellent: 90, good: 80, pass: 70 },
      easy: { excellent: 95, good: 85, pass: 70 },
    };

    const threshold =
      thresholds[difficulty?.toLowerCase()] || thresholds.medium;

    if (score >= threshold.excellent) return "bg-green-500";
    if (score >= threshold.good) return "bg-yellow-500";
    if (score >= threshold.pass) return "bg-blue-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score, difficulty) => {
    const isHard = difficulty?.toLowerCase() === "hard";
    const passingScore = isHard ? 65 : 70;

    if (score >= 90)
      return `Відмінно! ${
        isHard ? "Складну задачу" : "Задачу"
      } додано до профілю 🏆`;
    if (score >= 80)
      return `Дуже добре! ${
        isHard ? "Складну задачу" : "Задачу"
      } додано до профілю 🌟`;
    if (score >= passingScore)
      return `Добре! ${
        isHard ? "Складну задачу" : "Задачу"
      } додано до профілю ✅`;
    return `Спробуйте ще раз, потрібно набрати мінімум ${passingScore}% ⚠️`;
  };

  return (
    <div className="mt-4 p-6 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-lg">Результат:</span>
          <div className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold">{score}/100</span>
            {difficulty && (
              <span
                className={`text-sm px-2 py-1 rounded ${
                  difficulty.toLowerCase() === "hard"
                    ? "bg-red-500/20 text-red-400"
                    : difficulty.toLowerCase() === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {difficulty}
              </span>
            )}
          </div>
        </div>
        <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getScoreColor(
              score,
              difficulty
            )} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
          <div
            className="absolute top-0 h-full bg-yellow-300/20"
            style={{
              left: `${difficulty?.toLowerCase() === "hard" ? "65%" : "70%"}`,
              width: "2px",
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              score >= (difficulty?.toLowerCase() === "hard" ? 65 : 70)
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getScoreMessage(score, difficulty)}
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
