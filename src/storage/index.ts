/**
 * Sistema de Storage - Wrapper para Chrome Storage API
 * Fornece interface type-safe e métodos auxiliares
 */

import type { StorageData, Contact, ContactNote, Tag, CustomTab, KanbanBoard, Reminder, QuickReply, BulkCampaign, Settings } from '../types';

// Valores padrão para inicialização
const DEFAULT_SETTINGS: Settings = {
  language: 'pt-BR',
  notifications: true,
  theme: 'auto',
  bulkMessageDelay: 60,
  dailyMessageLimit: 100,
  autoBackup: true,
  googleCalendarEnabled: false,
};

const DEFAULT_STORAGE_DATA: Partial<StorageData> = {
  contacts: {},
  notes: {},
  tags: {},
  customTabs: {},
  kanbanBoards: {},
  reminders: {},
  quickReplies: {},
  bulkCampaigns: {},
  bulkMessageLogs: {},
  settings: DEFAULT_SETTINGS,
  aiConversations: {},
  aiPromptTemplates: {},
  analytics: {
    totalContacts: 0,
    totalConversations: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    conversationsByDay: {},
    messagesByHour: {},
    topContacts: [],
    lastUpdated: Date.now(),
  },
  version: '1.0.0',
  installedAt: Date.now(),
};

/**
 * Classe principal de gerenciamento de storage
 */
export class StorageManager {
  /**
   * Inicializa o storage com valores padrão
   */
  static async initialize(): Promise<void> {
    const existing = await chrome.storage.local.get(['version']);

    if (!existing.version) {
      await chrome.storage.local.set(DEFAULT_STORAGE_DATA);
      console.log('Storage inicializado com valores padrão');
    }
  }

  /**
   * Obtém dados do storage
   */
  static async get<K extends keyof StorageData>(
    keys: K | K[]
  ): Promise<Pick<StorageData, K>> {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const result = await chrome.storage.local.get(keysArray);
    return result as Pick<StorageData, K>;
  }

  /**
   * Define dados no storage
   */
  static async set<K extends keyof StorageData>(
    data: Pick<StorageData, K>
  ): Promise<void> {
    await chrome.storage.local.set(data);
  }

  /**
   * Remove dados do storage
   */
  static async remove(keys: string | string[]): Promise<void> {
    await chrome.storage.local.remove(keys);
  }

  /**
   * Limpa todo o storage
   */
  static async clear(): Promise<void> {
    await chrome.storage.local.clear();
    await this.initialize();
  }

  /**
   * Exporta todos os dados do storage
   */
  static async exportAll(): Promise<StorageData> {
    const data = await chrome.storage.local.get(null);
    return data as StorageData;
  }

  /**
   * Importa dados para o storage
   */
  static async importAll(data: Partial<StorageData>): Promise<void> {
    await chrome.storage.local.set(data);
  }

  // ==================== CONTATOS ====================

  static async getContacts(): Promise<Record<string, Contact>> {
    const { contacts } = await this.get('contacts');
    return contacts || {};
  }

  static async getContact(id: string): Promise<Contact | null> {
    const contacts = await this.getContacts();
    return contacts[id] || null;
  }

  static async saveContact(contact: Contact): Promise<void> {
    const contacts = await this.getContacts();
    contacts[contact.id] = {
      ...contact,
      updatedAt: Date.now(),
    };
    await this.set({ contacts });
  }

  static async deleteContact(id: string): Promise<void> {
    const contacts = await this.getContacts();
    delete contacts[id];
    await this.set({ contacts });
  }

