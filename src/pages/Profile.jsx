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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-6 py-12">
        {!user ? (
          <AuthForm />
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Ваш профіль
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                >
                  Вийти
                </button>
              </div>

              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Загальний бал</h3>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalScore}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Вирішено задач</h3>
                    <p className="text-3xl font-bold text-purple-400">{stats.solvedTasks}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Середній бал</h3>
                    <p className="text-3xl font-bold text-green-400">
                      {stats.solvedTasks ? (stats.totalScore / stats.solvedTasks).toFixed(1) : 0}
                    </p>
                  </div>
                </div>
              )}

              {stats?.taskHistory?.length > 0 ? (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Історія розв'язаних задач</h2>
                  <div className="space-y-4">
                    {stats.taskHistory
                      .slice((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE)
                      .map((task, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-4 transform hover:translate-x-2 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-white mb-1">
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-4">
                                <span className={`text-sm px-3 py-1 rounded-full ${
                                  task.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                  task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  Оцінка: {task.score}%
                                </span>
                              </div>
                            </div>
                            <span className="text-blue-400">→</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {stats.taskHistory.length > TASKS_PER_PAGE && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(stats.taskHistory.length / TASKS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 text-center">
                  <p className="text-gray-400 text-lg">
                    Ви ще не розв'язали жодної задачі. Почніть свою подорож зараз!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
