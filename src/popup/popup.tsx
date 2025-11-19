import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';
import { t } from '../i18n';
import { Button } from '../components/ui';
import { SendToNumber } from '../components/crm';
import StorageManager from '../storage';
import type { Analytics } from '../types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSendToNumber, setShowSendToNumber] = useState(false);
  const [stats, setStats] = useState<Analytics | null>(null);

  // Carregar estatísticas
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { analytics } = await StorageManager.get('analytics');
      setStats(analytics || null);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const openWhatsApp = () => {
    chrome.tabs.create({ url: 'https://web.whatsapp.com' });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const getTotalReminders = () => {
    // TODO: Implementar contagem de lembretes ativos
    return 0;
  };

  const getTotalTabs = () => {
    // TODO: Implementar contagem de abas personalizadas
    return 0;
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">{t('popup.title')}</h1>
          <p className="subtitle">{t('popup.subtitle')}</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          {t('popup.tabs.dashboard')}
        </button>
        <button
          className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          {t('popup.tabs.tools')}
        </button>
        <button
          className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          {t('popup.tabs.about')}
        </button>
      </nav>

      {/* Content */}
      <main className="content">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>{t('popup.dashboard.welcome')}</h2>
            <p>{t('popup.dashboard.description')}</p>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">{stats?.totalContacts || 0}</div>
                <div className="stat-label">{t('popup.dashboard.stats.contacts')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{getTotalReminders()}</div>
                <div className="stat-label">{t('popup.dashboard.stats.reminders')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{getTotalTabs()}</div>
                <div className="stat-label">{t('popup.dashboard.stats.tabs')}</div>
              </div>
            </div>

            <div className="button-group">
              <button className="primary-button" onClick={openWhatsApp}>
                {t('popup.dashboard.openWhatsApp')}
              </button>

              <button
                className="secondary-button"
                onClick={() => setShowSendToNumber(true)}
              >
                📞 {t('features.sendToNumber.title')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="tab-content">
            <h2>{t('popup.tools.title')}</h2>
            <div className="tools-list">
              <div
                className="tool-item clickable"
                onClick={() => setShowSendToNumber(true)}
              >
                <span>📞 {t('features.sendToNumber.title')}</span>
                <span className="badge badge-success">✓</span>
              </div>
              <div className="tool-item">
                <span>📋 {t('popup.tools.quickReplies')}</span>
                <span className="badge">{t('popup.tools.comingSoon')}</span>
              </div>
              <div className="tool-item">
                <span>📊 {t('popup.tools.kanban')}</span>
                <span className="badge">{t('popup.tools.comingSoon')}</span>
              </div>
              <div className="tool-item">
                <span>📤 {t('popup.tools.bulkSend')}</span>
                <span className="badge">{t('popup.tools.comingSoon')}</span>
              </div>
              <div className="tool-item">
                <span>📥 {t('popup.tools.exportContacts')}</span>
                <span className="badge">{t('popup.tools.comingSoon')}</span>
              </div>
              <div className="tool-item">
                <span>🤖 {t('popup.tools.aiAssistant')}</span>
                <span className="badge">{t('popup.tools.comingSoon')}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="tab-content">
            <h2>{t('popup.about.title')}</h2>
            <p><strong>Verk CRM Clone {t('popup.about.version')}</strong></p>
            <p>{t('popup.about.description')}</p>

            <div className="features">
              <h3>{t('popup.about.features')}</h3>
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
                <li>✅ Enviar para número não salvo</li>
              </ul>
            </div>

            <button className="secondary-button" onClick={openOptions}>
              {t('popup.about.settings')}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>{t('popup.about.developedBy')}</p>
      </footer>

      {/* Modal: Send to Number */}
      <SendToNumber
        isOpen={showSendToNumber}
        onClose={() => setShowSendToNumber(false)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
