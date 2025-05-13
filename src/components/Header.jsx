import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-gray-800/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-white font-bold text-xl">
            LeetGPT
          </NavLink>
          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white hover:text-gray-300 transition ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
              end
            >
              Головна
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `text-white hover:text-gray-300 transition ${
                      isActive ? "border-b-2 border-blue-500" : ""
                    }`
                  }
                >
                  Задачі
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `text-white hover:text-gray-300 transition ${
                      isActive ? "border-b-2 border-blue-500" : ""
                    }`
                  }
                >
                  Рейтинг
                </NavLink>
              </>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-gray-300 transition ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </NavLink>
          </div>
          {/* Мобильная кнопка меню */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden text-white focus:outline-none menu-button relative z-50"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>{" "}
          {/* Мобильное меню */}
          <div
            className={`mobile-menu fixed md:hidden top-0 right-0 bottom-0 w-64 bg-gray-900 backdrop-blur-none transform transition-transform duration-300 ease-in-out shadow-2xl ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full pt-20 px-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block text-lg py-3 text-white hover:text-gray-300 transition border-b border-gray-800 ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
                end
              >
                Головна
              </NavLink>

              {user && (
                <>
                  <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                      `block text-lg py-3 text-white hover:text-gray-300 transition border-b border-gray-800 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Задачі
                  </NavLink>
                  <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                      `block text-lg py-3 text-white hover:text-gray-300 transition border-b border-gray-800 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Рейтинг
                  </NavLink>
                </>
              )}

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center text-lg py-3 text-white hover:text-gray-300 transition border-b border-gray-800 ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {user ? "Профіль" : "Увійти"}
              </NavLink>
            </div>
          </div>
          {/* Затемнение фона при открытом меню */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </nav>
    </header>
  );
};
