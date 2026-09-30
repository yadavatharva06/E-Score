import React from 'react';
import { useTheme } from './ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={toggleTheme}
    >
      <span className="theme-toggle-label">Dark theme</span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-knob" />
      </span>
      <span className="theme-toggle-state">{isDark ? 'On' : 'Off'}</span>
    </button>
  );
}

export default ThemeToggle;