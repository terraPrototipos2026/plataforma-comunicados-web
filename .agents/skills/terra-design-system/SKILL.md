---
name: terra-design-system
description: >-
  Guía y especificación exhaustiva del Sistema de Diseño TERRA (Warm Modern Retail / Tactile Kiosk).
  Aplica arquitectura de tokens semánticos, Tailwind CSS v4 / v3, diseño táctil mobile-first y kiosco,
  paleta vino/crema, modo oscuro cálido, alto contraste accesible y componentes ergonómicos con escalabilidad en rem.
---

# Skill: terra-design-system

## Propósito
Guiar el diseño, maquetación e implementación frontend de interfaces bajo el **Sistema de Diseño TERRA (Warm Modern Retail / Tactile Kiosk)**. Garantiza coherencia visual, fidelidad de tokens, ergonomía táctil (kioscos y móviles), soporte de modos claro/oscuro/alto contraste y accesibilidad estricta basada en unidades `rem`.

---

## 1. Fundamentos y Filosofía Visual

- **Concepto:** *Warm Modern Retail*. Sofisticado, táctil, limpio y acogedor. Fusión de tonos vino/borgoña profundos con fondos crema orgánicos, tarjetas blancas elevadas, bordes sutiles y micro-sombras teñidas de color.
- **Paradigma:** Mobile-first y terminales táctiles (kioscos 1024 × 768 px en orientación horizontal y vertical, smartphones desde 360 px).
- **Zonas de contacto táctil (Touch Targets):**
  - Modo estándar: Mínimo **$\ge 44 \times 44\text{ px}$**.
  - Modo accesible: Mínimo **$\ge 48 \times 48\text{ px}$** (o botón flotante de $56 \times 56\text{ px}$).
- **Escalabilidad por Accesibilidad (100% en `rem`):**
  - Ningún tamaño de fuente, padding estructural o radio debe definirse en píxeles fijos.
  - Al escalar `html` al 125% o 150%, la interfaz debe fluir sin desbordamientos de texto ni scroll horizontal.
- **Zonas Seguras (Safe Areas):**
  - Encabezados: `pt-[env(safe-area-inset-top)]`
  - Pies y barras flotantes: `pb-[env(safe-area-inset-bottom)]`

---

## 2. Tokens Semánticos y Paleta de Colores

### 2.1. Tokens en Modo Claro (Base)

| Token Semántico | Valor Hex | Uso / Propósito |
| :--- | :--- | :--- |
| `--color-primario` | `#a6192e` | Vino TERRA principal, botones CTA, acentos activos |
| `--color-primario-hover` | `#7e1122` | Estado hover/active de botones e interactivos |
| `--color-primario-claro` | `#fdeeee` | Fondos de badges, selección suave, alertas bajas |
| `--color-primario-suave` | `#f5e7ea` | Fondos de chips secundarios y acentos tenues |
| `--color-sobre-primario` | `#ffffff` | Texto e iconos sobre fondos primarios |
| `--color-fondo` | `#fcf9f8` | Fondo general de la página (`body`) con textura sutil |
| `--color-superficie-1` | `#ffffff` | Tarjetas, contenedores principales, modales |
| `--color-superficie-2` | `#faf7f5` | Paneles secundarios, barras de herramientas |
| `--color-superficie-crema`| `#faf5ef` | Secciones alternas cálidas y fondos destacados |
| `--color-texto-principal` | `#231a16` | Café carbón cálido (nunca `#000000` puro) |
| `--color-texto-suave` | `#7a6f68` | Texto secundario, descripciones y subtítulos |
| `--color-texto-placeholder`| `#cbb7ba` | Textos tenues, placeholders y separadores |
| `--color-borde` | `#eadfd3` | Bordes estándar de tarjetas y divisores |
| `--color-borde-suave` | `#e7e5e4` | Bordes tenues de inputs y cabeceras |
| `--color-borde-hover` | `#e0cfc5` | Estado hover de bordes interactivos |
| `--color-exito` | `#1e7e46` | Confirmación, stock disponible (fondo `#e4f4e9`, borde `#bfe3ca`) |
| `--color-alerta` | `#c0392b` | Errores, alertas y validaciones (fondo `#fff0ef`) |
| `--color-oferta` | `#e0304a` | Badges de descuento, promociones (acento claro `#ffb3bd`) |
| `--color-aviso-oro` | `#fff7df` | Avisos importantes (texto `#b27600`, borde `#f0e0b8`) |

### 2.2. Tokens en Modo Oscuro (`html[data-theme="dark"]`)
Evita el negro puro y el gris neutro frío. Se basa en tostado/café oscuro cálido:

