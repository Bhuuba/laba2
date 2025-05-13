import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Функция для преобразования кодов ошибок Firebase в понятные сообщения
const getAuthErrorMessage = (error) => {
  switch (error.code) {
    // Ошибки входа
    case "auth/invalid-email":
      return "Неправильний формат електронної пошти";
    case "auth/user-disabled":
      return "Цей аккаунт було заблоковано";
    case "auth/user-not-found":
      return "Користувача з такою електронною поштою не знайдено";
    case "auth/wrong-password":
      return "Неправильний пароль";
    case "auth/invalid-login-credentials":
      return "Неправильна електронна пошта або пароль";

    // Ошибки регистрации
    case "auth/email-already-in-use":
      return "Ця електронна пошта вже використовується";
    case "auth/operation-not-allowed":
      return "Реєстрацію через email/пароль вимкнено";
    case "auth/weak-password":
      return "Пароль занадто слабкий. Використовуйте мінімум 6 символів";

    // Ошибки Google аутентификации
    case "auth/popup-closed-by-user":
      return "Ви закрили вікно авторизації Google";
    case "auth/popup-blocked":
      return "Спливаюче вікно було заблоковано браузером";
    case "auth/cancelled-popup-request":
      return "Операцію скасовано";

    // Общие ошибки
    case "auth/network-request-failed":
      return "Помилка мережі. Перевірте підключення до інтернету";
    case "auth/too-many-requests":
      return "Забагато невдалих спроб. Спробуйте пізніше";
    case "auth/internal-error":
      return "Внутрішня помилка сервера. Спробуйте пізніше";

    default:
      return `Помилка: ${error.message}`;
  }
};

// Функция для записи ошибок в лог (можно подключить сервис аналитики)
const logAuthError = (error, context) => {
  console.error(`Auth Error (${context}):`, {
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
  });
};

// Проверка валидности email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Проверка сложности пароля
const isStrongPassword = (password) => {
  if (password.length < 6) return false;
  if (!/\d/.test(password)) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
};

export const registerUser = async (email, password) => {
  // Дополнительные проверки перед регистрацией
  if (!isValidEmail(email)) {
    throw new Error("Неправильний формат електронної пошти");
  }

  if (!isStrongPassword(password)) {
    throw new Error(
      "Пароль має містити мінімум 6 символів, одну велику літеру та одну цифру"
    );
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Создаем документ пользователя с расширенной информацией
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      solvedTasks: 0,
      totalScore: 0,
      taskHistory: [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accountType: "email",
      isEmailVerified: false,
      settings: {
        preferredLanguage: "javascript",
        theme: "dark",
        notifications: true,
      },
    });

    return userCredential.user;
  } catch (error) {
    logAuthError(error, "register");
    throw new Error(getAuthErrorMessage(error));
  }
};

export const loginUser = async (email, password) => {
  if (!isValidEmail(email)) {
    throw new Error("Неправильний формат електронної пошти");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Обновляем время последнего входа
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      lastLogin: new Date().toISOString(),
    });
    return userCredential.user;
  } catch (error) {
    logAuthError(error, "login");
    throw new Error(getAuthErrorMessage(error));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// Функция для входа через Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Проверяем, существует ли документ пользователя
    const userDoc = await getDoc(doc(db, "users", user.uid));

    // Если нет, создаем новый документ
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        solvedTasks: 0,
        totalScore: 0,
        taskHistory: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        accountType: "google",
        isEmailVerified: user.emailVerified,
        settings: {
          preferredLanguage: "javascript",
          theme: "dark",
          notifications: true,
        },
      });
    } else {
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date().toISOString(),
        displayName: user.displayName, // Обновляем на случай изменения в Google
        photoURL: user.photoURL,
      });
    }

    return user;
  } catch (error) {
    logAuthError(error, "google-signin");
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signOutUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Обновляем время последнего выхода
      await updateDoc(doc(db, "users", user.uid), {
        lastLogout: new Date().toISOString(),
      });
    }
    await signOut(auth);
  } catch (error) {
    logAuthError(error, "signout");
    throw new Error("Помилка при виході з системи");
  }
};

