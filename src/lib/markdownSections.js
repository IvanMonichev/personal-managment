const TEACHER_QUESTIONS_PATTERN = /^\s*\*\*Возможные уточняющие вопросы преподавателя\*\*:?\s*$/im;

function splitQuestionAnswer(line) {
  const cleanedLine = line
    .replace(/^\s*[-*]\s+/, '')
    .replace(/\s{2,}$/, '')
    .trim();
  const questionEndIndex = cleanedLine.indexOf('?');

  if (questionEndIndex < 0) {
    return {
      answer: '',
      question: cleanedLine,
    };
  }

  return {
    question: cleanedLine.slice(0, questionEndIndex + 1).trim(),
    answer: cleanedLine
      .slice(questionEndIndex + 1)
      .replace(/^\s*[—–-]\s*/, '')
      .trim(),
  };
}

export function splitTeacherQuestions(markdown) {
  const match = markdown.match(TEACHER_QUESTIONS_PATTERN);

  if (!match || match.index === undefined) {
    return {
      mainContent: markdown,
      teacherQuestions: '',
    };
  }

  return {
    mainContent: markdown.slice(0, match.index).trim(),
    teacherQuestions: markdown.slice(match.index + match[0].length).trim(),
  };
}

export function parseTeacherQuestions(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map(splitQuestionAnswer)
    .filter((item) => item.question);
}
