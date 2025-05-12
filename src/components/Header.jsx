import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-xl">LeetGPT</div>
          <div className="flex space-x-6">
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
                `text-white hover:text-gray-300 transition ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              {user ? user.email : "Увійти"}
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
