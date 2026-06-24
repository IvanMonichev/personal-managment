import { SearchBox } from './SearchBox.jsx';

export function MobileTopBar({
  isMenuOpen,
  onMenuToggle,
  onQueryChange,
  onTextScaleChange,
  query,
  textScale,
}) {
  return (
    <header className="mobile-topbar">
      <button
        aria-expanded={isMenuOpen}
        aria-label="Открыть список предметов"
        className="burger-button"
        onClick={onMenuToggle}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <SearchBox
        className="mobile-search"
        id="mobile-global-search"
        onQueryChange={onQueryChange}
        query={query}
        showMeta={false}
      />

      <div className="font-controls mobile-font-controls" aria-label="Размер текста">
        <button type="button" onClick={() => onTextScaleChange((value) => Math.max(0.85, value - 0.1))}>
          A-
        </button>
        <span>{Math.round(textScale * 100)}%</span>
        <button type="button" onClick={() => onTextScaleChange((value) => Math.min(1.45, value + 0.1))}>
          A+
        </button>
      </div>
    </header>
  );
}
