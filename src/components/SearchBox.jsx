export function SearchBox({ className = '', id, onQueryChange, query, resultCount, showMeta = true, subjectCount }) {
  return (
    <div className={`search-block ${className}`}>
      <label htmlFor={id}>Поиск</label>
      <input
        id={id}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Термин, автор, статья, вопрос"
        type="search"
        value={query}
      />
      {showMeta && (
        <div className="search-meta">{query.trim() ? `Найдено: ${resultCount}` : `Вопросов: ${subjectCount}`}</div>
      )}
    </div>
  );
}