| Token Semántico | Valor Hex | Propósito |
| :--- | :--- | :--- |
| `--color-fondo` | `#151110` | Café tostado profundo (sin imagen de textura) |
| `--color-superficie-1` | `#1e1917` | Tarjetas y contenedores |
| `--color-superficie-2` | `#282120` | Superficies secundarias |
| `--color-superficie-3` | `#332a28` | Superficies terciarias elevadas |
| `--color-borde` | `#3d3330` | Líneas divisorias y bordes |
| `--color-texto-principal` | `#f4ede8` | Blanco cálido para máxima legibilidad |
| `--color-texto-suave` | `#b5a79f` | Tono tostado suave secundario |
| `--color-oferta` | `#e0304a` | Acento y promociones (secundario `#ffb3bd`) |
| `--color-exito` | `#58c986` | Verde menta cálido (fondo `#16311f`) |

### 2.3. Modo Alto Contraste (`html.a11y-contraste`)
- **Fondo:** `#000000` (Negro absoluto).
- **Texto y Bordes:** `#ffffff` (Blanco absoluto con borde visible mínimo 1.5px).
- **Interactivos y Acentos:** Amarillo canario de alta luminancia `#ffd400`.
- **Éxito:** Verde menta brillante `#7cff9b`.
- **Imágenes:** Los contenedores de producto preservan fondo blanco para no cortar imágenes con `object-fit: contain`.

---

## 3. Tipografía y Jerarquía Visual

- **Fuente Primaria:** `"Manrope", system-ui, -apple-system, sans-serif`.
- **Fuente Accesible:** `"Atkinson Hyperlegible", sans-serif` (inyectada bajo demanda).

### Escala Tipográfica en `rem`:
- `3xs`: `0.6rem` (~9.6 px)
- `2xs`: `0.7rem` (~11.2 px)
- `xs`: `0.78rem` (~12.5 px)
- `sm`: `0.85rem` (~13.6 px)
- `md`: `0.92rem` (~14.7 px)
- `lg`: `1.05rem` (~16.8 px)
- `xl`: `1.15rem` (~18.4 px)
- `icono-lg`: `1.375rem` (~22 px)
- `titulo-movil`: `1.7rem` (~27.2 px)
- `titulo`: `2.1rem` (~33.6 px)
- `hero-display`: `clamp(2.4rem, 6vw, 4.8rem)` con `leading-[1.05]` y `tracking-tight`.

### Antetítulos (Eyebrows):
```html
<span class="text-xs uppercase font-extrabold tracking-[0.18em] text-primario">
  CATEGORÍA O SECCIÓN
</span>
```

---

## 4. Radios, Bordes y Sombras

### Radios de Borde:
- `rounded-terra-chico`: `0.625rem` (10 px) $\rightarrow$ Tags pequeños, medidas, chips.
- `rounded-terra-boton`: `0.75rem` (12 px) $\rightarrow$ Botones rectangulares suaves, acciones.
- `rounded-terra-campo`: `0.875rem` (14 px) $\rightarrow$ Inputs, textareas, selects.
- `rounded-terra`: `1rem` (16 px) $\rightarrow$ Paneles intermedios.
- `rounded-terra-tarjeta`: `1.125rem` (18 px) $\rightarrow$ Tarjetas de catálogo y carruseles.
- `rounded-terra-modal`: `1.25rem` (20 px) $\rightarrow$ Modales, sheets y diálogos.
- `rounded-full`: `9999px` $\rightarrow$ Botones CTA principales, chips de filtro, FABs.
- **Borde sutil:** `1.5px solid var(--color-borde)` (`border-[1.5px]`).

### Sombras Teñidas de Color (Micro-sombras Vino):
```css
/* Sombra base de tarjeta */
--shadow-terra-card: 0 10px 30px -4px rgba(142, 23, 42, 0.05), 0 4px 16px -2px rgba(0, 0, 0, 0.03);

/* Sombra flotante / CTA principal */
--shadow-terra-flotante: 0 12px 24px rgba(166, 25, 46, 0.35);

/* Elevación intermedia */
--shadow-terra: 0 20px 48px rgba(166, 25, 46, 0.10);
--shadow-terra-sm: 0 8px 24px rgba(166, 25, 46, 0.12);

/* Anillo de foco accesible */
--shadow-terra-anillo: 0 0 0 4px rgba(166, 25, 46, 0.12);
```

---

## 5. Implementación en Tailwind CSS

