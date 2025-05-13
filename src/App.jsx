import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Leaderboard } from "./pages/Leaderboard";
import TaskPage from "./pages/TaskPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <Header />
          <div className="sm:pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TaskPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
