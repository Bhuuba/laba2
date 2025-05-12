const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function callOpenAI(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("⏺ OpenAI error payload:", JSON.stringify(data, null, 2));
    throw new Error(data.error?.message || `HTTP ${response.status}`);
  }
  return data;
}

export const generateTask = async (difficulty, language, history = []) => {
  try {
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Ти досвідчений розробник, який створює унікальні задачі з програмування.
Важливо: кожна нова задача повинна бути унікальною і не повторюватись з попередніми.
Використовуй різні теми та підходи при створенні задач.`,
        },
        {
          role: "user",
          content: `Створи УНІКАЛЬНУ задачу рівня складності "${difficulty}" мовою ${language}.
Формат відповіді має бути JSON з полями:
- task: текст задачі
- tests: масив тестів (input та expected)
- template: початковий код для розв'язання

Ось список попередніх задач, НЕ ПОВТОРЮЙ їх:
${history.join("\n---\n")}

Створи щось ПОВНІСТЮ НОВЕ, що не схоже на попередні задачі.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    };

    const data = await callOpenAI(payload);
    let raw = data.choices[0].message.content;

    if (raw.trim().startsWith("```")) {
      raw = raw.replace(/^```[^\n]*\n/, "").replace(/\n```$/, "");
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed.task !== "string" ||
      !Array.isArray(parsed.tests)
    ) {
      throw new Error("Некоректний формат JSON у відповіді OpenAI");
    }

    return parsed;
  } catch (err) {
    console.error("Error in generateTask:", err);
    throw err;
  }
};

export const evaluateTask = async (task, solution) => {
  try {
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Ты опытный проверяющий программного кода. Оцени решение задачи по следующим критериям:
- Корректность решения
- Эффективность алгоритма
- Качество кода
- Обработка крайних случаев
Дай оценку от 1 до 100.`,
        },
        {
          role: "user",
          content: `Задача:
${task}

Решение:
${solution}

Оцени это решение и верни ответ в формате JSON:
{
  "score": число от 1 до 100,
  "feedback": "детальный отзыв о решении"
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const data = await callOpenAI(payload);
    let raw = data.choices[0].message.content;

    if (raw.trim().startsWith("```")) {
      raw = raw.replace(/^```[^\n]*\n/, "").replace(/\n```$/, "");
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed.score !== "number" ||
      typeof parsed.feedback !== "string"
    ) {
      throw new Error("Некорректный формат JSON в ответе OpenAI");
    }

    return parsed;
  } catch (err) {
    console.error("Error in evaluateTask:", err);
    throw err;
  }
};