### 5.1. Variables Globales CSS (`globals.css` / `index.css`)
```css
@layer base {
  :root {
    --color-primario: #a6192e;
    --color-primario-hover: #7e1122;
    --color-primario-claro: #fdeeee;
    --color-primario-suave: #f5e7ea;
    --color-sobre-primario: #ffffff;
    --color-fondo: #fcf9f8;
    --color-superficie-1: #ffffff;
    --color-superficie-2: #faf7f5;
    --color-superficie-crema: #faf5ef;
    --color-texto-principal: #231a16;
    --color-texto-suave: #7a6f68;
    --color-texto-placeholder: #cbb7ba;
    --color-borde: #eadfd3;
    --color-borde-suave: #e7e5e4;
    --color-borde-hover: #e0cfc5;
    --color-exito: #1e7e46;
    --color-alerta: #c0392b;
    --color-oferta: #e0304a;
  }

  html[data-theme="dark"] {
    --color-fondo: #151110;
    --color-superficie-1: #1e1917;
    --color-superficie-2: #282120;
    --color-superficie-3: #332a28;
    --color-borde: #3d3330;
    --color-texto-principal: #f4ede8;
    --color-texto-suave: #b5a79f;
    --color-oferta: #e0304a;
    --color-exito: #58c986;
  }

  html.a11y-contraste {
    --color-fondo: #000000;
    --color-superficie-1: #000000;
    --color-superficie-2: #111111;
    --color-borde: #ffffff;
    --color-texto-principal: #ffffff;
    --color-texto-suave: #ffffff;
    --color-primario: #ffd400;
    --color-sobre-primario: #000000;
    --color-exito: #7cff9b;
  }

  body {
    background-color: var(--color-fondo);
    color: var(--color-texto-principal);
    font-family: 'Manrope', system-ui, -apple-system, sans-serif;
  }
}
```

### 5.2. Mapeo en Tailwind v4 (`@theme inline`) o v3 (`tailwind.config.js`)
```javascript
// tailwind.config.js (o bloque @theme en v4)
export default {
  theme: {
    extend: {
      colors: {
        primario: {
          DEFAULT: 'var(--color-primario)',
          hover: 'var(--color-primario-hover)',
          claro: 'var(--color-primario-claro)',
          suave: 'var(--color-primario-suave)',
        },
        superficie: {
          1: 'var(--color-superficie-1)',
          2: 'var(--color-superficie-2)',
          crema: 'var(--color-superficie-crema)',
        },
        texto: {
          principal: 'var(--color-texto-principal)',
          suave: 'var(--color-texto-suave)',
          placeholder: 'var(--color-texto-placeholder)',
        },
        borde: {
          DEFAULT: 'var(--color-borde)',
          suave: 'var(--color-borde-suave)',
          hover: 'var(--color-borde-hover)',
        },
        exito: 'var(--color-exito)',
        alerta: 'var(--color-alerta)',
        oferta: 'var(--color-oferta)',
      },
      borderRadius: {
        'terra-chico': '0.625rem',
        'terra-boton': '0.75rem',
        'terra-campo': '0.875rem',
        'terra': '1rem',
        'terra-tarjeta': '1.125rem',
        'terra-modal': '1.25rem',
      },
      boxShadow: {
        'terra-card': '0 10px 30px -4px rgba(142, 23, 42, 0.05), 0 4px 16px -2px rgba(0, 0, 0, 0.03)',
        'terra-flotante': '0 12px 24px rgba(166, 25, 46, 0.35)',
        'terra': '0 20px 48px rgba(166, 25, 46, 0.10)',
        'terra-anillo': '0 0 0 4px rgba(166, 25, 46, 0.12)',
      },
    },
  },
};
```

---

## 6. Módulos y Componentes Clave

### 6.1. Sticky Topbar (Con Glassmorphism y zona táctil amplia)
- Altura: `min-h-[4rem]` (64 px en desktop), `min-h-[3.75rem]` (60 px en móvil).
- Clases clave:
```html
<header class="sticky top-0 z-50 min-h-[4rem] bg-white/95 dark:bg-[#1e1917]/95 backdrop-blur-sm border-b border-[#e7e5e4] dark:border-[#3d3330] pt-[env(safe-area-inset-top)] px-4 sm:px-6 flex items-center justify-between">
  <!-- Logo a la izquierda -->
  <div class="flex items-center gap-3">
    <img src="/logo.svg" alt="TERRA" class="h-8 md:h-10 w-auto" />
  </div>

  <!-- Barra de herramientas con píldoras y circulares -->
  <div class="flex items-center gap-2 sm:gap-3">
    <button class="h-10 px-5 rounded-full bg-primario text-white font-medium hover:bg-primario-hover transition-colors shadow-terra-flotante flex items-center gap-2 text-sm">
      <span>Iniciar Sesión</span>
    </button>
    <button aria-label="Cambiar tema" class="w-10 h-10 rounded-full border border-borde flex items-center justify-center hover:bg-superficie-2 transition-colors">
      🌙
    </button>
  </div>
</header>
```

