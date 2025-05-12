import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Ласкаво просимо до LeetGPT
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Інноваційна платформа для вивчення програмування з використанням
            штучного інтелекту
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="text-blue-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Унікальні задачі
            </h3>
            <p className="text-gray-400">
              Завдання, згенеровані штучним інтелектом для максимальної
              ефективності навчання
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="text-purple-400 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Миттєвий фідбек
            </h3>
            <p className="text-gray-400">
              Отримуйте детальний аналіз вашого коду в реальному часі
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="text-green-400 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Прогрес</h3>
            <p className="text-gray-400">
              Відслідковуйте свій прогрес та покращуйте навички
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <div className="text-yellow-400 text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Досягнення
            </h3>
            <p className="text-gray-400">
              Змагайтеся з іншими та отримуйте нагороди
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-white">
                Почніть свою подорож вже сьогодні!
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Приєднуйтесь до спільноти розробників та покращуйте свої навички
                програмування.
              </p>
              <Link
                to="/profile"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
              >
                Увійти / Зареєструватися
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur"></div>
          </div>
        )}

        {/* How it Works Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8">
          <h3 className="text-3xl font-bold mb-8 text-center text-white">
            Як це працює?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 p-6 rounded-xl z-10 transform group-hover:translate-y-[-5px] transition-all duration-300">
                <div className="text-3xl mb-4">1</div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Вибір задачі
                </h4>
                <p className="text-gray-400">
                  Оберіть задачу відповідного рівня складності з нашої бази
                  завдань
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 p-6 rounded-xl z-10 transform group-hover:translate-y-[-5px] transition-all duration-300">
                <div className="text-3xl mb-4">2</div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Написання коду
                </h4>
                <p className="text-gray-400">
                  Реалізуйте своє рішення в сучасному онлайн-редакторі коду
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 p-6 rounded-xl z-10 transform group-hover:translate-y-[-5px] transition-all duration-300">
                <div className="text-3xl mb-4">3</div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Отримання результату
                </h4>
                <p className="text-gray-400">
                  Отримайте миттєвий фідбек та рекомендації щодо покращення коду
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
