import React, { useState, useEffect } from "react";
import { getTopUsers } from "../services/firebaseService";

const difficultyColors = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

export const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopUsers = async () => {
      try {
        setLoading(true);
        const topUsers = await getTopUsers(10);
        setUsers(topUsers);
      } catch (err) {
        console.error("Error loading top users:", err);
        setError("Помилка завантаження рейтингу");
      } finally {
        setLoading(false);
      }
    };

    loadTopUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Рейтинг користувачів
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-lg text-gray-300">
              Завантаження рейтингу...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Рейтинг користувачів
          </h1>
          <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="text-red-500 font-medium">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Рейтинг користувачів
        </h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Місце
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Користувач
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Легкі задачі
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Середні задачі
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Складні задачі
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Середній бал
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Загальний бал
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index < 3
                        ? "bg-white/5 hover:bg-white/10"
                        : "hover:bg-white/5"
                    } transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : index === 1
                            ? "bg-gray-500/20 text-gray-400"
                            : index === 2
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-300">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-400 font-medium">
                        {user.taskStats?.easy || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-yellow-400 font-medium">
                        {user.taskStats?.medium || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-400 font-medium">
                        {user.taskStats?.hard || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-400 font-medium">
                        {user.averageScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-purple-400 font-medium">
                        {user.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
