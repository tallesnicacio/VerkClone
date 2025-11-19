/**
 * Content Script
 * Injetado no WhatsApp Web para adicionar funcionalidades do Verk CRM
 */

import type { Contact, MessageResponse } from '../types';
import * as WhatsAppUtils from '../utils/whatsapp';
import { generateId } from '../utils/helpers';
import StorageManager from '../storage';
import {
  detectWhatsAppEnvironment,
  getCompatibilityInfo,
  logEnvironmentInfo,
  getEnvironmentName,
} from '../utils/environment';

console.log('🚀 Verk CRM - Content Script carregado');

// Detectar ambiente e verificar compatibilidade
const environment = detectWhatsAppEnvironment();
const compatibility = getCompatibilityInfo();

console.log(`📱 Ambiente detectado: ${getEnvironmentName(environment.type)}`);

if (!compatibility.compatible) {
  console.warn('⚠️ Verk CRM - Ambiente não compatível');
  compatibility.warnings.forEach((warning) => console.warn(`  - ${warning}`));
}

// Log de debug (pode ser removido em produção)
if (process.env.NODE_ENV === 'development') {
  logEnvironmentInfo();
}

/**
 * Classe principal para gerenciar a extensão no WhatsApp Web
 */
class VerkCRM {
  private initialized = false;
  private observer: MutationObserver | null = null;
  private contactCache: Map<string, Contact> = new Map();

  constructor() {
    this.init();
  }

  /**
   * Inicialização principal
   */
  async init() {
    console.log('⚙️ Inicializando Verk CRM...');

    try {
      // Aguardar o WhatsApp Web carregar completamente
      const loaded = await WhatsAppUtils.waitForWhatsAppLoad();

      if (!loaded) {
        console.error('❌ WhatsApp Web não carregou no tempo esperado');
        return;
      }

      console.log('✅ WhatsApp Web detectado!');

      // Iniciar observador de mudanças no DOM
      this.startDOMObserver();

      // Adicionar elementos de UI customizados
      this.injectCustomUI();

      // Sincronizar contatos
      await this.syncContacts();

      this.initialized = true;
      console.log('✅ Verk CRM inicializado com sucesso!');

      // Notificar background que o content script está ativo
      chrome.runtime.sendMessage({
        type: 'CONTENT_SCRIPT_READY',
        payload: { url: window.location.href },
      });
    } catch (error) {
      console.error('❌ Erro ao inicializar Verk CRM:', error);
    }
  }

