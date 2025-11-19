/**
 * Utilities específicas para WhatsApp Web
 * Seletores e funções para interagir com o DOM do WhatsApp
 */

/**
 * Seletores do WhatsApp Web (podem mudar com atualizações)
 */
export const SELECTORS = {
  // Layout principal
  APP: '#app',
  PANE_SIDE: '[data-testid="chat-list"]',
  CONVERSATION_PANEL: '[data-testid="conversation-panel-wrapper"]',

  // Lista de chats
  CHAT_LIST: '[data-testid="chat-list"]',
  CHAT_ITEM: '[data-testid="list-item-"]', // Prefixo, precisa completar
  CHAT_TITLE: '[data-testid="cell-frame-title"]',

  // Área de mensagem
  MESSAGE_INPUT: '[data-testid="conversation-compose-box-input"]',
  SEND_BUTTON: '[data-testid="send"]',
  ATTACH_BUTTON: '[data-testid="attach"]',

  // Mensagens
  MESSAGE_LIST: '[data-testid="conversation-panel-messages"]',
  MESSAGE_IN: '[data-testid="msg-container"]',
  MESSAGE_OUT: '[data-testid="msg-container"]',

  // Contato
  CONTACT_INFO: '[data-testid="drawer-right"]',
  CONTACT_NAME: '[data-testid="conversation-info-header-chat-title"]',
  CONTACT_AVATAR: '[data-testid="default-user"]',

  // Menu e botões
  MENU_BUTTON: '[data-testid="menu"]',
  SEARCH_BUTTON: '[data-testid="search"]',
  NEW_CHAT_BUTTON: '[data-testid="new-chat"]',

  // Outros
  EMOJI_BUTTON: '[data-testid="emoji"]',
  GIF_BUTTON: '[data-testid="gif"]',
  VOICE_BUTTON: '[data-testid="ptt"]',
} as const;

/**
 * Espera elemento aparecer no DOM
 */
export async function waitForElement(
  selector: string,
  timeout: number = 10000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

/**
 * Verifica se o WhatsApp Web está carregado
 */
export function isWhatsAppLoaded(): boolean {
  return !!document.querySelector(SELECTORS.PANE_SIDE);
}

/**
 * Aguarda o WhatsApp Web carregar
 */
export async function waitForWhatsAppLoad(timeout: number = 30000): Promise<boolean> {
  const element = await waitForElement(SELECTORS.PANE_SIDE, timeout);
  return !!element;
}

/**
 * Obtém lista de chats visíveis
 */
export function getVisibleChats(): Element[] {
  const chatList = document.querySelector(SELECTORS.CHAT_LIST);
  if (!chatList) return [];

  return Array.from(chatList.querySelectorAll('[role="listitem"]'));
}

/**
 * Extrai informações de um elemento de chat
 */
export function extractChatInfo(chatElement: Element): {
  name: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
} | null {
  try {
    const nameElement = chatElement.querySelector('[dir="auto"][title]');
    const name = nameElement?.getAttribute('title') || nameElement?.textContent || '';

    const messageElement = chatElement.querySelector('[data-pre-plain-text]');
    const lastMessage = messageElement?.textContent || '';

    const timeElement = chatElement.querySelector('[data-testid="last-msg-time"]');
    const time = timeElement?.textContent || '';

    const unreadElement = chatElement.querySelector('[data-testid="unread-count"]');
    const unread = unreadElement ? parseInt(unreadElement.textContent || '0', 10) : 0;

    return {
      name,
      lastMessage,
      time,
      unread,
    };
  } catch (error) {
    console.error('Erro ao extrair informações do chat:', error);
    return null;
  }
}

/**
 * Clica em um chat para abri-lo
 */
export function openChat(chatElement: Element): void {
  const clickableElement = chatElement.querySelector('[role="listitem"]');
  if (clickableElement instanceof HTMLElement) {
    clickableElement.click();
  }
}

/**
 * Abre chat por nome
 */
export async function openChatByName(name: string): Promise<boolean> {
  const chats = getVisibleChats();

  for (const chat of chats) {
    const info = extractChatInfo(chat);
    if (info && info.name.toLowerCase().includes(name.toLowerCase())) {
      openChat(chat);
      return true;
    }
  }

  return false;
}

/**
 * Abre chat por número (usando link direto)
 */
export function openChatByNumber(number: string): void {
  const cleanNumber = number.replace(/\D/g, '');
  window.open(`https://web.whatsapp.com/send?phone=${cleanNumber}`, '_self');
}

/**
 * Obtém input de mensagem
 */
export function getMessageInput(): HTMLElement | null {
  return document.querySelector(SELECTORS.MESSAGE_INPUT);
}

/**
 * Define texto no input de mensagem
 */
export function setMessageText(text: string): boolean {
  const input = getMessageInput();
  if (!input) return false;

  // Simula input de usuário
  input.focus();

  // Define o texto
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);
  const event = new ClipboardEvent('paste', {
    clipboardData: dataTransfer,
    bubbles: true,
    cancelable: true,
  });

  input.dispatchEvent(event);

  return true;
}

