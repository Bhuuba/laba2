import React from "react";

export const TestResults = ({ testResults, score, loading }) => {
  if (loading) {
    return (
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Результати тестів</h3>
        <div className="p-4 rounded-lg bg-white shadow flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>Перевірка тестів...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!testResults || testResults.length === 0) return null;

  return (
    <section className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Результати тестів</h3>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm ${
              result.passed
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Тест #{index + 1}</span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  result.passed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.passed ? "Пройдено ✓" : "Не пройдено ✗"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1 font-medium">Вхідні дані:</p>
                <pre className="bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(result.input, null, 2)}
                </pre>
              </div>

              <div>
                <p className="text-gray-600 mb-1 font-medium">
                  Очікуваний результат:
                </p>
                <pre className="bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(result.expected, null, 2)}
                </pre>

                {!result.passed && (
                  <>
                    <p className="text-gray-600 mb-1 mt-2 font-medium">
                      Отриманий результат:
                    </p>
                    <pre className="bg-white p-2 rounded border overflow-x-auto">
                      {result.actual === undefined
                        ? "undefined"
                        : JSON.stringify(result.actual, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            </div>

            {result.error && (
              <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                <span className="font-medium">Помилка:</span> {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {score !== null && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-lg font-medium text-center">
            Загальний результат:
            <span
              className={`ml-2 ${
                score >= 70 ? "text-green-600" : "text-red-600"
              }`}
            >
              {score}%
            </span>
          </p>
        </div>
      )}
    </section>
  );
};
