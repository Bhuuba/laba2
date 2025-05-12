import React from "react";

export const Profile = () => {
  // Заглушка данных профиля
  const mockProfile = {
    username: "UserName",
    solvedTasks: 15,
    averageScore: 85,
    recentActivities: [
      { id: 1, task: "Сортировка массива", score: 90, date: "2025-05-11" },
      { id: 2, task: "Поиск подстроки", score: 85, date: "2025-05-10" },
      { id: 3, task: "Fibonacci", score: 95, date: "2025-05-09" },
    ],
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-6">
            <h1 className="text-3xl font-bold">{mockProfile.username}</h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Вирішено задач</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {mockProfile.solvedTasks}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Середній бал</h3>
                <p className="text-3xl font-bold text-green-600">
                  {mockProfile.averageScore}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Остання активність</h3>
              <div className="space-y-4">
                {mockProfile.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{activity.task}</h4>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-semibold ${
                          activity.score >= 90
                            ? "text-green-600"
                            : activity.score >= 80
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {activity.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
