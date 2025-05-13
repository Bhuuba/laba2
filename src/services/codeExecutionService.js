// Функции для выполнения кода на разных языках
const executeJavaScript = async (code, testCase) => {
  try {
    // Создаем безопасную среду выполнения
    const sandbox = {
      input: testCase.input,
      console: {
        log: (...args) => console.log(...args),
      },
      result: undefined,
    };

    // Оборачиваем код пользователя для получения результата
    const wrappedCode = `
      (function(input) {
        try {
          ${code}
          // Если функция определена, вызываем её с тестовыми данными
          if (typeof solution === 'function') {
            result = solution(input);
          } else {
            // Ищем любую определенную функцию
            const definedFunctions = Object.keys(this).filter(key => 
              typeof this[key] === 'function' && 
              key !== 'solution' && 
              !['eval', 'parseInt', 'parseFloat'].includes(key)
            );
            
            if (definedFunctions.length > 0) {
              result = this[definedFunctions[0]](input);
            } else {
              throw new Error('Функція не знайдена');
            }
          }
          return result;
        } catch (e) {
          throw new Error(e.message);
        }
      }).call(Object.create(null), input);
    `;

    // Выполняем код
    const fn = new Function("input", "console", "result", wrappedCode);
    const output = fn(testCase.input, sandbox.console, undefined);

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
