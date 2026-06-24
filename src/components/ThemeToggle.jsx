export function ThemeToggle({ isDarkTheme, onToggle }) {
  return (
    <button
      aria-label={isDarkTheme ? 'Включить светлую тему' : 'Включить темную тему'}
      className="theme-toggle"
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true">{isDarkTheme ? '☀️' : '🌙'}</span>
    </button>
  );
}
