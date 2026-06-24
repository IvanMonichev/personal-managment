import { useEffect, useMemo, useState } from 'react';
import { parseMarkdown } from '../lib/content.js';

const SOURCE_URL = `${import.meta.env.BASE_URL}response-common.md`;

export function useMarkdownContent() {
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch(SOURCE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Не удалось загрузить ${SOURCE_URL}`);
        }

        return response.text();
      })
      .then(setRawMarkdown)
      .catch((error) => setLoadError(error.message));
  }, []);

  const parsed = useMemo(() => (rawMarkdown ? parseMarkdown(rawMarkdown) : { title: '', subjects: [] }), [rawMarkdown]);

  return {
    parsed,
    isLoading: !rawMarkdown && !loadError,
    loadError,
  };
}
