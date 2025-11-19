/**
 * Classes de erro customizadas
 */

/**
 * Erro base da aplicação
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly userMessage: string;

  constructor(message: string, code: string, userMessage?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage || message;
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string, userMessage?: string) {
    super(message, 'VALIDATION_ERROR', userMessage);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Erro de WhatsApp não conectado
 */
export class WhatsAppNotConnectedError extends AppError {
  constructor(message = 'WhatsApp Web não está aberto ou conectado') {
    super(message, 'WHATSAPP_NOT_CONNECTED', 'Abra o WhatsApp Web primeiro');
    this.name = 'WhatsAppNotConnectedError';
  }
}

/**
 * Erro de storage
 */
export class StorageError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 'STORAGE_ERROR', userMessage || 'Erro ao acessar dados');
    this.name = 'StorageError';
  }
}

/**
 * Erro de comunicação
 */
export class CommunicationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 'COMMUNICATION_ERROR', userMessage || 'Erro de comunicação');
    this.name = 'CommunicationError';
  }
}

/**
 * Erro de limite excedido
 */
export class LimitExceededError extends AppError {
  public readonly limit: number;
  public readonly current: number;

  constructor(message: string, limit: number, current: number, userMessage?: string) {
    super(
      message,
      'LIMIT_EXCEEDED',
      userMessage || `Limite de ${limit} excedido (atual: ${current})`
    );
    this.name = 'LimitExceededError';
    this.limit = limit;
    this.current = current;
  }
}

/**
 * Erro de timeout
 */
export class TimeoutError extends AppError {
  public readonly timeout: number;

  constructor(message: string, timeout: number, userMessage?: string) {
    super(
      message,
      'TIMEOUT_ERROR',
      userMessage || `Operação expirou após ${timeout}ms`
    );
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

/**
 * Verifica se é um erro conhecido
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extrai mensagem de erro amigável
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido';
}

/**
 * Extrai código de erro
 */
export function getErrorCode(error: unknown): string {
  if (isAppError(error)) {
    return error.code;
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Handler de erro global
 */
export function handleError(error: unknown, showToast?: (message: string) => void) {
  console.error('Error occurred:', error);

  const message = getErrorMessage(error);

  if (showToast) {
    showToast(message);
  }

  return message;
}
