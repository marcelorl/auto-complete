import './App.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';

function App() {
  return (
    <ErrorBoundary>
      <div>
        <h1>AutoComplete Component</h1>
      </div>
    </ErrorBoundary>
  );
}

export default App;
