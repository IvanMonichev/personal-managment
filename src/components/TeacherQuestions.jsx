import ReactMarkdown from 'react-markdown';
import { parseTeacherQuestions } from '../lib/markdownSections.js';

export function TeacherQuestions({ markdown }) {
  const items = parseTeacherQuestions(markdown);

  if (!items.length) {
    return null;
  }

  return (
    <section className="teacher-questions">
      <h4>Возможные уточняющие вопросы преподавателя</h4>
      <div className="teacher-question-list">
        {items.map((item, index) => (
          <div className="teacher-question-item" key={`${item.question}-${index}`}>
            <div className="teacher-question-label">Вопрос</div>
            <div className="teacher-question-text">{item.question}</div>
            {item.answer && (
              <>
                <div className="teacher-answer-label">Ответ</div>
                <div className="teacher-answer-text">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
