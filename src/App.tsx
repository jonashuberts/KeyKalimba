import { Layout } from './components/Layout';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';
import './index.css'; // Global dark theme styles

function App() {
  return (
    <div className="app">
      <Layout />
      <PwaUpdatePrompt />
    </div>
  );
}

export default App;
