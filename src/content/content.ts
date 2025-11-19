/**
 * Content Script
 * Injetado no WhatsApp Web para adicionar funcionalidades
 */

console.log('Verk CRM - Content Script carregado');

// Classe principal para gerenciar a extensão no WhatsApp Web
class VerkCRM {
  private initialized = false;
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  async init() {
    console.log('Inicializando Verk CRM...');

    // Aguardar o WhatsApp Web carregar completamente
    await this.waitForWhatsAppLoad();

    this.initialized = true;
    console.log('Verk CRM inicializado com sucesso!');

    // Iniciar observador de mudanças no DOM
    this.startDOMObserver();

    // Adicionar elementos de UI customizados
    this.injectCustomUI();
  }

  /**
   * Aguarda o WhatsApp Web carregar completamente
   */
  private async waitForWhatsAppLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        // Verifica se a sidebar do WhatsApp está presente
        const sidebar = document.querySelector('[data-testid="chat-list"]');

        if (sidebar) {
          clearInterval(checkInterval);
          console.log('WhatsApp Web carregado!');
          resolve();
        }
      }, 500);

      // Timeout de 30 segundos
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Timeout ao aguardar carregamento do WhatsApp');
        resolve();
      }, 30000);
    });
  }

  /**
   * Inicia observador de mudanças no DOM
   */
  private startDOMObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Aqui podemos reagir a mudanças no DOM
          // Útil para detectar novos chats, mensagens, etc.
        }
      });
    });

    const targetNode = document.body;
    this.observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Injeta UI customizada no WhatsApp Web
   */
  private injectCustomUI() {
    console.log('Injetando UI customizada...');

    // Criar botão de acesso rápido ao Verk CRM
    this.createQuickAccessButton();
  }

  /**
   * Cria botão flutuante de acesso rápido
   */
  private createQuickAccessButton() {
    const button = document.createElement('button');
    button.id = 'verk-quick-access';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `;
    button.title = 'Verk CRM';
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 30px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
      cursor: pointer;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: white;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
    });

    button.addEventListener('click', () => {
      this.openCRMPanel();
    });

    document.body.appendChild(button);
  }

  /**
   * Abre o painel do CRM
   */
  private openCRMPanel() {
    console.log('Abrindo painel do CRM...');

    // Por enquanto, apenas abre o popup da extensão
    // Futuramente, podemos criar um painel lateral integrado
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  }

  /**
   * Extrai informações de um contato
   */
  public getContactInfo(element: Element): any {
    // TODO: Implementar extração de informações do contato
    return {
      name: '',
      number: '',
      lastMessage: '',
      timestamp: ''
    };
  }

  /**
   * Envia mensagem para um número
   */
  public async sendMessage(number: string, message: string): Promise<boolean> {
    // TODO: Implementar envio de mensagem
    console.log(`Enviando mensagem para ${number}: ${message}`);
    return true;
  }
}

// Inicializar a extensão quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VerkCRM();
  });
} else {
  new VerkCRM();
}

// Listener para mensagens do background/popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script recebeu mensagem:', message);

  switch (message.type) {
    case 'PING':
      sendResponse({ success: true, message: 'Content script ativo' });
      break;

    default:
      sendResponse({ success: false, error: 'Comando desconhecido' });
  }

  return false;
});
