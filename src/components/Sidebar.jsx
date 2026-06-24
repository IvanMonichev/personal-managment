import { makeSubjectPath } from '../lib/routes.js';

export function Sidebar({ activeSubjectId, isOpen, onClose, onSelectSubject, query, subjects, title }) {
  return (
    <>
      <aside className={isOpen ? 'sidebar open' : 'sidebar'} aria-label="Предметы">
        <div className="brand">
          <span className="brand-kicker">Экзамен</span>
          <h1>{title}</h1>
        </div>

        <nav className="subject-list">
          {subjects.map((subject) => (
            <a
              className={subject.id === activeSubjectId && !query.trim() ? 'subject-button active' : 'subject-button'}
              href={makeSubjectPath(subject.id)}
              key={subject.id}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                  return;
                }
                event.preventDefault();
                onSelectSubject(subject.id);
              }}
            >
              <span>{subject.title}</span>
              <span className="count">{subject.count}</span>
            </a>
          ))}
        </nav>
      </aside>

      {isOpen && <button aria-label="Закрыть список предметов" className="sidebar-backdrop" onClick={onClose} type="button" />}
    </>
  );
}
