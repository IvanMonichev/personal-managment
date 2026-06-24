import { useEffect, useState } from 'react';

const STORAGE_KEY = 'reader-theme';

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((value) => (value === 'dark' ? 'light' : 'dark'));
  }

  return {
    isDarkTheme: theme === 'dark',
    theme,
    toggleTheme,
  };
}
