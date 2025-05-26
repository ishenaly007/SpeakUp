import React from 'react';
import { AuthProvider } from './contexts/AuthContext'; // Ensure AuthProvider is imported
import AppRouter from './router'; // Import the AppRouter
import './styles/global.scss';

function App() {
  // AuthContext will provide user and loading state to AppRouter
  return (
    <AuthProvider>
      <div className="App">
        {/* main tag is not strictly needed here if AppRouter handles page structure */}
        {/* However, if global.scss targets main, it might be kept or refactored */}
        <main> 
          <AppRouter />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
