# SpeakUp - English Learning Application Frontend

SpeakUp is a web application designed to help users learn and improve their English language skills through interactive lessons, AI-powered chat, and quizzes. This is the frontend part of the application, built with React and Vite.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (comes with Node.js)

## Installation

1.  Navigate to the `english-learnig-app` directory (this directory).
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Development Server

The frontend application uses Vite. To start the development server:

```bash
npm run dev
```
This will typically start the server on `http://localhost:5500` (as configured in `vite.config.js`). The application expects the backend API to be running on `http://localhost:8084` and will proxy requests from `/api` to it.

## Building for Production

To create a production build:

```bash
npm run build
```
The production-ready files will be generated in the `dist/` directory.

## Running Tests

To run the unit tests:

```bash
npm run test
```
This will execute tests using Vitest.

## Project Structure (Brief Overview)

The `src/` directory contains the core of the application:

*   **`assets/`**: Static assets like images (though currently using placeholder images).
*   **`components/`**: Reusable UI components used across multiple pages (e.g., `Header.jsx`, `LessonCard.jsx`).
*   **`contexts/`**: React Context API providers (e.g., `AuthContext.jsx` for managing authentication state).
*   **`hooks/`**: Custom React hooks (currently empty, but can be used for shared logic).
*   **`pages/`**: Top-level components that represent different views/pages of the application (e.g., `HomePage.jsx`, `LoginPage.jsx`, `LessonsPage.jsx`). Each page often has its own SCSS module for styling.
*   **`router/`**: Routing configuration (currently, routes are defined in `App.jsx`, but a dedicated `router/index.jsx` exists for future expansion).
*   **`services/`**: Modules for interacting with the backend API (e.g., `authService.js`, `lessonService.js`). Uses an Axios client configured in `api.js`.
*   **`styles/`**: Global styles, SCSS variables, and utilities (`global.scss`).
*   **`utils/`**: Utility functions (currently empty).
*   **`App.jsx`**: The main application component, setting up routing and global layout.
*   **`main.jsx`**: The entry point of the React application, rendering the `App` component.
*   **`setupTests.js`**: Setup file for Vitest, importing `@testing-library/jest-dom`.
