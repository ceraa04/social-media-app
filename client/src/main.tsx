import ReactDOM from 'react-dom/client';
// Import pages
import { App } from './Router';
import { BrowserRouter } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>

);