  /**
   * Inicia observador de mudanças no DOM
   */
  private startDOMObserver() {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Detectar novos chats
          this.handleChatListChanges(mutation);

          // Detectar novas mensagens
          this.handleNewMessages(mutation);
        }
      }
    });

    const targetNode = document.body;
    this.observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    console.log('👁️ Observador do DOM iniciado');
  }

  /**
   * Trata mudanças na lista de chats
   */
  private handleChatListChanges(mutation: MutationRecord) {
    const chatList = document.querySelector(WhatsAppUtils.SELECTORS.CHAT_LIST);
    if (chatList && mutation.target === chatList) {
      // Chats foram atualizados
      this.syncContacts();
    }
  }

  /**
   * Trata novas mensagens
   */
  private handleNewMessages(mutation: MutationRecord) {
    const messageList = document.querySelector(WhatsAppUtils.SELECTORS.MESSAGE_LIST);
    if (messageList && mutation.target === messageList) {
      // Nova mensagem detectada
      console.log('📩 Nova mensagem detectada');
    }
  }

  /**
   * Sincroniza contatos do WhatsApp com o storage
   */
  private async syncContacts() {
    try {
      const chats = WhatsAppUtils.getVisibleChats();
      console.log(`📇 Sincronizando ${chats.length} contatos...`);

      for (const chatElement of chats) {
        const chatInfo = WhatsAppUtils.extractChatInfo(chatElement);
        if (chatInfo && chatInfo.name) {
          const contact: Contact = {
            id: generateId(),
            name: chatInfo.name,
            phoneNumber: '', // Será extraído posteriormente
            lastMessage: chatInfo.lastMessage,
            lastMessageTime: Date.now(),
            isGroup: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          this.contactCache.set(chatInfo.name, contact);
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar contatos:', error);
    }
  }

  /**
   * Injeta UI customizada no WhatsApp Web
   */
  private injectCustomUI() {
    console.log('🎨 Injetando UI customizada...');

    // Criar botão de acesso rápido
    this.createQuickAccessButton();

    // Adicionar badges e indicadores nos chats
    this.addChatBadges();
  }

  /**
   * Cria botão flutuante de acesso rápido
   */
  private createQuickAccessButton() {
    // Verificar se já existe
    if (document.getElementById('verk-quick-access')) {
      return;
    }

    const button = document.createElement('button');
    button.id = 'verk-quick-access';

    // Badge de ambiente
    const envBadge = compatibility.compatible
      ? ''
      : '<span style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">!</span>';

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      ${envBadge}
    `;
    button.title = `Verk CRM - ${getEnvironmentName(environment.type)}`;
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
      this.toggleCRMPanel();
    });

    document.body.appendChild(button);
    console.log('✅ Botão de acesso rápido criado');
  }

  /**
   * Adiciona badges customizados nos chats
   */
  private addChatBadges() {
    // TODO: Implementar badges (tags, prioridade, etc.)
  }

  /**
   * Abre/fecha o painel do CRM
   */
  private toggleCRMPanel() {
    console.log('🎛️ Alternando painel do CRM...');

    // Se ambiente não é compatível, mostrar aviso
    if (!compatibility.compatible) {
      this.showCompatibilityWarning();
      return;
    }

    // TODO: Implementar painel lateral
    // Por enquanto, apenas mostra uma mensagem
    this.showToast('Painel do CRM em desenvolvimento!', 'info');
  }

  /**
   * Mostra aviso de compatibilidade
   */
  private showCompatibilityWarning() {
    const modal = document.createElement('div');
    modal.className = 'verk-modal-overlay';
    modal.innerHTML = `
      <div class="verk-modal" style="max-width: 500px; margin: 20px;">
        <div style="text-align: center; padding: 20px;">
          <svg style="width: 64px; height: 64px; color: #f59e0b; margin: 0 auto 16px;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 12px;">
            Ambiente não compatível
          </h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            ${compatibility.environment}
          </p>
          <div style="text-align: left; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="font-weight: 600; color: #92400e; margin-bottom: 8px;">⚠️ Avisos:</p>
            ${compatibility.warnings.map((w) => `<p style="color: #78350f; font-size: 14px; margin: 4px 0;">• ${w}</p>`).join('')}
          </div>
          <button
            onclick="this.closest('.verk-modal-overlay').remove()"
            class="verk-button verk-button-primary"
            style="width: 100%; padding: 12px; background: linear-gradient(135deg, #128C7E 0%, #25D366 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"
          >
            Entendi
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Fechar ao clicar no overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Mostra toast/notificação temporária
   */
  private showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const toast = document.createElement('div');
    toast.className = 'verk-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      font-size: 14px;
      font-weight: 500;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Extrai informações de todos os contatos visíveis
   */
  public async extractAllContacts(): Promise<Contact[]> {
    const contacts: Contact[] = [];
    const chats = WhatsAppUtils.getVisibleChats();

    for (const chatElement of chats) {
      const chatInfo = WhatsAppUtils.extractChatInfo(chatElement);
      if (chatInfo && chatInfo.name) {
        const contact: Contact = {
          id: generateId(),
          name: chatInfo.name,
          phoneNumber: '', // Será extraído posteriormente
          lastMessage: chatInfo.lastMessage,
          lastMessageTime: Date.now(),
          isGroup: false,
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        contacts.push(contact);

        // Salvar no storage
        await StorageManager.saveContact(contact);
      }
    }

    return contacts;
  }

  /**
   * Envia mensagem para um número
   */
  public async sendMessage(number: string, message: string): Promise<boolean> {
    try {
      console.log(`📤 Enviando mensagem para ${number}...`);

      // Abrir chat do número
      WhatsAppUtils.openChatByNumber(number);

      // Aguardar o chat abrir
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Enviar mensagem
      const sent = await WhatsAppUtils.sendMessage(message);

      if (sent) {
        console.log('✅ Mensagem enviada com sucesso!');
        this.showToast('Mensagem enviada!', 'success');
      } else {
        console.error('❌ Falha ao enviar mensagem');
        this.showToast('Erro ao enviar mensagem', 'error');
      }

      return sent;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      this.showToast('Erro ao enviar mensagem', 'error');
      return false;
    }
  }

  /**
   * Abre chat por nome ou número
   */
  public async openChat(nameOrNumber: string): Promise<boolean> {
    if (/^\d+$/.test(nameOrNumber)) {
      // É um número
      WhatsAppUtils.openChatByNumber(nameOrNumber);
      return true;
    } else {
      // É um nome
      return await WhatsAppUtils.openChatByName(nameOrNumber);
    }
  }

  /**
   * Obtém contato atual
   */
  public getCurrentContact(): string | null {
    return WhatsAppUtils.getCurrentContactName();
  }

  /**
   * Verifica se está inicializado
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

// Instância global
let verkCRMInstance: VerkCRM | null = null;

// Inicializar a extensão quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    verkCRMInstance = new VerkCRM();
  });
} else {
  verkCRMInstance = new VerkCRM();
}

// Listener para mensagens do background/popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Content script recebeu mensagem:', message);

  (async () => {
    try {
      switch (message.type) {
        case 'PING':
          sendResponse({
            success: true,
            data: {
              message: 'Content script ativo',
              initialized: verkCRMInstance?.isInitialized() || false,
            },
          });
          break;

        case 'SEND_MESSAGE':
          if (verkCRMInstance) {
            const { number, text } = message.payload;
            const sent = await verkCRMInstance.sendMessage(number, text);
            sendResponse({ success: sent });
          } else {
            sendResponse({ success: false, error: 'Verk CRM não inicializado' });
          }
          break;

        case 'OPEN_CHAT':
          if (verkCRMInstance) {
            const { nameOrNumber } = message.payload;
            const opened = await verkCRMInstance.openChat(nameOrNumber);
            sendResponse({ success: opened });
          } else {
            sendResponse({ success: false, error: 'Verk CRM não inicializado' });
          }
          break;

        case 'GET_CONTACTS':
          if (verkCRMInstance) {
            const contacts = await verkCRMInstance.extractAllContacts();
            sendResponse({ success: true, data: contacts });
          } else {
            sendResponse({ success: false, error: 'Verk CRM não inicializado' });
          }
          break;

        case 'GET_CURRENT_CONTACT':
          if (verkCRMInstance) {
            const contact = verkCRMInstance.getCurrentContact();
            sendResponse({ success: true, data: contact });
          } else {
            sendResponse({ success: false, error: 'Verk CRM não inicializado' });
          }
          break;

        default:
          sendResponse({ success: false, error: 'Comando desconhecido' });
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  })();

  // Retorna true para indicar que a resposta será assíncrona
  return true;
});

console.log('✅ Verk CRM Content Script listeners configurados');
