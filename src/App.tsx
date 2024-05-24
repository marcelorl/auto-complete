import ErrorBoundary from './components/ErrorBoundary.tsx';
import AutoComplete from './components/AutoComplete.tsx';
import { useState } from 'react';
import { useFetchData } from './hooks/useFetchData.ts';

function App() {
  const [query, setQuery] = useState('');
  const { allData } = useFetchData();

  return (
    <ErrorBoundary>
      <div>
        <h1>AutoComplete Component</h1>
        <AutoComplete query={query} onChange={setQuery} allData={allData} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
