import { useState, useCallback } from 'react';
import { sendToWhatsAppTab, isContentScriptActive, openWhatsAppWeb } from '../utils/messaging';
import type { Contact } from '../types';

interface WhatsAppState {
  isActive: boolean;
  checking: boolean;
}

/**
 * Hook para verificar status e comunicar com WhatsApp Web
 */
export function useWhatsApp() {
  const [state, setState] = useState<WhatsAppState>({
    isActive: false,
    checking: false,
  });

  /**
   * Verifica se o content script está ativo
   */
  const checkActive = useCallback(async () => {
    setState((prev) => ({ ...prev, checking: true }));

    try {
      const active = await isContentScriptActive();
      setState({ isActive: active, checking: false });
      return active;
    } catch (error) {
      setState({ isActive: false, checking: false });
      return false;
    }
  }, []);

  /**
   * Abre o WhatsApp Web
   */
  const open = useCallback(async () => {
    await openWhatsAppWeb();
    // Aguarda um pouco e verifica se está ativo
    setTimeout(checkActive, 2000);
  }, [checkActive]);

  /**
   * Envia mensagem para um número
   */
  const sendMessage = useCallback(async (number: string, text: string) => {
    const response = await sendToWhatsAppTab('SEND_MESSAGE', { number, text });
    return response;
  }, []);

  /**
   * Abre um chat
   */
  const openChat = useCallback(async (nameOrNumber: string) => {
    const response = await sendToWhatsAppTab('OPEN_CHAT', { nameOrNumber });
    return response;
  }, []);

  /**
   * Obtém lista de contatos
   */
  const getContacts = useCallback(async (): Promise<Contact[]> => {
    const response = await sendToWhatsAppTab<Contact[]>('GET_CONTACTS');
    return response.success && response.data ? response.data : [];
  }, []);

  /**
   * Obtém contato atual
   */
  const getCurrentContact = useCallback(async (): Promise<string | null> => {
    const response = await sendToWhatsAppTab<string>('GET_CURRENT_CONTACT');
    return response.success && response.data ? response.data : null;
  }, []);

  return {
    isActive: state.isActive,
    checking: state.checking,
    checkActive,
    open,
    sendMessage,
    openChat,
    getContacts,
    getCurrentContact,
  };
}
