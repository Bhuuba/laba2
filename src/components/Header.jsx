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
    <>
      <header className="relative w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sm:fixed sm:top-0 sm:left-0 sm:right-0 z-20">
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-white p-2 focus:outline-none z-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30">
          <div className="fixed right-0 top-0 h-full w-64 bg-gray-900 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-lg ${
                    isActive ? "text-blue-400" : "text-white"
                  } hover:text-blue-400`
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
                      `text-lg ${
                        isActive ? "text-blue-400" : "text-white"
                      } hover:text-blue-400`
                    }
                    onClick={closeMenu}
                  >
                    Задачі
                  </NavLink>
                  <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                      `text-lg ${
                        isActive ? "text-blue-400" : "text-white"
                      } hover:text-blue-400`
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
                  `text-lg flex items-center ${
                    isActive ? "text-blue-400" : "text-white"
                  } hover:text-blue-400`
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
      )}
    </>
  );
};
