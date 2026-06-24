import { SearchBox } from './SearchBox.jsx';
import { makeQuestionPath } from '../lib/routes.js';

export function QuestionPanel({
  activeQuestionId,
  activeSubjectCount,
  onQueryChange,
  onSelectQuestion,
  query,
  questions,
  resultCount,
}) {
  return (
    <section className="question-panel" aria-label="Вопросы">
      <SearchBox
        className="desktop-search"
        id="global-search"
        onQueryChange={onQueryChange}
        query={query}
        resultCount={resultCount}
        subjectCount={activeSubjectCount}
      />

      <div className="question-list" aria-label="Список вопросов">
        {questions.map((question) => (
          <a
            className={question.id === activeQuestionId ? 'question-button active' : 'question-button'}
            href={makeQuestionPath(question.subjectId, question.id)}
            key={question.id}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
              }
              event.preventDefault();
              onSelectQuestion(question);
            }}
          >
            {query.trim() && <span className="question-subject">{question.subjectTitle}</span>}
            <span>{question.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
