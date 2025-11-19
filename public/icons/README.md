# Ícones da Extensão

## Arquivos Necessários

A extensão requer os seguintes ícones:
- `icon16.png` (16x16px) - Barra de ferramentas
- `icon48.png` (48x48px) - Página de extensões
- `icon128.png` (128x128px) - Chrome Web Store

## Como Gerar os Ícones

### Opção 1: Usar o SVG fornecido

O arquivo `icon.svg` contém o design do ícone. Você pode convertê-lo para PNG usando:

**Online:**
1. Abra https://svg2png.com/ ou https://cloudconvert.com/svg-to-png
2. Faça upload do `icon.svg`
3. Gere as 3 versões nos tamanhos corretos

**Com Inkscape (Linux/Mac/Windows):**
```bash
# Instalar Inkscape
sudo apt install inkscape  # Ubuntu/Debian
brew install inkscape      # macOS

# Gerar os ícones
inkscape icon.svg --export-filename=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-filename=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

**Com ImageMagick:**
```bash
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Opção 2: Criar Manualmente

Use qualquer ferramenta de design (Figma, Photoshop, GIMP, etc.) para criar:
- Fundo com gradiente verde (#128C7E → #25D366)
- Ícone de CRM/usuários em branco
- Cantos arredondados
- Formato PNG com transparência

## Design Guidelines

- **Cores principais:**
  - Verde escuro: `#128C7E`
  - Verde claro: `#25D366`
  - Branco: `#FFFFFF`

- **Estilo:**
  - Moderno e minimalista
  - Bordas arredondadas (border-radius: ~20%)
  - Alto contraste para visibilidade

- **Símbolos sugeridos:**
  - Ícone de pessoas/usuários (representa CRM)
  - Símbolo de chat/mensagem (representa WhatsApp)
  - Combinação dos dois
