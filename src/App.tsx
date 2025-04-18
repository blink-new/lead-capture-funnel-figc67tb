
import { LeadFunnel } from './components/LeadFunnel';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <LeadFunnel />
    </>
  );
}

export default App;