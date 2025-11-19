# Verk CRM Clone

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**CRM completo para WhatsApp Web** - Extensão Chrome para gerenciamento de leads, vendas e atendimento.

## 📋 Sobre

Extensão desenvolvida para uso pessoal que adiciona funcionalidades completas de CRM ao WhatsApp Web, permitindo organizar contatos, gerenciar leads, automatizar respostas e muito mais.

## ✨ Funcionalidades Planejadas

### ✅ Gerenciamento de Contatos
- [x] Abas personalizadas para organização
- [x] Sistema de tags e categorias
- [x] Notas detalhadas por contato
- [x] Histórico de interações

### 📊 Visão Kanban
- [x] Board customizável de vendas
- [x] Pipeline de leads (Lead → Negociação → Fechado)
- [x] Arrastar e soltar contatos
- [x] Métricas por estágio

### 🔔 Lembretes e Agendamentos
- [x] Criar lembretes por contato
- [x] Notificações push
- [x] Notificações integradas no WhatsApp
- [x] Integração com Google Calendar
- [x] Lembretes recorrentes

### ⚡ Respostas Rápidas
- [x] Banco de mensagens pré-definidas
- [x] Categorização de respostas
- [x] Atalhos de teclado
- [x] Variáveis dinâmicas (nome, data, etc.)

### 📤 Envio em Massa
- [x] Campanhas para múltiplos contatos
- [x] Importação via CSV
- [x] Personalização por contato
- [x] Agendamento de envios
- [x] Proteção anti-ban (delays inteligentes)
- [x] Relatórios de entrega

### 📥 Exportação de Dados
- [x] Exportar todos os contatos
- [x] Exportar contatos de grupos
- [x] Múltiplos formatos (CSV, JSON, VCard, Excel)
- [x] Filtros customizados

### 🤖 Assistente AI
- [x] Sugestões de resposta inteligentes
- [x] Geração automática de textos
- [x] Tradução instantânea
- [x] Resumo de conversas
- [x] Análise de sentimento
- [x] Classificação automática de leads

### 🛠️ Utilidades
- [x] Enviar para número não salvo
- [x] Blur de mensagens (para tutoriais)
- [x] Multi-idioma (PT, EN, ES)
- [x] Tema escuro/claro
- [x] Atalhos de teclado

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ e npm
- Google Chrome ou navegador baseado em Chromium

### Desenvolvimento

1. **Clone o repositório**
```bash
git clone https://github.com/tallesnicacio/VerkClone.git
cd VerkClone
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o build**
```bash
npm run build
```

4. **Carregue a extensão no Chrome**
   - Abra `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `dist/`

5. **Desenvolvimento com hot reload**
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
VerkClone/
├── src/
│   ├── background/          # Service Worker (background script)
│   │   └── background.ts
│   ├── content/             # Content scripts (injetados no WhatsApp)
│   │   ├── content.ts
│   │   └── content.css
│   ├── popup/               # Interface do popup
│   │   ├── popup.html
│   │   ├── popup.tsx
│   │   └── popup.css
│   ├── options/             # Página de configurações
│   │   ├── options.html
│   │   ├── options.tsx
│   │   └── options.css
│   ├── components/          # Componentes React reutilizáveis
│   ├── utils/               # Funções utilitárias
│   ├── storage/             # Gerenciamento de dados locais
│   ├── i18n/                # Internacionalização
│   └── assets/              # Recursos (imagens, ícones, etc.)
├── public/
│   ├── manifest.json        # Manifest da extensão
│   └── icons/               # Ícones da extensão
├── dist/                    # Build final (gerado)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: Chrome Storage API
- **i18n**: react-i18next
- **Charts**: Recharts (para analytics)
- **CSV Parsing**: PapaParse

## 📝 Roadmap de Desenvolvimento

### Fase 0: Setup Inicial ✅
- [x] Estrutura base do projeto
- [x] Configurações de build
- [x] Manifest V3
- [x] Background worker
- [x] Content script básico
- [x] Popup inicial

### Fase 1: Infraestrutura Core (Em Progresso)
- [ ] Sistema de injeção no WhatsApp Web
- [ ] Camada de storage local
- [ ] Sistema de comunicação entre componentes
- [ ] Sistema de observação do DOM

### Fase 2-14: Features (Próximas etapas)
Ver plano completo no documento de planejamento.

## ⚠️ Avisos Importantes

### Segurança
- **Todos os dados são armazenados localmente** no seu navegador
- **Nenhuma informação é enviada para servidores externos**
- **Código open source** - você pode auditar tudo

### Uso Responsável
- ⚠️ O envio em massa deve ser usado com **moderação**
- ⚠️ Respeite os **limites do WhatsApp** para evitar bloqueios
- ⚠️ Use delays de **60-90 segundos** entre mensagens
- ⚠️ Não ultrapasse **100 mensagens/dia** no início

### Disclaimer
Esta é uma extensão **independente** e **não oficial**. Não temos afiliação com:
- WhatsApp Inc.
- Meta Platforms, Inc.
- Verk CRM original

O WhatsApp pode alterar sua plataforma a qualquer momento, o que pode quebrar funcionalidades.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuindo

Como este é um projeto pessoal, contribuições não estão sendo aceitas no momento.

## 📞 Suporte

Para questões ou problemas:
1. Verifique a documentação acima
2. Revise o código-fonte
3. Abra uma issue no repositório

## 🎯 Status do Projeto

🚧 **Em desenvolvimento ativo** - Fase 0 concluída, Fase 1 em andamento.

---

**Desenvolvido com ❤️ para uso pessoal**

## 📌 Notas para Desenvolvimento

### Próximos Passos
1. ✅ Criar estrutura inicial
2. ⏳ Implementar detecção do WhatsApp Web
3. ⏳ Criar sistema de storage
4. ⏳ Adicionar UI de abas personalizadas
5. ⏳ Implementar sistema de notas

### Ícones Necessários
Os seguintes ícones precisam ser adicionados em `public/icons/`:
- `icon16.png` (16x16px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

Sugestão: Use ícones com as cores do WhatsApp (#25D366) e temática de CRM.

### Variáveis de Ambiente (futuras)
Para funcionalidades com APIs externas (Google Calendar, AI), será necessário:
- Google OAuth credentials
- OpenAI/Anthropic API keys
- Configurar em página de opções
