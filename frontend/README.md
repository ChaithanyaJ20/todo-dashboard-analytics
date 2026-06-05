# Todo Dashboard with Analytics

A full-stack productivity dashboard that helps users manage tasks and visualize progress through real-time analytics.

## Features

- Add Tasks
- Edit Tasks
- Delete Tasks
- Mark Tasks as Completed/Pending
- Real-time Statistics
- Interactive Pie Chart Analytics
- PostgreSQL Data Persistence
- Responsive UI using Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Recharts

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

## Project Structure

```text
todo-fullstack/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## Screenshots

### Dashboard Overview

(Add screenshot here)

### Task Analytics

(Add screenshot here)

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside backend:

```env
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
```

## API Endpoints

| Method | Endpoint | Description |
|----------|------------|-------------|
| GET | /todos | Fetch all todos |
| POST | /todos | Add todo |
| PUT | /todos/:id | Toggle completion |
| PUT | /todos/edit/:id | Edit todo |
| DELETE | /todos/:id | Delete todo |

## Future Enhancements

- Search Tasks
- Task Filters
- Due Dates
- Priority Levels
- Authentication
- Dark/Light Mode
- Deployment

## Author

Chaithanya
