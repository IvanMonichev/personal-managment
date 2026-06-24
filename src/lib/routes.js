export function makeQuestionPath(subjectId, questionId) {
  return `#/${encodeURIComponent(subjectId)}/${encodeURIComponent(questionId)}`;
}

export function makeSubjectPath(subjectId) {
  return `#/${encodeURIComponent(subjectId)}`;
}

export function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean).map(decodeURIComponent);
  const subjectIndex = parts.indexOf('subject');
  const questionIndex = parts.indexOf('question');

  if (subjectIndex >= 0 || questionIndex >= 0) {
    return {
      subjectId: subjectIndex >= 0 ? parts[subjectIndex + 1] || '' : '',
      questionId: questionIndex >= 0 ? parts[questionIndex + 1] || '' : '',
    };
  }

  return {
    subjectId: parts[0] || '',
    questionId: parts[1] || '',
  };
}

export function writeRoute(subjectId, questionId, { replace = false } = {}) {
  const path = questionId ? makeQuestionPath(subjectId, questionId) : makeSubjectPath(subjectId);
  const nextUrl = `${window.location.pathname}${window.location.search}${path}`;

  if (replace) {
    window.history.replaceState(null, '', nextUrl);
    return;
  }

  window.history.pushState(null, '', nextUrl);
}
