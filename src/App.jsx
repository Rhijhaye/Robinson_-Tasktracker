import { useEffect, useState } from 'react';

import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import { auth } from './firebase';
import Auth from './Auth';

import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask
} from './taskService';

import './App.css';

function App() {

  // Firebase Authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Task data
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);
  const [taskError, setTaskError] = useState('');

  // Task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Listen for Firebase authentication changes
  useEffect(() => {
    let active = true;
    let requestId = 0;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        const currentRequest = ++requestId;

        setUser(currentUser);
        setTasks([]);
        setTaskError('');
        setEditingId(null);
        setAuthLoading(false);

        if (!currentUser) {
          setTasksLoading(false);
          return;
        }

        setTasksLoading(true);

        try {
          const userTasks = await getUserTasks(currentUser.uid);

          if (
            active &&
            currentRequest === requestId &&
            auth.currentUser?.uid === currentUser.uid
          ) {
            setTasks(userTasks);
          }

        } catch (error) {
          console.error('Error loading tasks:', error);

          if (active && currentRequest === requestId) {
            setTaskError('Unable to load your tasks.');
          }

        } finally {
          if (active && currentRequest === requestId) {
            setTasksLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Log out
  async function handleLogout() {
    if (taskSaving) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      setTaskError('Unable to log out. Please try again.');
    }
  }

  // Reset task form
  function resetForm() {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setEditingId(null);
  }

  // Refresh tasks from Firestore
  async function refreshTasks() {
    if (!user) return;

    const userTasks = await getUserTasks(user.uid);

    if (auth.currentUser?.uid === user.uid) {
      setTasks(userTasks);
    }
  }

  // CREATE and UPDATE tasks
  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !user || taskSaving || tasksLoading) {
      return;
    }

    setTaskSaving(true);
    setTaskError('');

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate
      };

      if (editingId !== null) {
        await updateTask(editingId, taskData);
      } else {
        await createTask(user.uid, taskData);
      }

      await refreshTasks();
      resetForm();

    } catch (error) {
      console.error('Error saving task:', error);
      setTaskError('Unable to save your task. Please try again.');

    } finally {
      setTaskSaving(false);
    }
  }

  // Mark task as completed or pending
  async function toggleComplete(id) {
    if (!user || taskSaving || tasksLoading) return;

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    setTaskSaving(true);
    setTaskError('');

    try {
      await updateTask(id, {
        completed: !task.completed
      });

      await refreshTasks();

    } catch (error) {
      console.error('Error updating task:', error);
      setTaskError('Unable to update task status.');

    } finally {
      setTaskSaving(false);
    }
  }

  // DELETE task
  async function handleDeleteTask(id) {
    if (!user || taskSaving || tasksLoading) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) return;

    setTaskSaving(true);
    setTaskError('');

    try {
      await deleteTask(id);
      await refreshTasks();

      if (editingId === id) {
        resetForm();
      }

    } catch (error) {
      console.error('Error deleting task:', error);
      setTaskError('Unable to delete the task.');

    } finally {
      setTaskSaving(false);
    }
  }

  // Load a task into the edit form
  function editTask(task) {
    if (taskSaving || tasksLoading) return;

    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate || '');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Cancel editing
  function cancelEdit() {
    resetForm();
  }

  // Dashboard statistics
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;

  // Authentication loading screen
  if (authLoading) {
    return (
      <p className="loading">
        Loading Task Tracker...
      </p>
    );
  }

  // Show login/registration page
  if (!user) {
    return <Auth />;
  }

  // Main dashboard
  return (
    <div className="app">

      <header className="header">
        <h1>Task Tracker</h1>

        <p>Organize your tasks. Track your progress.</p>

        <div className="user-info">
          <span>Signed in as: {user.email}</span>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            disabled={taskSaving}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="container">

        {/* Dashboard statistics */}
        <section className="stats">

          <div className="stat-card">
            <h2>{tasks.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h2>{pending}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h2>{completed}</h2>
            <p>Completed</p>
          </div>

        </section>

        {/* Task form */}
        <section className="panel">

          <h2>
            {editingId !== null
              ? 'Edit Task'
              : 'Add New Task'}
          </h2>

          <form onSubmit={handleSubmit}>

            <label htmlFor="title">
              Task Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={taskSaving || tasksLoading}
              required
            />

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              disabled={taskSaving || tasksLoading}
            />

            <div className="form-row">

              <div>
                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={event => setPriority(event.target.value)}
                  disabled={taskSaving || tasksLoading}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate">
                  Due Date
                </label>

                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={event => setDueDate(event.target.value)}
                  disabled={taskSaving || tasksLoading}
                />
              </div>

            </div>

            <div className="actions">

              <button
                type="submit"
                className="primary-btn"
                disabled={taskSaving || tasksLoading}
              >
                {taskSaving
                  ? 'Saving...'
                  : editingId !== null
                    ? 'Save Changes'
                    : 'Add Task'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={taskSaving}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* Task list */}
        <section className="panel">

          <h2>My Tasks</h2>

          {tasksLoading && (
            <p>Loading your tasks...</p>
          )}

          {taskError && (
            <p className="auth-error" role="alert">
              {taskError}
            </p>
          )}

          {!tasksLoading && tasks.length === 0 ? (
            <p className="empty">
              {taskError
                ? 'Your tasks could not be loaded.'
                : 'No tasks yet. Add your first task above!'}
            </p>
          ) : (
            <div className="task-list">

              {tasks.map(task => (

                <article
                  key={task.id}
                  className={`task-card ${
                    task.completed ? 'done' : ''
                  }`}
                >

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    <p>{task.description}</p>

                    <div className="task-meta">

                      <span
                        className={`priority ${
                          task.priority.toLowerCase()
                        }`}
                      >
                        {task.priority} Priority
                      </span>

                      {task.dueDate && (
                        <span>
                          Due: {task.dueDate}
                        </span>
                      )}

                      <span>
                        {task.completed
                          ? 'Completed'
                          : 'Pending'}
                      </span>

                    </div>

                  </div>

                  <div className="task-actions">

                    <button
                      type="button"
                      onClick={() => toggleComplete(task.id)}
                      disabled={taskSaving || tasksLoading}
                    >
                      {task.completed
                        ? 'Undo'
                        : 'Complete'}
                    </button>

                    <button
                      type="button"
                      onClick={() => editTask(task)}
                      disabled={taskSaving || tasksLoading}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={taskSaving || tasksLoading}
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;