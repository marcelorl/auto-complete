import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useFocusInput } from '../hooks/useFocusInput.ts';

type AutoCompleteProps = {
  query: string;
  onChange: (str: string) => void;
  allData: string[];
};

const AutoComplete: React.FC<AutoCompleteProps> = ({ query, onChange, allData }) => {
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { ref, setFocus } = useFocusInput();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onChange(value);

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
    [allData, onChange],
  );

  const handleSelect = useCallback(
    (value: string) => {
      onChange(value);
      setResults([]);
      setFocus();
    },
    [onChange, setFocus],
  );

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
      <input type="text" value={query} onChange={handleChange} placeholder="Search..." ref={ref} />
      {isPending && <div>Loading...</div>}
      <ul>{memoizedResults}</ul>
      {isNotFound && <div>No results</div>}
    </div>
  );
};

export default AutoComplete;
