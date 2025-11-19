import React from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const openWhatsApp = () => {
    chrome.tabs.create({ url: 'https://web.whatsapp.com' });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Verk CRM</h1>
          <p className="subtitle">Gerenciador para WhatsApp Web</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Ferramentas
        </button>
        <button
          className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Sobre
        </button>
      </nav>

      {/* Content */}
      <main className="content">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>Bem-vindo ao Verk CRM</h2>
            <p>Otimize seu atendimento no WhatsApp Web</p>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Contatos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Lembretes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Abas</div>
              </div>
            </div>

            <button className="primary-button" onClick={openWhatsApp}>
              Abrir WhatsApp Web
            </button>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="tab-content">
            <h2>Ferramentas</h2>
            <div className="tools-list">
              <div className="tool-item">
                <span>📋 Respostas Rápidas</span>
                <span className="badge">Em breve</span>
              </div>
              <div className="tool-item">
                <span>📊 Kanban</span>
                <span className="badge">Em breve</span>
              </div>
              <div className="tool-item">
                <span>📤 Envio em Massa</span>
                <span className="badge">Em breve</span>
              </div>
              <div className="tool-item">
                <span>📥 Exportar Contatos</span>
                <span className="badge">Em breve</span>
              </div>
              <div className="tool-item">
                <span>🤖 Assistente AI</span>
                <span className="badge">Em breve</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="tab-content">
            <h2>Sobre</h2>
            <p><strong>Verk CRM Clone v1.0.0</strong></p>
            <p>Extensão para Chrome que adiciona recursos de CRM ao WhatsApp Web.</p>

            <div className="features">
              <h3>Recursos Planejados:</h3>
              <ul>
                <li>✅ Abas personalizadas</li>
                <li>✅ Visão Kanban</li>
                <li>✅ Notas por contato</li>
                <li>✅ Lembretes</li>
                <li>✅ Respostas rápidas</li>
                <li>✅ Envio em massa</li>
                <li>✅ Exportação de contatos</li>
                <li>✅ Assistente AI</li>
                <li>✅ Multi-idioma</li>
              </ul>
            </div>

            <button className="secondary-button" onClick={openOptions}>
              Configurações
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Desenvolvido para uso pessoal</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
