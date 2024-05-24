import React, { useState, useMemo, useCallback, useTransition, useEffect, useRef } from 'react';

const AutoComplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [allData, setAllData] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputSearchRef.current?.focus();
  }, []);

  useEffect(() => {
    fetch('/auto-complete/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then((data: Array<{ email: string }>) => setAllData(data.map((item) => item.email)))
      .catch((error) => {
        console.error('Failed to load data', error);
        throw error;
      });
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setQuery(value);

      startTransition(() => {
        if (value.trim() === '') {
          setResults([]);
        } else {
          const filteredResults = [];
          for (let i = 0; i < allData.length; i++) {
            const item = allData[i];
            const isItemFound = item.trim().toLowerCase().startsWith(value.toLowerCase().trim());

            if (isItemFound) {
              filteredResults.push(item);
            }
            if (filteredResults.length >= 10) {
              break;
            }
          }

          setResults(filteredResults);
        }
      });
    },
    [allData],
  );

  const handleSelect = useCallback((value: string) => {
    setQuery(value);
    setResults([]);
    inputSearchRef.current?.focus();
  }, []);

  const memoizedResults = useMemo(() => {
    return results.map((result) => (
      <li key={result} onClick={() => handleSelect(result)}>
        {result}
      </li>
    ));
  }, [results, handleSelect]);

  const isNotFound = useMemo(() => {
    return Boolean(query.length && !memoizedResults.length && !allData.find((item) => query === item));
  }, [allData, memoizedResults.length, query]);

  return (
    <div>
      <input type="text" value={query} onChange={handleChange} placeholder="Search..." ref={inputSearchRef} />
      {isPending && <div>Loading...</div>}
      <ul>{memoizedResults}</ul>
      {isNotFound && <div>No results</div>}
    </div>
  );
};

export default AutoComplete;
