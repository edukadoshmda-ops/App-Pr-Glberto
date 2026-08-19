# 🎨 DESIGN TOKENS - ELITEFLOW

## Documento de Referência de Design

---

## 📋 PALETA DE CORES

### Cores Principais

#### Verde Militar (Primária)
```
Nome: --primary
Valor: #4d7a63
RGB: 77, 122, 99
Uso: Detalhes, menu ativo, bordas, ícones
Onde é usado: Logo, sidebar, botões, links ativos, badges
```

#### Dourado (Acentos)
```
Nome: --gold
Valor: #D4AF37
RGB: 212, 175, 55
Uso: Destaque, botões, acentos especiais
Onde é usado: Botões primários, tags especiais, detalhes premium
```

#### Azul Escuro (Títulos)
```
Nome: --dark-blue
Valor: #1a2c3e
RGB: 26, 44, 62
Uso: Textos principais, títulos
Onde é usado: H1, H2, H3, labels, nomes
```

#### Branco (Fundo)
```
Nome: --panel
Valor: #ffffff
RGB: 255, 255, 255
Uso: Painéis, cards, fundo de elementos
Onde é usado: Cards, sections, buttons, inputs
```

#### Cinza Neutro (Secundário)
```
Nome: --muted
Valor: #5c6f68
RGB: 92, 111, 104
Uso: Textos secundários, subtítulos
Onde é usado: Descrições, metadados, informações adicionais
```

#### Texto Body
```
Nome: --text
Valor: #162b2a
RGB: 22, 43, 42
Uso: Textos principais do corpo
Onde é usado: Parágrafos, descrições principais
```

#### Fundo da Página
```
Nome: --bg
Valor: #f7f8f5
RGB: 247, 248, 245
Uso: Fundo da página
Onde é usado: Background de toda a aplicação
```

#### Bordas (Lines)
```
Nome: --line
Valor: #e8ece7
RGB: 232, 236, 231
Uso: Bordas, separadores
Onde é usado: Borders de cards, separadores
```

---

## 🎭 CORES ADICIONAIS

### Variações Verdes
```
Verde Escuro: #315744 (para hover em botões)
Verde Claro: rgba(77, 122, 99, 0.08) (fundo dos botões secundários)
Verde Semi: rgba(77, 122, 99, 0.2) (hover leve)
Verde com Transparência: rgba(77, 122, 99, 0.15) (backgrounds)
```

### Variações Douradas
```
Dourado com Transparência: rgba(212, 175, 55, 0.25) (sombras)
Dourado Claro: rgba(212, 175, 55, 0.1) (backgrounds)
```

### Brancas/Transparentes
```
Branco com Transparência: rgba(255, 255, 255, 0.1) (overlays)
Preto com Transparência: rgba(0, 0, 0, 0.05) (sombras leves)
```

---

## 🏙️ SOMBRAS

### Shadow Padrão (Primária)
```css
box-shadow: 0 18px 40px rgba(17, 27, 23, 0.06);
Uso: Cards no estado normal
```

### Shadow Hover (Elevada)
```css
box-shadow: 0 24px 48px rgba(77, 122, 99, 0.1);
Uso: Cards em hover
```

### Shadow Botão Primário
```css
box-shadow: 0 8px 18px rgba(77, 122, 99, 0.24);
Uso: Botões em repouso
```

### Shadow Botão Hover
```css
box-shadow: 0 16px 36px rgba(212, 175, 55, 0.25);
Uso: Botões em hover
```

### Shadow de Entrada (Login)
```css
box-shadow: 0 18px 48px rgba(77, 122, 99, 0.12);
Uso: Container de login
```

### Shadow Leve (Inputs)
```css
box-shadow: 0 8px 22px rgba(77, 122, 99, 0.08);
Uso: Inputs em foco
```

---

## 📐 TIPOGRAFIA

### Font Principal
```
Família: Inter
Origem: Google Fonts
Weights: 400, 500, 600, 700, 800
URL: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap
```

### Tamanhos Padrão
```
H1: 36px (Títulos principais)
H2: 28px (Subtítulos)
H3: 24px (Títulos de seção)
Body: 16px (Texto padrão)
Small: 14px (Textos pequenos)
Label: 12px (Rótulos)
```

### Weights Utilizados
```
400: Regular (Body, descrições)
500: Medium (Subtextos, labels)
600: Semi-Bold (Subtítulos, destaques)
700: Bold (Títulos, nomes)
800: Extra Bold (Títulos principais)
```

---

## 📏 ESPAÇAMENTO

### Padding Padrão
```css
Small: 8px
Medium: 12px
Default: 18px
Large: 22px
XL: 26px
```

### Gaps em Grids
```css
Grid Gap: 18px (padrão)
Card Gap: 20px (entre cards)
Group Gap: 22px (entre grupos)
```

### Margens
```css
Elemento a Elemento: 16px
Seção a Seção: 32px
Topo/Fundo: 20px
```

---

## 🎬 ANIMAÇÕES

### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
Duração: 0.6s
Timing: ease-out
Uso: Cards, elementos de entrada
```

### Slide In Down
```css
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
Duração: 0.7s (headers), 0.8s (logo)
Timing: ease-out
Uso: Headers, logos, títulos
```

### Slide In Left
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
Duração: 0.6s
Timing: ease-out
Uso: Menu items, elementos laterais
```

