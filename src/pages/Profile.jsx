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

  if (!user) {
    return <AuthForm />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Фильтруем задачи с результатом >= 70%
  const solvedTasks = (stats.taskHistory || []).filter(
    (task) => task.score >= 70
  );
  const averageScore =
    solvedTasks.length > 0
      ? Math.round(
          solvedTasks.reduce((acc, task) => acc + task.score, 0) /
            solvedTasks.length
        )
      : 0;

  // Пагинация для отфильтрованных задач
  const totalPages = Math.ceil(solvedTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const currentTasks = solvedTasks
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, startIndex + TASKS_PER_PAGE);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{user.email}</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Вийти
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Успішно вирішено</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {solvedTasks.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  задач з результатом ≥70%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Середній бал</h3>
                <p className="text-3xl font-bold text-green-600">
                  {averageScore}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  для успішних рішень
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Загальний бал</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {solvedTasks.reduce((acc, task) => acc + task.score, 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  сума всіх успішних спроб
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Історія успішно виконаних задач (70% і вище)
              </h3>
              {currentTasks.length > 0 ? (
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="bg-white shadow-sm p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {task.task}
                          </h4>
                          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                            <span className="inline-flex items-center bg-gray-100 px-2.5 py-0.5 rounded-full">
                              {new Date(task.date).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center bg-gray-100 px-2.5 py-0.5 rounded-full">
                              Складність: {task.difficulty}
                            </span>
                            {task.language && (
                              <span className="inline-flex items-center bg-gray-100 px-2.5 py-0.5 rounded-full">
                                {task.language}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`text-lg font-semibold px-4 py-2 rounded-full ${
                              task.score >= 90
                                ? "bg-green-100 text-green-800"
                                : task.score >= 80
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.score}%
                          </span>
                        </div>
                      </div>
                      {task.solution && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Ваше рішення:
                          </p>
                          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                            {task.solution}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    У вас ще немає успішно вирішених задач. Спробуйте вирішити
                    задачу з результатом більше 70%!
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
