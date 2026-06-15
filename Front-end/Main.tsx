import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Para fazer rodar, é so abrir o terminal e rodar o comando "npm run dev"
// Pra parar, é só usar "Ctrl + C" no terminal
// Esse bloco busca uma div com id "root" no HTML e renderiza o App dentro dela
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);