### Pulse
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}
Duração: 1s
Timing: ease-in-out
Uso: Ícones destacados, elementos em espera
```

### Glow
```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(77, 122, 99, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(77, 122, 99, 0.6);
  }
}
Duração: 2s
Timing: ease-in-out
Uso: Cards em destaque, elementos especiais
```

---

## ⏱️ TRANSIÇÕES PADRÃO

### Timing Function Padrão
```css
cubic-bezier(0.4, 0, 0.2, 1)
```
Material Design Standard (Easing Out)

### Durações Padrão
```
Rápido: 0.2s (clicks imediatos)
Médio: 0.35s (hover, interações)
Lento: 0.6s (entrada de elementos)
Extra Lento: 0.8s+ (animações de página)
```

### Transições Específicas

#### Menu Items
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
Efeito: background-color, color, transform, box-shadow
```

#### Buttons
```css
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
Efeito: background, box-shadow, transform
```

#### Cards
```css
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
Efeito: box-shadow, transform
```

#### Inputs
```css
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
Efeito: border-color, box-shadow, transform
```

#### Links
```css
transition: all 0.3s ease;
Efeito: color, border-color
```

---

## 🎯 HOVER EFFECTS

### Cards
```css
transform: translateY(-6px to -8px);
box-shadow: Elevada
Opacidade: 1
```

### Buttons
```css
transform: translateY(-3px);
box-shadow: Aumentada (0 16px 36px)
Overlay: rgba(255, 255, 255, 0.1)
```

### Menu Items
```css
background: Gradiente (rgba(77, 122, 99, 0.08))
transform: translateX(2px)
border-left: Verde
```

### Links
```css
color: #D4AF37 (dourado)
text-decoration: Sem mudança
border-bottom: Verde
```

### Checkboxes
```css
transform: scale(1.12);
background: Verde com transparência
```

---

## 📱 BREAKPOINTS

### Desktop
```css
@media (min-width: 980px)
- Sidebar sempre visível
- Grid 2 colunas
- Layout completo
```

### Tablet
```css
@media (min-width: 768px) and (max-width: 979px)
- Sidebar adaptável
- Grid pode ser 1-2 colunas
- Menu reorganizado
```

### Mobile
```css
@media (max-width: 767px)
- Full width
- Grid 1 coluna
- Menu colapsável
- Sidebar opcional
```

---

## 🔢 VALORES ESPECÍFICOS

### Border Radius
```css
Pequeno: 4px
Médio: 8px
Grande: 12px
Muito Grande (pills): 999px
Padrão em cards: 12px
```

### Border Width
```css
Fino: 1px (padrão)
Médio: 2px (destaque)
Grosso: 3px (ênfase)
```

### Altura de Elementos
```
Inputs: 48px
Buttons: 48px
Menu items: 40px
Cards: Auto
```

### Largura Máxima
```
Contenedor: 1200px
Sidebar: 240px
Main panel: Calc(100% - 240px)
Form: 400px
```

---

## 🎨 COMBINAÇÕES DE CORES

### Card Premium
```
Fundo: #ffffff
Border: #e8ece7
Sombra: 0 18px 40px rgba(17, 27, 23, 0.06)
Título: #1a2c3e
Texto: #162b2a
Accent: #4d7a63
```

### Botão Primário
```
Fundo: #4d7a63 (+ hover #315744)
Texto: #ffffff
Overlay: rgba(255, 255, 255, 0)
Sombra: 0 8px 18px rgba(77, 122, 99, 0.24)
```

### Botão Secundário
```
Fundo: rgba(77, 122, 99, 0.08)
Texto: #4d7a63
Border: #e8ece7
Sombra: Nenhuma
```

### Input Padrão
```
Fundo: #ffffff
Border: #e8ece7
Texto: #162b2a
Placeholder: #5c6f68
Focus Border: #4d7a63
```

### Menu Ativo
```
Fundo: rgba(77, 122, 99, 0.08)
Border-left: #4d7a63 (4px)
Texto: #1a2c3e
Ícone: #4d7a63
```

---

## 📊 ESCALA DE CORES

### Verde (Escala)
```
Verde Escuro: #2a5c49
Verde Primário: #4d7a63
Verde Claro: #6d9b85
Verde Muito Claro: rgba(77, 122, 99, 0.08)
```

### Dourado (Escala)
```
Dourado Escuro: #b8860b
Dourado Primário: #D4AF37
Dourado Claro: #e8c850
Dourado Muito Claro: rgba(212, 175, 55, 0.1)
```

### Neutros (Escala)
```
Preto: #000000
Cinza Escuro: #1a2c3e
Cinza Médio: #5c6f68
Cinza Claro: #e8ece7
Branco: #ffffff
```

---

## 🎯 USAR OS TOKENS

### Em CSS
```css
/* Variables já definidas em :root */
.elemento {
  color: var(--dark-blue);
  background: var(--panel);
  box-shadow: var(--shadow);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Para Customizar
Edite `:root { }` no início do style.css

### Para Novos Elementos
Use sempre os tokens definidos, não valores hardcoded

---

## 📝 REFERÊNCIA RÁPIDA

| Token | Valor | Uso |
|-------|-------|-----|
| --primary | #4d7a63 | Verde |
| --gold | #D4AF37 | Dourado |
| --dark-blue | #1a2c3e | Azul |
| --text | #162b2a | Texto |
| --panel | #ffffff | Branco |
| --bg | #f7f8f5 | Fundo |
| --line | #e8ece7 | Bordas |
| --muted | #5c6f68 | Cinza |

---

**Design Tokens v1.0**  
**Versão**: EliteFlow 1.0 Premium  
**Data**: 14 de Agosto de 2026  
**Status**: Completo e Aprovado