  static async searchContacts(query: string): Promise<Contact[]> {
    const contacts = await this.getContacts();
    const searchLower = query.toLowerCase();

    return Object.values(contacts).filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchLower) ||
        contact.phoneNumber.includes(searchLower)
    );
  }

  // ==================== NOTAS ====================

  static async getNotes(contactId: string): Promise<ContactNote[]> {
    const { notes } = await this.get('notes');
    return Object.values(notes || {}).filter((note) => note.contactId === contactId);
  }

  static async saveNote(note: ContactNote): Promise<void> {
    const { notes } = await this.get('notes');
    const allNotes = notes || {};
    allNotes[note.id] = {
      ...note,
      updatedAt: Date.now(),
    };
    await this.set({ notes: allNotes });
  }

  static async deleteNote(id: string): Promise<void> {
    const { notes } = await this.get('notes');
    const allNotes = notes || {};
    delete allNotes[id];
    await this.set({ notes: allNotes });
  }

  // ==================== TAGS ====================

  static async getTags(): Promise<Record<string, Tag>> {
    const { tags } = await this.get('tags');
    return tags || {};
  }

  static async saveTag(tag: Tag): Promise<void> {
    const tags = await this.getTags();
    tags[tag.id] = tag;
    await this.set({ tags });
  }

  static async deleteTag(id: string): Promise<void> {
    const tags = await this.getTags();
    delete tags[id];
    await this.set({ tags });
  }

  // ==================== ABAS PERSONALIZADAS ====================

  static async getCustomTabs(): Promise<Record<string, CustomTab>> {
    const { customTabs } = await this.get('customTabs');
    return customTabs || {};
  }

  static async saveCustomTab(tab: CustomTab): Promise<void> {
    const customTabs = await this.getCustomTabs();
    customTabs[tab.id] = tab;
    await this.set({ customTabs });
  }

  static async deleteCustomTab(id: string): Promise<void> {
    const customTabs = await this.getCustomTabs();
    delete customTabs[id];
    await this.set({ customTabs });
  }

  // ==================== KANBAN ====================

  static async getKanbanBoards(): Promise<Record<string, KanbanBoard>> {
    const { kanbanBoards } = await this.get('kanbanBoards');
    return kanbanBoards || {};
  }

  static async saveKanbanBoard(board: KanbanBoard): Promise<void> {
    const kanbanBoards = await this.getKanbanBoards();
    kanbanBoards[board.id] = board;
    await this.set({ kanbanBoards });
  }

  static async deleteKanbanBoard(id: string): Promise<void> {
    const kanbanBoards = await this.getKanbanBoards();
    delete kanbanBoards[id];
    await this.set({ kanbanBoards });
  }

  // ==================== LEMBRETES ====================

  static async getReminders(): Promise<Record<string, Reminder>> {
    const { reminders } = await this.get('reminders');
    return reminders || {};
  }

  static async getActiveReminders(): Promise<Reminder[]> {
    const reminders = await this.getReminders();
    return Object.values(reminders).filter((r) => !r.completed && r.dueDate > Date.now());
  }

  static async saveReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getReminders();
    reminders[reminder.id] = reminder;
    await this.set({ reminders });
  }

  static async deleteReminder(id: string): Promise<void> {
    const reminders = await this.getReminders();
    delete reminders[id];
    await this.set({ reminders });
  }

  // ==================== RESPOSTAS RÁPIDAS ====================

  static async getQuickReplies(): Promise<Record<string, QuickReply>> {
    const { quickReplies } = await this.get('quickReplies');
    return quickReplies || {};
  }

  static async saveQuickReply(reply: QuickReply): Promise<void> {
    const quickReplies = await this.getQuickReplies();
    quickReplies[reply.id] = reply;
    await this.set({ quickReplies });
  }

  static async deleteQuickReply(id: string): Promise<void> {
    const quickReplies = await this.getQuickReplies();
    delete quickReplies[id];
    await this.set({ quickReplies });
  }

  static async incrementQuickReplyUsage(id: string): Promise<void> {
    const quickReplies = await this.getQuickReplies();
    if (quickReplies[id]) {
      quickReplies[id].usageCount++;
      await this.set({ quickReplies });
    }
  }

  // ==================== CAMPANHAS ====================

  static async getBulkCampaigns(): Promise<Record<string, BulkCampaign>> {
    const { bulkCampaigns } = await this.get('bulkCampaigns');
    return bulkCampaigns || {};
  }

  static async saveBulkCampaign(campaign: BulkCampaign): Promise<void> {
    const bulkCampaigns = await this.getBulkCampaigns();
    bulkCampaigns[campaign.id] = campaign;
    await this.set({ bulkCampaigns });
  }

  static async deleteBulkCampaign(id: string): Promise<void> {
    const bulkCampaigns = await this.getBulkCampaigns();
    delete bulkCampaigns[id];
    await this.set({ bulkCampaigns });
  }

  // ==================== CONFIGURAÇÕES ====================

  static async getSettings(): Promise<Settings> {
    const { settings } = await this.get('settings');
    return settings || DEFAULT_SETTINGS;
  }

  static async updateSettings(updates: Partial<Settings>): Promise<void> {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...updates };
    await this.set({ settings: newSettings });
  }

  // ==================== LISTENERS ====================

  /**
   * Adiciona listener para mudanças no storage
   */
  static addListener(
    callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
  ): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        callback(changes);
      }
    });
  }
}

// Inicializar storage quando o módulo é carregado
if (typeof chrome !== 'undefined' && chrome.storage) {
  StorageManager.initialize().catch(console.error);
}

export default StorageManager;
