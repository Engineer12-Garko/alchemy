import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import './readability.css';

const container = document.getElementById('root') as HTMLElement;
createRoot(container!).render(<App />);
