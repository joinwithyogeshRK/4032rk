import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import TodoApp from '@/components/TodoApp';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
