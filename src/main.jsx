import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Font serviti dal nostro hosting (niente richieste a Google Fonts: più veloce e conforme GDPR).
// Solo il set "latin": copre italiano, inglese, tedesco e albanese.
import '@fontsource/oswald/latin-300.css';
import '@fontsource/oswald/latin-400.css';
import '@fontsource/oswald/latin-500.css';
import '@fontsource/oswald/latin-600.css';
import '@fontsource/oswald/latin-700.css';
import '@fontsource/lato/latin-300.css';
import '@fontsource/lato/latin-400.css';
import '@fontsource/lato/latin-700.css';
import '@fontsource/lato/latin-300-italic.css';
import '@fontsource/lato/latin-400-italic.css';
import '@fontsource/open-sans/latin-300.css';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-600.css';
import '@fontsource/open-sans/latin-700.css';
import '@fontsource/open-sans/latin-400-italic.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
