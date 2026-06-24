import { useEffect, useMemo, useRef, useState } from 'react';
import { MobileTopBar } from './components/MobileTopBar.jsx';
import { QuestionPanel } from './components/QuestionPanel.jsx';
import { Reader } from './components/Reader.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { StateScreen } from './components/StateScreen.jsx';
import { useMarkdownContent } from './hooks/useMarkdownContent.js';
import { useTheme } from './hooks/useTheme.js';
import { flattenQuestions, getSearchResults } from './lib/content.js';
import { readRoute, writeRoute } from './lib/routes.js';

function withSubject(question, subject) {
  return {
    ...question,
    subjectId: subject.id,
    subjectTitle: subject.title,
  };
}

export default function App() {
  const { parsed, isLoading, loadError } = useMarkdownContent();
  const [activeSubjectId, setActiveSubjectId] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState('');
  const [query, setQuery] = useState('');
  const [textScale, setTextScale] = useState(1);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();
  const contentRef = useRef(null);

  const allQuestions = useMemo(() => flattenQuestions(parsed.subjects), [parsed.subjects]);
  const searchResults = useMemo(() => getSearchResults(allQuestions, query), [allQuestions, query]);
  const activeSubject = parsed.subjects.find((subject) => subject.id === activeSubjectId) || parsed.subjects[0];

  const visibleQuestions = query.trim()
    ? searchResults
    : activeSubject?.questions.map((question) => withSubject(question, activeSubject)) || [];

  const activeQuestion =
    visibleQuestions.find((question) => question.id === activeQuestionId) ||
    allQuestions.find((question) => question.id === activeQuestionId) ||
    visibleQuestions[0] ||
    allQuestions[0];

  useEffect(() => {
    function applyRoute() {
      const route = readRoute();
      if (route.subjectId) {
        setActiveSubjectId(route.subjectId);
      }
      if (route.questionId) {
        setActiveQuestionId(route.questionId);
      }
    }

    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    window.addEventListener('popstate', applyRoute);

    return () => {
      window.removeEventListener('hashchange', applyRoute);
      window.removeEventListener('popstate', applyRoute);
    };
  }, []);

  useEffect(() => {
    if (!parsed.subjects.length) {
      return;
    }

    const route = readRoute();
    if (route.subjectId || route.questionId) {
      return;
    }

    const firstSubject = parsed.subjects[0];
    const firstQuestion = firstSubject.questions[0];
    setActiveSubjectId(firstSubject.id);
    setActiveQuestionId(firstQuestion?.id || '');
    writeRoute(firstSubject.id, firstQuestion?.id || '', { replace: true });
  }, [parsed.subjects]);

  useEffect(() => {
    if (activeQuestion && !activeSubjectId) {
      setActiveSubjectId(activeQuestion.subjectId);
    }

    if (activeQuestion && activeQuestion.id !== activeQuestionId) {
      setActiveQuestionId(activeQuestion.id);
    }
  }, [activeQuestion, activeQuestionId, activeSubjectId]);

  function selectSubject(subjectId) {
    setQuery('');
    setActiveSubjectId(subjectId);
    setIsSubjectMenuOpen(false);

    const subject = parsed.subjects.find((item) => item.id === subjectId);
    const questionId = subject?.questions[0]?.id || '';
    setActiveQuestionId(questionId);
    writeRoute(subjectId, questionId);
  }

  function selectQuestion(question) {
    setActiveSubjectId(question.subjectId);
    setActiveQuestionId(question.id);
    writeRoute(question.subjectId, question.id);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loadError) {
    return (
      <StateScreen title="Ошибка загрузки">
        <p>{loadError}</p>
      </StateScreen>
    );
  }

  if (isLoading) {
    return <StateScreen title="Загрузка материалов" />;
  }

  return (
    <div className="app-shell">
      <MobileTopBar
        isMenuOpen={isSubjectMenuOpen}
        onMenuToggle={() => setIsSubjectMenuOpen((value) => !value)}
        onQueryChange={setQuery}
        onTextScaleChange={setTextScale}
        onThemeToggle={toggleTheme}
        query={query}
        isDarkTheme={isDarkTheme}
        textScale={textScale}
      />

      <Sidebar
        activeSubjectId={activeSubject?.id}
        isOpen={isSubjectMenuOpen}
        onClose={() => setIsSubjectMenuOpen(false)}
        onSelectSubject={selectSubject}
        query={query}
        subjects={parsed.subjects}
        title={parsed.title}
      />

      <QuestionPanel
        activeQuestionId={activeQuestion?.id}
        activeSubjectCount={activeSubject?.count || 0}
        onQueryChange={setQuery}
        onSelectQuestion={selectQuestion}
        query={query}
        questions={visibleQuestions}
        resultCount={searchResults.length}
      />

      <Reader
        allQuestionCount={allQuestions.length}
        contentRef={contentRef}
        isDarkTheme={isDarkTheme}
        onTextScaleChange={setTextScale}
        onThemeToggle={toggleTheme}
        question={activeQuestion}
        textScale={textScale}
      />
    </div>
  );
}
