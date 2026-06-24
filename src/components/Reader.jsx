import ReactMarkdown from 'react-markdown';
import { splitTeacherQuestions } from '../lib/markdownSections.js';
import { TeacherQuestions } from './TeacherQuestions.jsx';

export function Reader({ allQuestionCount, contentRef, onTextScaleChange, question, textScale }) {
  const sections = splitTeacherQuestions(question?.content || '');

  return (
    <main className="reader" ref={contentRef}>
      <header className="reader-toolbar">
        <div>
          <div className="reader-subject">{question?.subjectTitle}</div>
          <div className="reader-position">{allQuestionCount} вопросов в базе</div>
        </div>
        <div className="font-controls" aria-label="Размер текста">
          <button type="button" onClick={() => onTextScaleChange((value) => Math.max(0.85, value - 0.1))}>
            A-
          </button>
          <span>{Math.round(textScale * 100)}%</span>
          <button type="button" onClick={() => onTextScaleChange((value) => Math.min(1.45, value + 0.1))}>
            A+
          </button>
        </div>
      </header>

      <article className="markdown-body" style={{ '--text-scale': textScale }}>
        {question ? (
          <>
            <ReactMarkdown>{sections.mainContent}</ReactMarkdown>
            {sections.teacherQuestions && (
              <TeacherQuestions markdown={sections.teacherQuestions} />
            )}
          </>
        ) : (
          <p>Нет выбранного вопроса.</p>
        )}
      </article>
    </main>
  );
}
