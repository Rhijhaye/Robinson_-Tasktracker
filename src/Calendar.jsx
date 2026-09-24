import { useState } from 'react';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function TaskCalendar({
  tasks,
  onBack,
  onAddTask,
  onToggleComplete
}) {
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  // Convert a date to YYYY-MM-DD using local time.
  function formatDate(date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const selectedDateString = formatDate(selectedDate);

  // Find tasks scheduled for the selected date.
  const selectedTasks = tasks.filter(
    task => task.dueDate === selectedDateString
  );

  // Count tasks scheduled for a particular date.
  function getTaskCount(date) {
    const dateString = formatDate(date);

    return tasks.filter(
      task => task.dueDate === dateString
    ).length;
  }

  return (
    <main className="container">

      <section className="panel">

        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <h1>Task Calendar</h1>

        <p>
          Select a date to view your scheduled tasks.
        </p>

      </section>

      <section className="panel calendar-panel">

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          calendarType="gregory"
          tileContent={({ date, view }) => {
            if (view !== 'month') {
              return null;
            }

            const count = getTaskCount(date);

            return count > 0 ? (
              <div className="calendar-task-indicator">
                {count} {count === 1 ? 'task' : 'tasks'}
              </div>
            ) : null;
          }}
        />

      </section>

      <section className="panel">

        <h2>
          Tasks for{' '}
          {selectedDate.toLocaleDateString(
            'en-US',
            {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }
          )}
        </h2>

        <button
          type="button"
          className="primary-btn"
          onClick={() => onAddTask(selectedDateString)}
        >
          + Add Task for This Date
        </button>

        <div className="calendar-task-list">

          {selectedTasks.length === 0 ? (

            <p className="empty">
              No tasks scheduled for this date.
            </p>

          ) : (

            selectedTasks.map(task => (

              <article
                key={task.id}
                className={`task-card ${
                  task.completed ? 'done' : ''
                }`}
              >

                <div className="task-info">

                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <div className="task-meta">

                    <span
                      className={`priority ${
                        (task.priority || 'Medium')
                          .toLowerCase()
                      }`}
                    >
                      {task.priority || 'Medium'} Priority
                    </span>

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
                    onClick={() =>
                      onToggleComplete(task.id)
                    }
                  >
                    {task.completed
                      ? 'Undo'
                      : 'Complete'}
                  </button>

                </div>

              </article>

            ))

          )}

        </div>

      </section>

    </main>
  );
}

export default TaskCalendar;