// Функция для проверки состояния аутентификации
export const checkAuthState = (callback) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        callback({ ...user, userData: userDoc.data() });
      } catch (error) {
        logAuthError(error, "check-auth-state");
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Функции для работы со статистикой пользователя
export const getUserStats = async (userId) => {
  try {
    console.log("Getting stats for user:", userId); // Отладочный вывод
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("Got user stats:", data); // Отладочный вывод
      return data;
    }
    console.log("No user document found"); // Отладочный вывод
    return null;
  } catch (error) {
    console.error("Error in getUserStats:", error);
    throw error;
  }
};

export const updateUserStats = async (userId, taskResult) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("User document does not exist");
      return;
    }
    const userData = userDoc.data();

    // Проверяем, существует ли уже такая задача
    const existingTaskIndex = (userData.taskHistory || []).findIndex(
      (t) => t.task === taskResult.task
    );

    // Проверяем сложность задачи и нормализуем ее
    const difficulty = taskResult.difficulty?.toLowerCase() || "medium";

    const taskHistoryEntry = {
      taskId: Date.now(),
      task: taskResult.task,
      score: taskResult.score,
      solution: taskResult.solution,
      date: new Date().toISOString(),
      difficulty: difficulty,
      language: taskResult.language || "javascript",
      timeSpent: taskResult.timeSpent || null,
      title: taskResult.title || taskResult.task.split("\n")[0],
    };

    console.log("Saving task result:", taskHistoryEntry);

    // Создаем новую историю задач
    let newTaskHistory = [...(userData.taskHistory || [])];

    if (existingTaskIndex !== -1) {
      // Если задача существует и новый результат лучше, обновляем её
      if (taskResult.score > newTaskHistory[existingTaskIndex].score) {
        newTaskHistory[existingTaskIndex] = taskHistoryEntry;
      }
    } else {
      // Если задачи нет, добавляем новую
      newTaskHistory.push(taskHistoryEntry);
    }

    // Подсчитываем статистику по уровням сложности
    const taskStats = newTaskHistory.reduce(
      (acc, task) => {
        if (task.score >= 70) {
          // Учитываем только успешно решенные задачи
          acc[task.difficulty] = (acc[task.difficulty] || 0) + 1;
        }
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 }
    );

    await updateDoc(userRef, {
      solvedTasks: newTaskHistory.filter((task) => task.score >= 70).length,
      totalScore: newTaskHistory.reduce(
        (sum, task) => (task.score >= 70 ? sum + task.score : sum),
        0
      ),
      taskHistory: newTaskHistory,
      taskStats: taskStats, // Добавляем статистику по уровням сложности
      lastUpdated: new Date().toISOString(),
    });

    console.log("Successfully updated user stats");
    return taskHistoryEntry;
  } catch (error) {
    console.error("Error in updateUserStats:", error);
    throw error;
  }
};

export const getSolvedTasks = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return [];

    const userData = userDoc.data();
    return (userData.taskHistory || []).filter((task) => task.score >= 70);
  } catch (error) {
    console.error("Error getting solved tasks:", error);
    throw error;
  }
};

export const getTopUsers = async (limit = 10) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const taskStats = data.taskHistory?.reduce(
        (acc, task) => {
          acc[task.difficulty] = (acc[task.difficulty] || 0) + 1;
          return acc;
        },
        { easy: 0, medium: 0, hard: 0 }
      );

      users.push({
        id: doc.id,
        email: data.email,
        totalScore: data.totalScore || 0,
        solvedTasks: data.solvedTasks || 0,
        averageScore: data.solvedTasks
          ? (data.totalScore / data.solvedTasks).toFixed(2)
          : 0,
        taskStats,
      });
    });

    return users.sort((a, b) => b.totalScore - a.totalScore).slice(0, limit);
  } catch (error) {
    console.error("Error in getTopUsers:", error);
    throw error;
  }
};
