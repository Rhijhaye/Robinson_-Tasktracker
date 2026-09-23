import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './firebase';

const tasksCollection = collection(db, 'tasks');

// CREATE: Add a new task
export async function createTask(userId, taskData) {
  return await addDoc(tasksCollection, {
    ...taskData,
    userId,
    completed: false,
    createdAt: serverTimestamp()
  });
}

// READ: Retrieve tasks belonging to the user
export async function getUserTasks(userId) {
  const taskQuery = query(
    tasksCollection,
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(taskQuery);

  return snapshot.docs.map(task => ({
    id: task.id,
    ...task.data()
  }));
}

// UPDATE: Modify an existing task
export async function updateTask(taskId, updates) {
  const taskReference = doc(db, 'tasks', taskId);

  await updateDoc(taskReference, updates);
}

// DELETE: Remove a task
export async function deleteTask(taskId) {
  const taskReference = doc(db, 'tasks', taskId);

  await deleteDoc(taskReference);
}