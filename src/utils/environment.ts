/**
 * Detecção de ambiente WhatsApp
 * Detecta se está rodando em Web Browser, Desktop App, ou outros ambientes
 */

export type WhatsAppEnvironment = 'web' | 'desktop' | 'electron' | 'mobile' | 'unknown';

export interface EnvironmentInfo {
  type: WhatsAppEnvironment;
  isElectron: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  userAgent: string;
  platform: string;
}

/**
 * Detecta se está rodando em app Electron (WhatsApp Desktop ou similar)
 */
export function isElectronApp(): boolean {
  // Verifica se está no processo do Electron
  if (typeof window !== 'undefined' && window.process?.type === 'renderer') {
    return true;
  }

  // Verifica user agent
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('electron') > -1) {
    return true;
  }

  // Verifica global do Electron
  if (typeof window !== 'undefined' && (window as any).electron) {
    return true;
  }

  return false;
}

/**
 * Detecta o tipo de navegador
 */
export function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.indexOf('edg') > -1) return 'edge';
  if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg') === -1) return 'chrome';
  if (userAgent.indexOf('firefox') > -1) return 'firefox';
  if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) return 'safari';
  if (userAgent.indexOf('opera') > -1 || userAgent.indexOf('opr') > -1) return 'opera';

  return 'unknown';
}

/**
 * Detecta se é dispositivo móvel
 */
export function isMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

/**
 * Detecta o ambiente completo do WhatsApp
 */
export function detectWhatsAppEnvironment(): EnvironmentInfo {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const isElectron = isElectronApp();
  const isMobile = isMobileDevice();
  const browser = detectBrowser();

  let type: WhatsAppEnvironment = 'unknown';

  if (isElectron) {
    type = 'electron';
  } else if (isMobile) {
    type = 'mobile';
  } else if (window.location.hostname === 'web.whatsapp.com') {
    type = 'web';
  } else {
    type = 'desktop';
  }

  return {
    type,
    isElectron,
    isChrome: browser === 'chrome',
    isFirefox: browser === 'firefox',
    isSafari: browser === 'safari',
    isEdge: browser === 'edge',
    userAgent,
    platform,
  };
}

/**
 * Verifica se a extensão pode funcionar no ambiente atual
 */
export function canRunExtension(): boolean {
  const env = detectWhatsAppEnvironment();

  // Extensão Chrome só funciona no navegador
  if (env.isElectron) {
    console.warn('Verk CRM: Extensões Chrome não funcionam no app Electron');
    return false;
  }

  // Verifica se é navegador compatível
  if (!env.isChrome && !env.isEdge && !env.isFirefox) {
    console.warn('Verk CRM: Navegador pode não ser totalmente compatível');
    return false;
  }

  return true;
}

/**
 * Obtém nome amigável do ambiente
 */
export function getEnvironmentName(type?: WhatsAppEnvironment): string {
  const envType = type || detectWhatsAppEnvironment().type;

  const names: Record<WhatsAppEnvironment, string> = {
    web: 'WhatsApp Web',
    desktop: 'WhatsApp Desktop',
    electron: 'App Electron',
    mobile: 'WhatsApp Mobile',
    unknown: 'Ambiente Desconhecido',
  };

  return names[envType];
}

/**
 * Obtém informações de compatibilidade
 */
export function getCompatibilityInfo(): {
  compatible: boolean;
  warnings: string[];
  environment: string;
} {
  const env = detectWhatsAppEnvironment();
  const warnings: string[] = [];

  let compatible = true;

  if (env.isElectron) {
    compatible = false;
    warnings.push(
      'Esta extensão não funciona no WhatsApp Desktop nativo.',
      'Use WhatsApp Web no navegador para ter acesso ao Verk CRM.',
      'Alternativamente, use apps multi-messenger como Franz, Rambox ou Ferdi.'
    );
  }

  if (env.type === 'mobile') {
    compatible = false;
    warnings.push('Esta extensão é projetada para desktop/navegador.');
  }

  if (!env.isChrome && !env.isEdge) {
    warnings.push('Melhor compatibilidade com Chrome ou Edge.');
  }

  return {
    compatible,
    warnings,
    environment: getEnvironmentName(env.type),
  };
}

/**
 * Verifica se WhatsApp Desktop está instalado (Windows)
 */
export async function isWhatsAppDesktopInstalled(): Promise<boolean> {
  // Não podemos verificar isso diretamente do navegador por questões de segurança
  // Mas podemos verificar se há processos conhecidos rodando (limitado)

  // No navegador, não temos acesso ao sistema de arquivos
  // Esta função é mais útil para documentação
  return false;
}

/**
 * Retorna instruções para usar com WhatsApp Desktop
 */
export function getDesktopInstructions(): {
  title: string;
  options: Array<{ name: string; description: string; url?: string }>;
} {
  return {
    title: 'Como usar Verk CRM com WhatsApp Desktop',
    options: [
      {
        name: 'Opção 1: Use WhatsApp Web no navegador',
        description:
          'Abra https://web.whatsapp.com no Chrome ou Edge. A extensão funcionará automaticamente.',
        url: 'https://web.whatsapp.com',
      },
      {
        name: 'Opção 2: Use Franz',
        description:
          'Franz é um app multi-messenger baseado em Electron que suporta extensões Chrome.',
        url: 'https://meetfranz.com',
      },
      {
        name: 'Opção 3: Use Rambox',
        description:
          'Rambox permite adicionar WhatsApp Web e suporta extensões.',
        url: 'https://rambox.app',
      },
      {
        name: 'Opção 4: Use Ferdi',
        description:
          'Ferdi é um fork gratuito do Franz com suporte a extensões.',
        url: 'https://getferdi.com',
      },
    ],
  };
}

/**
 * Log de informações do ambiente (debug)
 */
export function logEnvironmentInfo(): void {
  const env = detectWhatsAppEnvironment();
  const compat = getCompatibilityInfo();

  console.group('🔍 Verk CRM - Informações do Ambiente');
  console.log('Tipo:', env.type);
  console.log('Navegador:', detectBrowser());
  console.log('Platform:', env.platform);
  console.log('User Agent:', env.userAgent);
  console.log('É Electron?', env.isElectron);
  console.log('É Chrome?', env.isChrome);
  console.log('Compatível?', compat.compatible);
  if (compat.warnings.length > 0) {
    console.warn('Avisos:', compat.warnings);
  }
  console.groupEnd();
}
