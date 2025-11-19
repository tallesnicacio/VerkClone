/**
 * Background Service Worker
 * Gerencia eventos globais da extensão, notificações e comunicação entre componentes
 */

// Listener de instalação da extensão
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Verk CRM instalado com sucesso!', details);

  if (details.reason === 'install') {
    // Primeira instalação - configurações iniciais
    chrome.storage.local.set({
      version: '1.0.0',
      installedAt: Date.now(),
      settings: {
        language: 'pt-BR',
        notifications: true,
        bulkMessageDelay: 60, // segundos entre mensagens
        dailyMessageLimit: 100
      }
    });
  }
});

// Listener para mensagens de content scripts e popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensagem recebida:', message);

  switch (message.type) {
    case 'SHOW_NOTIFICATION':
      showNotification(message.payload);
      sendResponse({ success: true });
      break;

    case 'SCHEDULE_REMINDER':
      scheduleReminder(message.payload);
      sendResponse({ success: true });
      break;

    case 'GET_STORAGE':
      chrome.storage.local.get(message.payload.keys, (data) => {
        sendResponse({ success: true, data });
      });
      return true; // Mantém o canal aberto para resposta assíncrona

    case 'SET_STORAGE':
      chrome.storage.local.set(message.payload.data, () => {
        sendResponse({ success: true });
      });
      return true;

    default:
      sendResponse({ success: false, error: 'Tipo de mensagem desconhecido' });
  }

  return false;
});

// Função para mostrar notificações
function showNotification(payload: { title: string; message: string; iconUrl?: string }) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: payload.iconUrl || '/icons/icon128.png',
    title: payload.title,
    message: payload.message,
    priority: 2
  });
}

// Função para agendar lembretes usando Chrome Alarms
function scheduleReminder(payload: { id: string; when: number; contact: string; message: string }) {
  const { id, when } = payload;

  chrome.alarms.create(id, {
    when: when
  });
}

// Listener para alarmes (lembretes)
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarme disparado:', alarm.name);

  // Buscar dados do lembrete no storage
  chrome.storage.local.get(['reminders'], (data) => {
    const reminders = data.reminders || {};
    const reminder = reminders[alarm.name];

    if (reminder) {
      showNotification({
        title: 'Lembrete - Verk CRM',
        message: `${reminder.contact}: ${reminder.message}`
      });

      // Remover lembrete após disparar
      delete reminders[alarm.name];
      chrome.storage.local.set({ reminders });
    }
  });
});

// Listener para cliques em notificações
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notificação clicada:', notificationId);
  // Abrir WhatsApp Web quando clicar na notificação
  chrome.tabs.create({ url: 'https://web.whatsapp.com' });
});

console.log('Background service worker iniciado');
