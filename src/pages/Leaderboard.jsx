import React from "react";

export const Leaderboard = () => {
  // Заглушка данных для таблицы рейтинга
  const mockUsers = [
    { id: 1, username: "CoderPro", solvedTasks: 45, averageScore: 92 },
    { id: 2, username: "AlgoMaster", solvedTasks: 38, averageScore: 88 },
    { id: 3, username: "BugHunter", solvedTasks: 32, averageScore: 85 },
    { id: 4, username: "CodeNinja", solvedTasks: 29, averageScore: 83 },
    { id: 5, username: "DevGuru", solvedTasks: 25, averageScore: 80 },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Рейтинг користувачів</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Місце
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Користувач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Вирішено задач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Середній бал
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.solvedTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.averageScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
