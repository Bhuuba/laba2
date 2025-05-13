// Список запрещенных глобальных объектов и функций
const RESTRICTED_GLOBALS = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "eval",
  "Function",
  "require",
  "import",
  "process",
  "window",
  "document",
];

const createSecureSandbox = () => {
  // Создаем безопасную среду выполнения
  const sandbox = {
    console: {
      log: (...args) => console.log(...args),
    },
    // Добавляем только безопасные глобальные объекты
    Math: Math,
    Date: Date,
    Array: Array,
    String: String,
    Number: Number,
    Object: Object,
    RegExp: RegExp,
    Error: Error,
    JSON: JSON,
    Promise: Promise,
  };

  // Запрещаем доступ к прототипам
  Object.keys(sandbox).forEach((key) => {
    if (sandbox[key] && typeof sandbox[key] === "object") {
      Object.freeze(sandbox[key]);
    }
  });

  return sandbox;
};

// Функции для выполнения кода на разных языках
const executeJavaScript = async (code, testCase) => {
  try {
    // Проверяем код на наличие запрещенных конструкций
    RESTRICTED_GLOBALS.forEach((restricted) => {
      if (code.includes(restricted)) {
        throw new Error(`Заборонено використовувати '${restricted}'`);
      }
    });

    const sandbox = createSecureSandbox();
    sandbox.input = testCase.input;

    // Оборачиваем код пользователя для получения результата
    const wrappedCode = `
      'use strict';
      (function(input) {
        try {
          ${code}
          if (typeof solution === 'function') {
            return solution(input);
          }
          const definedFunctions = Object.keys(this).filter(key => 
            typeof this[key] === 'function' && 
            key !== 'solution' && 
            !['eval', 'parseInt', 'parseFloat'].includes(key)
          );
          
          if (definedFunctions.length > 0) {
            return this[definedFunctions[0]](input);
          }
          throw new Error('Функція не знайдена');
        } catch (e) {
          throw new Error(e.message);
        }
      }).call(Object.create(null), input);
    `;

    // Выполняем код в безопасной среде
    const fn = new Function(...Object.keys(sandbox), wrappedCode);
    const output = fn(...Object.values(sandbox));

    return {
      success: true,
      output: output,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const executePython = async (code, testCase) => {
  try {
    const inputData = JSON.stringify(testCase.input);
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    // Подготавливаем код Python
    const pythonCode = `
# Input data
input_data = ${inputData}

# User code
${code}

# Execute the solution
try:
    # Try to find the main function
    if 'solution' in locals():
        result = solution(input_data)
    else:
        # Find any defined function
        defined_functions = [f for f in locals() if callable(locals()[f]) and not f.startswith('__')]
        if defined_functions:
            result = locals()[defined_functions[0]](input_data)
        else:
            raise NameError("Function not found")
    
    print({"success": True, "output": result})
except Exception as e:
    print({"success": False, "error": str(e)})
`;

    // Используем GPT для эмуляции выполнения Python кода
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              'You are a Python interpreter. Execute the code and return only valid JSON output in the format {"success": boolean, "output": any, "error": string}. No additional text.',
          },
          {
            role: "user",
            content: pythonCode,
          },
        ],
        temperature: 0,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content.trim());
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const executeCpp = async (code, testCase) => {
  try {
    const inputData = JSON.stringify(testCase.input);
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    // Подготавливаем код C++
    const cppCode = `
#include <iostream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

${code}

int main() {
    try {
        // Parse input
        json input = json::parse(R"(${inputData})");
        
        // Find and execute the solution function
        auto result = solution(input.get<decltype(input)>());
        
        // Output result
        json output = {
            {"success", true},
            {"output", result}
        };
        std::cout << output.dump() << std::endl;
        return 0;
    } catch (const std::exception& e) {
        json error = {
            {"success", false},
            {"error", e.what()}
        };
        std::cout << error.dump() << std::endl;
        return 1;
    }
}`;

    // Используем GPT для эмуляции выполнения C++ кода
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'You are a C++ compiler and runtime. Execute the code and return only valid JSON output in the format {"success": boolean, "output": any, "error": string}. No additional text.',
          },
          {
            role: "user",
            content: cppCode,
          },
        ],
        temperature: 0,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content.trim());
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const executeCode = async (code, language, testCase) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return executeJavaScript(code, testCase);
    case "python":
      return executePython(code, testCase);
    case "c++":
      return executeCpp(code, testCase);
    default:
      throw new Error("Непідтримувана мова програмування: " + language);
  }
};
