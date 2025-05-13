import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          currentPage === 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-gray-200 hover:bg-gray-700"
        }`}
      >
        Назад
      </button>

      <div className="flex items-center space-x-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => onPageChange(idx + 1)}
            className={`w-10 h-10 rounded-lg transition-all duration-300 ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-gray-200 hover:bg-gray-700"
        }`}
      >
        Вперед
      </button>
    </div>
  );
};
