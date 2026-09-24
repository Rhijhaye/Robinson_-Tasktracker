# Robinson Task Tracker

## Project Overview

Robinson Task Tracker is a web-based task management application developed as an individual project for the AI Hootcamp assignment.

The application allows users to organize their daily responsibilities, manage deadlines, and track their progress through a personalized dashboard and interactive calendar.

The project was developed using AI-assisted development tools, React, and Firebase.

## Features

### User Authentication
- Register for a new account using a username, email, and password.
- Log in and log out securely using Firebase Authentication.
- Recover account access using the forgot-password feature.
- Access personal tasks through an authenticated account.

### Task Management
- Create new tasks with a title, description, priority, and due date.
- View all saved tasks on the dashboard.
- Edit existing tasks.
- Mark tasks as completed or pending.
- Delete tasks that are no longer needed.
- Store and retrieve task information using Firebase Firestore.

### Dashboard
- Personalized welcome message displaying the user's username.
- Total task counter.
- Pending task counter.
- Completed task counter.
- Task creation and management interface.

### Interactive Calendar
- Navigate between months and select specific dates.
- View tasks scheduled for a selected date.
- Display the number of tasks assigned to each date.
- Create tasks directly from the calendar.
- Mark tasks as completed or pending from the calendar.

### Profile & Settings
- View account information.
- Update the account username.
- Change the account password.
- Request a password-reset email.
- Switch between light and dark mode.
- Save the selected theme preference in browser storage.

## Technologies Used

| Technology | Purpose |
|------------|---------|
| React | Frontend user interface |
| JavaScript | Application functionality |
| HTML & CSS | Page structure and styling |
| Vite | Development server and production build |
| Firebase Authentication | User registration, login, and account management |
| Firebase Firestore | Cloud database for task storage |
| React Calendar | Interactive calendar functionality |
| Git & GitHub | Version control and project repository |
| GitHub Codespaces | Cloud-based development environment |
| Netlify | Application hosting and deployment |

## AI-Assisted Development

This application was developed using AI-assisted software development techniques introduced in the AI Hootcamp lectures.

ChatGPT was used to assist with:

- Planning the application's features and structure.
- Generating React components and CSS styling.
- Integrating Firebase Authentication and Firestore.
- Implementing task management functionality.
- Developing the interactive calendar.
- Troubleshooting development errors.
- Providing guidance for GitHub version control and deployment preparation.

The application was developed and tested individually using GitHub Codespaces.

## Database Structure

The application uses Firebase Cloud Firestore to store task information.

### Tasks Collection

Each task document contains information such as:

| Field | Description |
|-------|-------------|
| title | Task title |
| description | Additional task details |
| priority | Low, Medium, or High |
| dueDate | Scheduled completion date |
| completed | Task completion status |
| userId | Firebase Authentication user ID |

Task records are associated with the authenticated user's account.

Firebase Authentication manages user credentials and account information.

## Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A Firebase project
- A GitHub Codespace or another development environment

### 1. Clone the Repository

```bash
git clone https://github.com/Rhijhaye/Robinson_-Tasktracker.git
```

### 2. Open the Project Directory

```bash
cd Robinson_-Tasktracker
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env.local` file in the project's root directory.

Add the following environment variables using the configuration values from your Firebase project:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Enable Email/Password authentication in Firebase Authentication.

Create a Cloud Firestore database and configure its security rules to restrict access to authorized users and their own task records.

### 5. Start the Development Server

```bash
npm run dev
```

Open the development server URL displayed in the terminal.

### 6. Create a Production Build

```bash
npm run build
```

The production-ready application files will be generated in the `dist` directory.

## Deployment

The application will be deployed using Netlify.

**Live Application:** Deployment link will be added after deployment is completed.

## Demonstration Video

A 3–5 minute demonstration video will showcase:

1. The deployed Task Tracker application.
2. User registration, login, and logout.
3. Creating, viewing, editing, completing, and deleting tasks.
4. Firebase Firestore database functionality.
5. The interactive calendar.
6. Profile settings and dark mode.
7. A brief walkthrough of the project's code structure and design decisions.

**YouTube Demonstration:** Link will be added after the video is recorded and uploaded as unlisted.

## Project Structure

```text
Robinson_-Tasktracker/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── Auth.jsx
│   ├── Settings.jsx
│   ├── Calendar.jsx
│   ├── Calendar.css
│   ├── firebase.js
│   ├── taskService.js
│   ├── index.css
│   └── main.jsx
│
├── public/
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Future Improvements

Potential future enhancements include:

- Task search and filtering.
- Overdue task notifications.
- Recurring task scheduling.
- Productivity analytics and progress charts.
- Task categories.

## Author

Rhijhaye Robinson

AI Hootcamp Individual Project

Florida Atlantic University