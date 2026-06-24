export function cleanHeading(value) {
  return value
    .replace(/^\s*#+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

export function slugify(value) {
  return cleanHeading(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function getQuestionId(title, fallbackIndex) {
  const match = title.match(/Вопрос\s+(\d+(?:[.\-]\d+)?)/i);

  if (!match) {
    return `question-${fallbackIndex}`;
  }

  return `question-${match[1].replace(/[.\-]+/g, '-')}`;
}

export function parseMarkdown(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const title = cleanHeading(lines.find((line) => line.trim()) || 'Материалы');
  const subjects = [];
  let currentSubject = null;
  let currentQuestion = null;

  function closeQuestion() {
    if (currentSubject && currentQuestion) {
      currentQuestion.content = currentQuestion.lines.join('\n').trim();
      currentQuestion.searchText = `${currentSubject.title} ${currentQuestion.title} ${currentQuestion.content}`.toLowerCase();
      delete currentQuestion.lines;
      currentSubject.questions.push(currentQuestion);
      currentQuestion = null;
    }
  }

  function closeSubject() {
    closeQuestion();
    if (currentSubject) {
      currentSubject.count = currentSubject.questions.length;
      subjects.push(currentSubject);
      currentSubject = null;
    }
  }

  for (const line of lines) {
    if (/^\s*##\s+/.test(line)) {
      closeSubject();
      const subjectTitle = cleanHeading(line);
      currentSubject = {
        id: `section-${subjects.length + 1}`,
        title: subjectTitle,
        questions: [],
      };
      continue;
    }

    if (/^\s*###\s+/.test(line)) {
      closeQuestion();
      if (!currentSubject) {
        currentSubject = {
          id: 'common',
          title,
          questions: [],
        };
      }

      const questionTitle = cleanHeading(line);
      currentQuestion = {
        id: getQuestionId(questionTitle, currentSubject.questions.length + 1),
        title: questionTitle,
        lines: [line.trimStart()],
      };
      continue;
    }

    if (currentQuestion) {
      currentQuestion.lines.push(line);
    }
  }

  closeSubject();
  return { title, subjects };
}

export function flattenQuestions(subjects) {
  return subjects.flatMap((subject) =>
    subject.questions.map((question) => ({
      ...question,
      subjectId: subject.id,
      subjectTitle: subject.title,
    })),
  );
}

export function getSearchResults(questions, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return questions;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return questions.filter((question) => terms.every((term) => question.searchText.includes(term)));
}