### 6.2. Botón CTA Principal de Dos Líneas con Píldora
```html
<button class="group h-14 px-6 rounded-full bg-primario hover:bg-primario-hover text-white shadow-terra-flotante transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 text-left">
  <div class="w-9 h-9 rounded-full bg-white/16 flex items-center justify-center shrink-0">
    <svg class="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>
  <div class="flex flex-col">
    <span class="text-xs font-semibold uppercase tracking-wider text-white/80">Comenzar compra</span>
    <span class="text-sm font-bold">Ver catálogo completo</span>
  </div>
</button>
```

### 6.3. Tarjeta de Catálogo de Producto
```html
<article class="group rounded-terra-tarjeta bg-superficie-1 border border-borde p-3.5 shadow-terra-card transition-all duration-200 hover:-translate-y-1 hover:shadow-terra flex flex-col justify-between">
  <!-- Contenedor de imagen siempre blanco puro -->
  <div class="relative w-full aspect-square rounded-terra-chico bg-white overflow-hidden flex items-center justify-center p-3 mb-3 border border-borde-suave">
    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-oferta text-white text-[0.7rem] font-bold">
      OFERTA
    </span>
    <img src="/producto.png" alt="Producto" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
  </div>

  <div class="flex flex-col flex-1">
    <span class="text-2xs font-extrabold uppercase tracking-wider text-primario mb-1">Categoría</span>
    <h3 class="text-sm font-bold text-texto-principal line-clamp-2 leading-snug mb-2">Nombre del Producto</h3>
    <div class="mt-auto flex items-baseline justify-between pt-2 border-t border-borde-suave">
      <div class="flex flex-col">
        <span class="text-2xs text-texto-suave">Precio normal</span>
        <span class="text-base font-extrabold text-texto-principal">$24.990</span>
      </div>
      <button aria-label="Agregar al carrito" class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-primario text-white flex items-center justify-center hover:bg-primario-hover transition-colors shadow-terra-sm">
        +
      </button>
    </div>
  </div>
</article>
```

### 6.4. Botones Flotantes (FAB Stack) y Accesibilidad
```html
<!-- FABs esquina inferior derecha -->
<aside class="fixed right-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3">
  <button aria-label="Escanear QR" class="w-12 h-12 rounded-full bg-primario text-white shadow-terra-flotante flex items-center justify-center hover:-translate-y-0.5 transition-transform">
    📷
  </button>
  <button aria-label="Ver Carrito" class="w-13 h-13 rounded-full bg-primario text-white shadow-terra-flotante flex items-center justify-center hover:-translate-y-0.5 transition-transform relative">
    🛒
    <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-oferta text-white text-2xs font-bold flex items-center justify-center">2</span>
  </button>
  <button aria-label="Asistente virtual" class="w-14 h-14 rounded-full bg-primario text-white shadow-terra-flotante flex items-center justify-center hover:-translate-y-0.5 transition-transform">
    🤖
  </button>
</aside>

<!-- Botón accesible flotante esquina inferior izquierda -->
<aside class="fixed left-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40">
  <button aria-label="Opciones de accesibilidad" class="w-14 h-14 rounded-full bg-white dark:bg-[#1e1917] border-2 border-primario text-primario shadow-terra flex items-center justify-center hover:scale-105 transition-transform text-xl">
    ♿
  </button>
</aside>
```

---

## 7. Reglas de Oro para Desarrolladores y Agentes

1. **Nunca usar negro puro (`#000000`) en modo claro o modo oscuro:** Emplear café carbón `#231a16` para texto en modo claro y café tostado `#151110` para fondo oscuro. Solo el modo alto contraste usa negro puro.
2. **Respetar el contenedor blanco en imágenes de producto:** Los productos utilizan `object-fit: contain` sobre fondos blancos puros (`bg-white`) para evitar franjas o cortes antiestéticos.
3. **Escalar en unidades relativas:** Emplear `rem` para tipografías, paddings, alturas y radios; nunca píxeles fijos que rompan el escalado a 150%.
4. **Área táctil mínima:** Cada botón, enlace interactivo o selector debe medir al menos 44 px de alto y ancho (`min-w-[44px] min-h-[44px]`).
5. **Respetar reducción de movimiento:** Todo elemento con animación debe incluir `motion-reduce:animate-none` o respetar `@media (prefers-reduced-motion: reduce)`.

