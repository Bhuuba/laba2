import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
  apiKey: "AIzaSyBPplqOx2lBKKoQunjtPK8YGsA45p67NM4",
  authDomain: "laba2-cd111.firebaseapp.com",
  projectId: "laba2-cd111",
  storageBucket: "laba2-cd111.firebasestorage.app",
  messagingSenderId: "308279430669",
  appId: "1:308279430669:web:4e768d86e2b9427e258f44",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Создаем начальный документ пользователя
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      solvedTasks: 0,
      totalScore: 0,
      taskHistory: [],
    });
    return userCredential.user;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
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

    const taskHistoryEntry = {
      taskId: Date.now(),
      task: taskResult.task,
      score: taskResult.score,
      solution: taskResult.solution,
      date: new Date().toISOString(),
      difficulty: taskResult.difficulty || "medium",
      language: taskResult.language || "javascript",
      timeSpent: taskResult.timeSpent || null,
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

    await updateDoc(userRef, {
      solvedTasks: newTaskHistory.filter((task) => task.score >= 70).length,
      totalScore: newTaskHistory.reduce(
        (sum, task) => (task.score >= 70 ? sum + task.score : sum),
        0
      ),
      taskHistory: newTaskHistory,
    });

    console.log("Successfully updated user stats"); // Отладочный вывод
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
