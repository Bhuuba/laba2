import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Назад
      </button>

      <div className="flex items-center space-x-1">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => onPageChange(idx + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === idx + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Вперед
      </button>
    </div>
  );
};
