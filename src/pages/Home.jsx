import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-6">Ласкаво просимо до LeetGPT</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Про платформу</h2>
        <p className="text-gray-700 mb-4">
          LeetGPT - це інноваційна платформа для вивчення програмування, яка
          поєднує в собі:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li>Унікальні задачі, згенеровані штучним інтелектом</li>
          <li>Миттєвий зворотний зв'язок з аналізом вашого коду</li>
          <li>Детальну оцінку рішень з рекомендаціями щодо покращення</li>
          <li>Різні рівні складності для поступового розвитку</li>
        </ul>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">
              Почніть вже сьогодні!
            </h3>
            <p className="text-blue-600 mb-4">
              Для доступу до всіх можливостей платформи, будь ласка, увійдіть
              або зареєструйтеся.
            </p>
            <Link
              to="/profile"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Увійти / Зареєструватися
            </Link>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-3">Як це працює?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">1. Вибір задачі</h4>
            <p className="text-gray-600">
              Оберіть задачу відповідного рівня складності
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">2. Рішення</h4>
            <p className="text-gray-600">
              Напишіть своє рішення в онлайн-редакторі
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">3. Оцінка</h4>
            <p className="text-gray-600">
              Отримайте детальний аналіз вашого коду
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
