# Todo Frontend

A responsive React frontend for the Todo API, featuring authentication, task management, reminders, and real-time notifications.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete todos
- Set deadlines and reminders for todos
- Real-time notifications system with badge indicators
- Advanced reminder status tracking
- Filter todos by status (pending, in-progress, completed)
- Responsive design for all device sizes
- Beautiful UI with Tailwind CSS

## Technologies Used

- React with Context API for state management
- React Router for navigation
- React Hook Form for form handling
- Axios for API requests
- Tailwind CSS for styling
- React Toastify for toast notifications
- date-fns for date formatting and calculations

## Installation

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:

   ```
   npm run dev
   ```

   Alternatively, use the setup scripts:

   - Windows: `setup.bat`
   - Unix/MacOS: `./setup.sh` (make it executable first with `chmod +x setup.sh`)

## Usage

The application will be available at http://localhost:3000

### Authentication

- Register a new account via the Register page
- Login with existing credentials via the Login page
- Automatic redirection to protected pages after login

### Todo Management

- Create new todos using the "Add New Todo" button
- View all todos on the main dashboard
- Filter todos by status (All, Pending, In Progress, Completed)
- Edit, delete, or view details of a todo using the buttons on each todo card
- Set deadlines and reminders for todos
- Send reminders manually from the todo detail page

### Notifications

- Real-time notification updates via the bell icon in the navbar
- Unread notification count shown as a badge
- Notifications are automatically marked as read when viewed
- View all notifications by clicking the bell icon
- Manual "Mark all as read" option
- Notifications are refreshed periodically (every 30 seconds)

### Reminders

- Smart reminder status messages (e.g., "Reminder will be sent in 2 hours")
- Color-coded reminder status (pending, sent, or overdue)
- Ability to send reminders manually

## Building for Production

```
npm run build
```

This will create a `dist` folder with the production-ready files.

## License

MIT
