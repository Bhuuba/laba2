import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  logoutUser,
  getUserStats,
} from "../services/firebaseService";
import { AuthForm } from "../components/AuthForm";
import { Pagination } from "../components/Pagination";

const TASKS_PER_PAGE = 3;

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadStats = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const userStats = await getUserStats(currentUser.uid);
          console.log("Loaded user stats:", userStats);
          setStats(
            userStats || { solvedTasks: 0, totalScore: 0, taskHistory: [] }
          );
        } catch (err) {
          console.error("Error loading stats:", err);
          setError("Помилка завантаження статистики");
        }
      }
      setLoading(false);
    };

    checkAuthAndLoadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Помилка при виході:", error);
      setError("Помилка при виході з системи");
    }
  };

  const toggleTask = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getTaskTitle = (task) => {
    if (task.title) return task.title;
    return task.task.split("\n")[0].replace(/`/g, "");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!user ? (
          <AuthForm />
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Ваш профіль
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto bg-red-500/10 text-red-500 px-4 sm:px-6 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                >
                  Вийти
                </button>
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-300">
                    Загальний бал
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {stats.totalScore}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-300">
                    Вирішено задач
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                    {stats.solvedTasks}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-300">
                    Середній бал
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    {stats.solvedTasks
                      ? (stats.totalScore / stats.solvedTasks).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            )}

            {stats?.taskHistory?.length > 0 ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">
                  Історія розв'язаних задач
                </h2>
                <div className="space-y-4">
                  {stats.taskHistory
                    .slice(
                      (currentPage - 1) * TASKS_PER_PAGE,
                      currentPage * TASKS_PER_PAGE
                    )
                    .map((task) => (
                      <div
                        key={task.taskId}
                        className="bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gray-700/50"
                          onClick={() => toggleTask(task.taskId)}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                                <span
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${
                                    task.difficulty === "easy"
                                      ? "bg-green-500/20 text-green-400"
                                      : task.difficulty === "medium"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {task.difficulty}
                                </span>
                                <span className="text-blue-400 text-xs sm:text-sm">
                                  Оцінка: {task.score}%
                                </span>
                                <span className="text-gray-400 text-xs sm:text-sm">
                                  {new Date(task.date).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-medium text-white">
                                {getTaskTitle(task)}
                              </h3>
                            </div>
                            <span
                              className={`transform transition-transform duration-300 text-blue-400 text-lg sm:text-xl ${
                                expandedTaskId === task.taskId
                                  ? "rotate-90"
                                  : ""
                              }`}
                            >
                              →
                            </span>
                          </div>
                        </div>

                        {expandedTaskId === task.taskId && (
                          <div className="p-4 border-t border-gray-700 bg-gray-800/30">
                            <div className="mb-4">
                              <h4 className="text-gray-300 font-medium mb-2">
                                Повний опис:
                              </h4>
                              <pre className="whitespace-pre-wrap text-sm sm:text-base text-gray-200 bg-gray-900/50 p-3 sm:p-4 rounded-lg overflow-x-auto">
                                {task.task}
                              </pre>
                            </div>
                            <div>
                              <h4 className="text-gray-300 font-medium mb-2">
                                Рішення:
                              </h4>
                              <pre className="whitespace-pre-wrap text-sm sm:text-base text-gray-200 bg-gray-900/50 p-3 sm:p-4 rounded-lg overflow-x-auto font-mono">
                                {task.solution}
                              </pre>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                              <span>Мова: {task.language}</span>
                              {task.timeSpent && (
                                <span>Час виконання: {task.timeSpent} хв.</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {stats.taskHistory.length > TASKS_PER_PAGE && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(
                        stats.taskHistory.length / TASKS_PER_PAGE
                      )}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-8 text-center">
                <p className="text-base sm:text-lg text-gray-400">
                  Ви ще не розв'язали жодної задачі. Почніть свою подорож зараз!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
