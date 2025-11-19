/**
 * Sistema de Mensagens
 * Facilita a comunicação entre background, content script e popup
 */

import type { Message, MessageResponse, MessageType } from '../types';

/**
 * Envia mensagem para o background script
 */
export async function sendToBackground<T = any>(
  type: MessageType,
  payload?: any
): Promise<MessageResponse<T>> {
  try {
    const message: Message = { type, payload };
    const response = await chrome.runtime.sendMessage(message);
    return response as MessageResponse<T>;
  } catch (error) {
    console.error('Erro ao enviar mensagem para background:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Envia mensagem para content script de uma tab específica
 */
export async function sendToContentScript<T = any>(
  tabId: number,
  type: MessageType,
  payload?: any
): Promise<MessageResponse<T>> {
  try {
    const message: Message = { type, payload };
    const response = await chrome.tabs.sendMessage(tabId, message);
    return response as MessageResponse<T>;
  } catch (error) {
    console.error('Erro ao enviar mensagem para content script:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Envia mensagem para content script da tab ativa do WhatsApp Web
 */
export async function sendToWhatsAppTab<T = any>(
  type: MessageType,
  payload?: any
): Promise<MessageResponse<T>> {
  try {
    const tabs = await chrome.tabs.query({
      url: 'https://web.whatsapp.com/*',
    });

    if (tabs.length === 0) {
      return {
        success: false,
        error: 'WhatsApp Web não está aberto',
      };
    }

    // Usar a primeira tab encontrada
    const tabId = tabs[0].id;
    if (!tabId) {
      return {
        success: false,
        error: 'ID da tab não encontrado',
      };
    }

    return await sendToContentScript<T>(tabId, type, payload);
  } catch (error) {
    console.error('Erro ao enviar mensagem para WhatsApp tab:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Adiciona listener para mensagens recebidas
 */
export function addMessageListener(
  handler: (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.addListener(handler);
}

/**
 * Verifica se o content script está ativo no WhatsApp Web
 */
export async function isContentScriptActive(): Promise<boolean> {
  try {
    const response = await sendToWhatsAppTab('PING');
    return response.success;
  } catch {
    return false;
  }
}

/**
 * Abre o WhatsApp Web
 */
export async function openWhatsAppWeb(): Promise<void> {
  const tabs = await chrome.tabs.query({
    url: 'https://web.whatsapp.com/*',
  });

  if (tabs.length > 0 && tabs[0].id) {
    // Se já está aberto, apenas ativa a tab
    await chrome.tabs.update(tabs[0].id, { active: true });
  } else {
    // Se não está aberto, cria nova tab
    await chrome.tabs.create({ url: 'https://web.whatsapp.com' });
  }
}

/**
 * Mostra notificação
 */
export async function showNotification(title: string, message: string): Promise<void> {
  await sendToBackground('SHOW_NOTIFICATION', { title, message });
}

/**
 * Agenda lembrete
 */
export async function scheduleReminder(
  id: string,
  when: number,
  contact: string,
  message: string
): Promise<void> {
  await sendToBackground('SCHEDULE_REMINDER', { id, when, contact, message });
}
