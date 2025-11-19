import React from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';

function OptionsPage() {
  const [settings, setSettings] = React.useState({
    language: 'pt-BR',
    notifications: true,
    bulkMessageDelay: 60,
    dailyMessageLimit: 100
  });

  React.useEffect(() => {
    // Carregar configurações salvas
    chrome.storage.local.get(['settings'], (data) => {
      if (data.settings) {
        setSettings(data.settings);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ settings }, () => {
      alert('Configurações salvas com sucesso!');
    });
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>Configurações - Verk CRM</h1>
      </header>

      <main className="options-content">
        <section className="settings-section">
          <h2>Geral</h2>

          <div className="setting-item">
            <label htmlFor="language">Idioma</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="notifications">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              />
              Ativar notificações
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Envio em Massa</h2>

          <div className="setting-item">
            <label htmlFor="delay">Delay entre mensagens (segundos)</label>
            <input
              type="number"
              id="delay"
              min="30"
              max="300"
              value={settings.bulkMessageDelay}
              onChange={(e) => setSettings({ ...settings, bulkMessageDelay: parseInt(e.target.value) })}
            />
            <small>Recomendado: 60-90 segundos para evitar bloqueios</small>
          </div>

          <div className="setting-item">
            <label htmlFor="limit">Limite diário de mensagens</label>
            <input
              type="number"
              id="limit"
              min="10"
              max="500"
              value={settings.dailyMessageLimit}
              onChange={(e) => setSettings({ ...settings, dailyMessageLimit: parseInt(e.target.value) })}
            />
            <small>Limite de segurança para evitar ban</small>
          </div>
        </section>

        <button className="save-button" onClick={handleSave}>
          Salvar Configurações
        </button>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
