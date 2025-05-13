import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`
        w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800
        sm:fixed sm:top-0 sm:left-0 sm:right-0 z-50
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 h-16">
        <div className="flex items-center justify-between h-full">
          <NavLink
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
          >
            LeetGPT
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-white hover:text-gray-300 transition ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
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
                `text-white hover:text-gray-300 transition ${
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

          {/* Burger Icon */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white focus:outline-none z-50"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
            ></div>
          )}

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-[#0a0f1c] z-50 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full p-6 space-y-4 pt-20">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-white text-lg hover:text-blue-400 ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Головна
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                      `text-white text-lg hover:text-blue-400 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Задачі
                  </NavLink>
                  <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                      `text-white text-lg hover:text-blue-400 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Рейтинг
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-white text-lg flex items-center hover:text-blue-400 ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
                onClick={closeMenu}
              >
                <svg
                  className="w-5 h-5 mr-2"
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
        </div>
      </nav>
    </header>
  );
};
