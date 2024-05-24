import ErrorBoundary from './components/ErrorBoundary.tsx';
import AutoComplete from './components/AutoComplete.tsx';

function App() {
  return (
    <ErrorBoundary>
      <div>
        <h1>AutoComplete Component</h1>
        <AutoComplete />
      </div>
    </ErrorBoundary>
  );
}

export default App;
