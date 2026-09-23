import { useEffect, useState } from 'react';

import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import { auth } from './firebase';
import Auth from './Auth';

import './App.css';
function App() {
   const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Unable to log out. Please try again.');
    }
  }
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  function saveTasks(updatedTasks) {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    if (editingId !== null) {
      saveTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, title, description, priority, dueDate }
          : task
      ));
      setEditingId(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        priority,
        dueDate,
        completed: false
      };

      saveTasks([...tasks, newTask]);
    }

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
  }

  function toggleComplete(id) {
    saveTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  }

  function deleteTask(id) {
    saveTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) cancelEdit();
  }

  function editTask(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
  }

   const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;

  if (authLoading) {
    return <p className="loading">Loading Task Tracker...</p>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header className="header">
  <h1>Task Tracker</h1>
  <p>Organize your tasks. Track your progress.</p>

  <div className="user-info">
    <span>Signed in as: {user.email}</span>

    <button
      type="button"
      onClick={handleLogout}
      className="logout-btn"
    >
      Log Out
    </button>
  </div>
</header>

      <main className="container">
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

        <section className="panel">
          <h2>{editingId !== null ? 'Edit Task' : 'Add New Task'}</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="form-row">
              <div>
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="primary-btn">
                {editingId !== null ? 'Save Changes' : 'Add Task'}
              </button>

              {editingId !== null && (
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>My Tasks</h2>

          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task above!</p>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <article
                  key={task.id}
                  className={`task-card ${task.completed ? 'done' : ''}`}
                >
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="task-meta">
                      <span className={`priority ${task.priority.toLowerCase()}`}>
                        {task.priority} Priority
                      </span>
                      {task.dueDate && (
                        <span>Due: {task.dueDate}</span>
                      )}
                      <span>{task.completed ? 'Completed' : 'Pending'}</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => toggleComplete(task.id)}>
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => editTask(task)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
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