/**
 * Envia mensagem
 */
export async function sendMessage(text: string, delay: number = 1000): Promise<boolean> {
  try {
    // Define o texto
    if (!setMessageText(text)) {
      return false;
    }

    // Aguarda um pouco
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Clica no botão de enviar
    const sendButton = document.querySelector(SELECTORS.SEND_BUTTON);
    if (sendButton instanceof HTMLElement) {
      sendButton.click();
      return true;
    }

    // Alternativa: pressionar Enter
    const input = getMessageInput();
    if (input) {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return false;
  }
}

/**
 * Obtém nome do contato atual
 */
export function getCurrentContactName(): string | null {
  const nameElement = document.querySelector(SELECTORS.CONTACT_NAME);
  return nameElement?.textContent || null;
}

/**
 * Obtém todas as mensagens visíveis
 */
export function getVisibleMessages(): Element[] {
  const messageList = document.querySelector(SELECTORS.MESSAGE_LIST);
  if (!messageList) return [];

  return Array.from(messageList.querySelectorAll('[data-testid="msg-container"]'));
}

/**
 * Extrai texto de uma mensagem
 */
export function extractMessageText(messageElement: Element): string {
  const textElement = messageElement.querySelector('[data-pre-plain-text] + div');
  return textElement?.textContent || '';
}

/**
 * Verifica se mensagem é enviada por mim
 */
export function isMessageFromMe(messageElement: Element): boolean {
  return messageElement.classList.contains('message-out');
}

/**
 * Scroll para o final da lista de mensagens
 */
export function scrollToBottom(): void {
  const messageList = document.querySelector(SELECTORS.MESSAGE_LIST);
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight;
  }
}

/**
 * Abre menu de contexto de um chat
 */
export function openChatContextMenu(chatElement: Element): void {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  chatElement.dispatchEvent(event);
}

/**
 * Detecta se é um grupo
 */
export function isGroupChat(): boolean {
  // Grupos geralmente têm ícone diferente ou indicador
  const header = document.querySelector(SELECTORS.CONVERSATION_PANEL);
  if (!header) return false;

  // Verificar se há indicador de grupo
  const groupIndicator = header.querySelector('[data-testid="group-participants"]');
  return !!groupIndicator;
}

/**
 * Obtém número de participantes do grupo
 */
export function getGroupParticipantCount(): number {
  const participantElement = document.querySelector('[data-testid="group-participants"]');
  if (!participantElement) return 0;

  const text = participantElement.textContent || '';
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Simula digitação (para parecer mais humano)
 */
export async function simulateTyping(text: string, wpm: number = 60): Promise<void> {
  const input = getMessageInput();
  if (!input) return;

  input.focus();

  // Calcula delay entre caracteres baseado em WPM
  const cpm = (wpm * 5) / 60; // Caracteres por segundo
  const delayPerChar = 1000 / cpm;

  for (const char of text) {
    const event = new KeyboardEvent('keydown', {
      key: char,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    // Adiciona variação aleatória no delay
    const randomDelay = delayPerChar * (0.5 + Math.random());
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
  }
}

/**
 * Extrai contatos de um grupo
 */
export async function extractGroupContacts(): Promise<string[]> {
  // Abrir info do grupo
  const headerElement = document.querySelector(SELECTORS.CONTACT_INFO);
  if (!headerElement) return [];

  // Clicar em participantes
  // TODO: Implementar lógica de extração de participantes

  return [];
}
