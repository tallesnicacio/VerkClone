/**
 * Tipos e interfaces do Verk CRM
 */

// ==================== CONTATOS ====================

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  isGroup?: boolean;
  tags?: string[];
  customFields?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface ContactNote {
  id: string;
  contactId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// ==================== TAGS ====================

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

// ==================== ABAS PERSONALIZADAS ====================

export interface CustomTab {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  filters?: TabFilter[];
  contacts: string[]; // Contact IDs
  order: number;
  createdAt: number;
}

export interface TabFilter {
  type: 'tag' | 'lastMessage' | 'custom';
  value: any;
}

// ==================== KANBAN ====================

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  createdAt: number;
}

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  order: number;
  contacts: string[]; // Contact IDs
}

// ==================== LEMBRETES ====================

export interface Reminder {
  id: string;
  contactId: string;
  contactName: string;
  title: string;
  message: string;
  dueDate: number;
  recurring?: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  notified: boolean;
  createdAt: number;
}

// ==================== RESPOSTAS RÁPIDAS ====================

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category?: string;
  shortcut?: string;
  variables?: string[]; // Variables like {name}, {date}, etc.
  createdAt: number;
  usageCount: number;
}

// ==================== ENVIO EM MASSA ====================

export interface BulkCampaign {
  id: string;
  name: string;
  message: string;
  contacts: string[]; // Contact IDs or phone numbers
  scheduledFor?: number;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  progress: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  settings: BulkCampaignSettings;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface BulkCampaignSettings {
  delayMin: number; // segundos
  delayMax: number; // segundos
  dailyLimit: number;
  personalizeMessage: boolean;
  skipDuplicates: boolean;
}

export interface BulkMessageLog {
  id: string;
  campaignId: string;
  contactId: string;
  phoneNumber: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: number;
  error?: string;
}

// ==================== CONFIGURAÇÕES ====================

export interface Settings {
  language: 'pt-BR' | 'en' | 'es';
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  bulkMessageDelay: number;
  dailyMessageLimit: number;
  autoBackup: boolean;
  aiProvider?: 'openai' | 'anthropic' | 'gemini';
  aiApiKey?: string;
  googleCalendarEnabled: boolean;
  googleCalendarToken?: string;
}

// ==================== AI ASSISTANT ====================

export interface AIConversation {
  id: string;
  contactId?: string;
  messages: AIMessage[];
  createdAt: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: string;
  createdAt: number;
}

// ==================== ANALYTICS ====================

export interface Analytics {
  totalContacts: number;
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  conversationsByDay: Record<string, number>;
  messagesByHour: Record<string, number>;
  topContacts: Array<{ contactId: string; messageCount: number }>;
  lastUpdated: number;
}

// ==================== STORAGE ====================

export interface StorageData {
  contacts: Record<string, Contact>;
  notes: Record<string, ContactNote>;
  tags: Record<string, Tag>;
  customTabs: Record<string, CustomTab>;
  kanbanBoards: Record<string, KanbanBoard>;
  reminders: Record<string, Reminder>;
  quickReplies: Record<string, QuickReply>;
  bulkCampaigns: Record<string, BulkCampaign>;
  bulkMessageLogs: Record<string, BulkMessageLog>;
  settings: Settings;
  aiConversations: Record<string, AIConversation>;
  aiPromptTemplates: Record<string, AIPromptTemplate>;
  analytics: Analytics;
  version: string;
  installedAt: number;
  lastBackup?: number;
}

// ==================== MENSAGENS ====================

export type MessageType =
  | 'PING'
  | 'SHOW_NOTIFICATION'
  | 'SCHEDULE_REMINDER'
  | 'GET_STORAGE'
  | 'SET_STORAGE'
  | 'SEND_MESSAGE'
  | 'GET_CONTACTS'
  | 'EXTRACT_CONTACTS'
  | 'OPEN_CHAT'
  | 'OPEN_POPUP'
  | 'OPEN_OPTIONS';

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== WHATSAPP ====================

export interface WhatsAppContact {
  id: string;
  name: string;
  number: string;
  pushname?: string;
  isMyContact?: boolean;
  isGroup?: boolean;
  profilePic?: string;
}

export interface WhatsAppMessage {
  id: string;
  body: string;
  timestamp: number;
  from: string;
  to: string;
  isFromMe: boolean;
  type: 'chat' | 'image' | 'video' | 'audio' | 'document' | 'ptt' | 'sticker';
}

export interface WhatsAppChat {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  timestamp: number;
}
