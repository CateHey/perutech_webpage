# PeruTechAU — Documento Maestro
## Requerimientos, dirección de diseño e implementación del sitio web y el formulario de miembros

**Versión:** 4.2 — documento único. Fusiona el documento de requerimientos y el brief de implementación, conciliados con lo que ya está construido. Incorpora el directorio de miembros y la revisión de contenido del board del 27-08-2026.
**Fecha:** agosto 2026
**Alcance:** los dos entregables digitales — (A) sitio web y (B) formulario de miembros. Fuera de alcance: GRx, MVP del sector minero y demás temas del hilo del board.

> **Cómo leer este documento.** Las secciones 1 a 7 son *qué* se necesita y *por qué* (para el board). Las secciones 8 a 13 son *cómo* está hecho y cómo se mantiene (para quien desarrolla). La sección 14 registra qué cambió entre versiones para que nada se dé por perdido.

---

## 0. Estado del proyecto

| Componente | Estado |
|-----------|--------|
| Sitio web, cuatro pestañas | ✅ Construido y funcionando |
| Formulario de registro integrado al diseño | ✅ Construido |
| Directorio de miembros (publicación a las 24 h) | ✅ Construido; funciona en modo de prueba hasta conectar la hoja |
| Script de base de datos (Google Apps Script) | ✅ Escrito, falta instalarlo en la hoja |
| Logos y fotos de la directiva | ✅ Cargados; faltan bios, aval de logos y consentimientos escritos |
| Paleta de color | ⏳ Tres opciones listas, falta que el board elija |
| Contenido real (textos, logos, fotos, workshops) | ⏳ Ver §10 |
| Dominio y publicación | ⏳ Pendiente de decidir quién paga y con qué cuenta |

**Costo total del proyecto: el dominio.** Repositorio público en GitHub + GitHub Pages + Google Sheets = $0. Único gasto recurrente: ~AUD 16–19 al año.

---

## 1. Resumen de entregables

| ID | Entregable | Responsable | Estado |
|----|-----------|-------------|--------|
| A | Sitio web de PeruTechAU | Catherine Varas (desarrollo) · Jhordy Novoa (ciberseguridad y mantenimiento) | Construido, falta contenido real |
| B | Formulario de registro de miembros | Angel (creación original) · board (revisión) · Catherine (integración a la web) | Integrado al sitio; falta conectar la hoja |

**Dependencia clave:** B alimenta a A. El formulario recoge el estado de residencia de cada miembro, y ese dato es el que enciende el contador de cada capítulo en el mapa.

---

## 2. Directiva (confirmada)

| Nombre | Cargo | Notas |
|--------|-------|-------|
| Marcos Burgos | Head | — |
| Yajaira Navarro | General Director | Vicepresidencia; compromiso enfocado en Queensland |
| Catherine Varas | IT Lead · Creadora de la web | Autora del sitio; pasa a apoyo ligero tras el lanzamiento |
| Jhordy Novoa | Software & Cybersecurity Engineer | Asume mantenimiento y actualizaciones |

**Pendiente por integrante:** foto cuadrada (mín. 800×800 px), bio de máximo 240 caracteres, LinkedIn (opcional) y consentimiento explícito para publicar nombre e imagen.

> El sitio ya funciona sin fotos: si falta la imagen, muestra las iniciales sobre un degradado. Nunca queda un hueco roto.

---

## 3. Requerimientos funcionales del sitio

| ID | Requerimiento | Detalle | Prioridad | Estado |
|----|--------------|---------|-----------|--------|
| RF-W-01 | Landing page | Explica quiénes somos. Incluye **misión** y **visión**. | Alta | ✅ |
| RF-W-02 | Respaldo institucional visible | Indicar de forma visible el respaldo de la **Embajada del Perú** y de **PROMPERÚ**. | Alta | ✅ (faltan los logos) |
| RF-W-03 | Página de Capítulos Regionales | Capítulos por región/estado de Australia. | Alta | ✅ |
| RF-W-04 | Solo Brisbane habilitado | Únicamente Brisbane (QLD) activo y navegable. | Alta | ✅ |
| RF-W-05 | Capítulos futuros visibles pero inactivos | Etiqueta «Próximamente», no seleccionables. **Propósito:** motivar a pares de otras regiones a abrir sus capítulos. **Nunca ocultarlos.** | Alta | ✅ |
| RF-W-06 | Directiva | En la misma página de capítulos. | Alta | ✅ |
| RF-W-07 | Página de Servicios | Un servicio por ahora; nombre pendiente de Yajaira. | Alta | ✅ |
| RF-W-08 | Workshops realizados | Cada uno enlazado a su publicación de **LinkedIn**. | Alta | ✅ (faltan los enlaces) |
| RF-W-09 | Identidad sin fines de lucro | Declarar que la organización es sin fines de lucro. **No** afirmar que todo sea gratuito: habrá servicios con costo (invitados externos que cobran, obsequios de reconocimiento, comida). La gratuidad se declara servicio por servicio. | Media | ✅ (corregido el 27-08-2026) |
| RF-W-10 | Contacto y redes | Footer con correo y LinkedIn de PeruTechAU. | Media | ✅ |
| RF-W-11 | Responsive | Mobile-first; el tráfico llega desde WhatsApp y LinkedIn. | Alta | ✅ |
| RF-W-12 | Formulario de registro en el sitio | Registro de miembros con el diseño propio de la página, sin formularios incrustados de terceros. | Alta | ✅ |

### Sitemap — cuatro pestañas

```
index.html       Inicio      hero · quiénes somos · misión y visión · pilares ·
                             workshops · respaldo institucional · llamado a registrarse
capitulos.html   Capítulos   mapa de capítulos · fichas por estado · directiva
servicios.html   Servicios   servicios y programas para miembros
unete.html       Únete       formulario de registro y aviso de privacidad
```

La navegación superior es la misma en las cuatro y marca la pestaña activa. Blog, galería y calendario quedan para v2.

> **Conciliación con la v3.** El documento anterior definía tres páginas. Se agregó la cuarta (`unete.html`) cuando el formulario pasó a formar parte del sitio en vez de vivir en Google Forms. La directiva sigue dentro de la página de capítulos, tal como pidió el board.

---

## 4. Sitio de referencia — perusv.org

Revisado en agosto 2026. Construido en Webflow, sin código reutilizable.

**Qué se adoptó:** el patrón de bloques con enlace externo (imagen + título + descripción + link), que resuelve los workshops enlazados a LinkedIn sin necesidad de montar un blog. También la declaración de «sin fines de lucro» integrada en el bloque narrativo en vez de una nota al pie.

**Qué no se copió:** el sitio de referencia tiene *lorem ipsum* sin reemplazar en la sección de novedades y un bloque de plantilla duplicado que dice «Get Early Access to MarketingConf». También mezcla español e inglés sin criterio. Son errores de publicación apresurada; por eso «cero placeholder» quedó como criterio de aceptación (§13.6).

**Nuestro diferenciador:** PeruSV no tiene capítulos regionales. Ese es el elemento propio de PeruTechAU y es la pieza más memorable del sitio.

---

## 5. Dirección de arte

### 5.1 Concepto

> **«El mapa que falta por llenar.»**

PeruTechAU no es una comunidad terminada: es una comunidad **en expansión**, con un solo capítulo encendido y siete estados esperando a alguien que los abra. Toda la dirección visual se organiza alrededor de esa tensión. El sitio no es un folleto institucional cerrado, sino un tablero al que le faltan piezas — y esa ausencia es el llamado a la acción.

### 5.2 Paleta — tres opciones a decidir

El board pidió azul con degradado, moderno y futurista, y descartó el gris. **Ninguna de las tres paletas usa gris:** los tonos apagados son azules claros.

Cada una se elige cambiando una sola palabra en el `<html>` de las cuatro páginas: `data-tema="bandera"`.

**1 · Bandera** — azul noche, rojo peruano y blanco. El degradado va de azul a rojo pasando por magenta profundo. La más institucional; la que más se lee como «Perú».

| Token | Hex |
|-------|-----|
| `--abismo` | `#040B2E` |
| `--profundo` | `#0A1856` |
| `--azul` | `#2E5BFF` |
| `--cian` (azul claro) | `#5B8CFF` |
| `--violeta` (puente) | `#B02A6B` |
| `--grana` (rojo peruano) | `#FF2D4E` |
| `--niebla` (textos) | `#C9D8FF` |

**2 · Pacífico** ⭐ *recomendada* — azul océano, verde esmeralda de acento y rojo reservado solo al capítulo activo. Un color de cada país sobre el azul que los separa: verde por Australia, rojo por Perú. La más fresca y la más futurista.

| Token | Hex |
|-------|-----|
| `--abismo` | `#031229` |
| `--profundo` | `#063049` |
| `--azul` | `#1E6BFF` |
| `--cian` (verde esmeralda) | `#25E0B0` |
| `--violeta` | `#0FA3A3` |
| `--grana` | `#FF3B4F` |
| `--niebla` | `#C4E7EC` |

**3 · Vivo** — los tres colores a máxima saturación: azul eléctrico, verde neón, rojo intenso. La más llamativa; también la más difícil de mantener elegante cuando se le sumen logos y fotos.

| Token | Hex |
|-------|-----|
| `--abismo` | `#050A33` |
| `--profundo` | `#111E75` |
| `--azul` | `#3D5AFE` |
| `--cian` (verde eléctrico) | `#00E5A0` |
| `--violeta` | `#7A3DFF` |
| `--grana` | `#FF1744` |
| `--niebla` | `#D6DEFF` |

**La regla que se mantiene en las tres:** el rojo aparece poco y siempre significa lo mismo — *aquí hay un capítulo activo*. El color transporta información, no decora. Un capítulo dormido nunca es rojo.

Para elegir, el sitio incluye temporalmente un selector abajo a la derecha que permite compararlas en vivo. **Se borra cuando el board decida** (§13.5).

> **Conciliación con la v3.** La versión anterior proponía rojo peruano + verde eucalipto sobre gris frío. El board pidió explícitamente azul con degradado y descartó el gris, así que esa paleta quedó sustituida. Lo que sobrevive intacto es el principio de fondo: *el color carga información*.

### 5.3 Tipografía

| Rol | Familia | Uso |
|-----|---------|-----|
| Display | **Space Grotesk** (700) | Titulares. Geométrica, con carácter técnico, sin ser fría |
| Texto | **Inter** (400 / 500 / 600) | Párrafos, descripciones, bios |
| Utilitaria | **IBM Plex Mono** (500) | Códigos de estado (QLD, NSW), fechas, eyebrows, etiquetas |

Las tres están en Google Fonts. **La mono no es decorativa:** los códigos de estado australianos son datos reales, y presentarlos como datos —monoespaciados, en mayúsculas, con tracking abierto— es lo que le da al sitio carácter de tablero en vez de folleto.

Escala fluida con `clamp()`: `--fs-display` de 2.6rem a 5rem, `--fs-h2` de 1.9 a 2.9rem, cuerpo en 17px, interlineado 1.7, ancho máximo de párrafo 64 caracteres.

> **Conciliación con la v3.** La v3 proponía Archivo Expanded + Public Sans. Al construir se optó por Space Grotesk + Inter: la primera pareja resultaba demasiado ancha e institucional para la dirección futurista que pidió el board. Si el board prefiere volver a la pareja anterior, es un cambio de dos líneas en el `<link>` de fuentes y el `font-family` de `estilos.css`.

### 5.4 Retícula y espacio

- Contenedor de 1180px máximo, padding lateral de 24px.
- Escala de espaciado en base 8: `8 / 16 / 24 / 40 / 64 / 96 / 128`.
- Padding vertical de sección fluido: de 72px en móvil a 132px en escritorio.
- Radio de borde: **14px** en tarjetas, 9px en campos de formulario. Uniforme.
- Atmósfera: malla de degradados radiales fija de fondo, más una capa de grano al 28% de opacidad que evita el aspecto plano de los degradados digitales.

### 5.5 Elemento firma — el Mapa de Capítulos

Es la única pieza donde se gasta toda la audacia del diseño. Todo lo demás se mantiene disciplinado.

Una **constelación de los ocho estados australianos**, posicionados según su geografía real sobre una rejilla tenue. Brisbane aparece como nodo relleno en rojo con halo y resplandor; los siete restantes en azul claro con borde punteado. Líneas punteadas con degradado salen del nodo activo hacia los dormidos.

- Al pasar el cursor o el foco sobre un estado dormido, el borde se vuelve continuo y aparece «Sin capítulo todavía. ¿Lo abres tú?».
- Debajo, un contador honesto en mono: `1 / 8 capítulos activos`, con barra de progreso. **Se calcula solo** desde los datos: activar un capítulo actualiza el mapa, el contador y la barra a la vez.
- En móvil el mapa se sustituye por la columna de fichas, para no comprimir el SVG a un tamaño ilegible.

> **Por qué constelación y no un mapa con las siluetas de los estados.** Un contorno de Australia mal dibujado se nota de inmediato y abarata todo el sitio. La constelación es geográficamente fiel en las posiciones, encaja con la dirección futurista y no depende de reproducir fronteras con precisión.

### 5.6 Movimiento

- Revelado al hacer scroll: solo opacidad y 14px de desplazamiento, 600ms, escalonado por tarjeta.
- Hover: transiciones de 150–220ms en color, borde y elevación. Nada de escalado ni rotación.
- `prefers-reduced-motion` desactiva todo revelado y transición; el estado final se muestra directo.
- **Prohibido:** parallax, carruseles automáticos, contadores animados, video de fondo, partículas.

---

## 6. Sistema de interfaz y detalle UX

### 6.1 Navegación por pestañas
Barra superior pegajosa de 68px que gana un borde inferior al hacer scroll. Logo a la izquierda; cuatro pestañas a la derecha: Inicio · Capítulos · Servicios · Únete. La pestaña activa lleva subrayado con degradado y `aria-current="page"` — se marca sola comparando el nombre del archivo, así que agregar una pestaña nueva no obliga a tocar nada más.

En móvil (<640px): logo + botón de menú. El panel se despliega a pantalla completa, cierra al elegir una opción o con Escape, y devuelve el foco al botón.

### 6.2 Ficha de capítulo

| Estado | Fondo | Borde | Etiqueta | Interacción |
|--------|-------|-------|----------|-------------|
| Activo | Degradado rojo tenue | 1px rojo | `ACTIVO` sobre rojo | Enlace de contacto, se eleva al hover |
| Próximamente | Vidrio azul | 1px punteado | `PRÓXIMAMENTE` en azul claro | `aria-disabled="true"`. Enlace «Quiero abrir este capítulo» que abre el correo con asunto prellenado |

Cada ficha muestra el código de estado en mono, la ciudad, y —cuando hay datos del formulario— cuántos miembros hay en ese estado. **Las fichas dormidas nunca bajan de 72% de opacidad:** deben leerse con claridad. Su visibilidad es el requerimiento, no un efecto decorativo.

Cuando un estado dormido llega a **10 miembros o más**, su texto cambia solo de «Sin capítulo todavía» a «Ya hay gente suficiente para arrancar. ¿Lo abres tú?».

### 6.3 Tarjeta de directiva
Foto cuadrada en escala de grises que pasa a color al hover. Nombre, cargo en mono, bio breve y enlace a LinkedIn si existe. Cuatro columnas en escritorio, dos en tablet, una en móvil. Sin foto, cuadro degradado con las iniciales — nunca un ícono genérico ni una imagen rota.

### 6.4 Bloque de workshop
Miniatura + fecha en mono + título + descripción breve + flecha. Toda la fila es un enlace a la publicación de LinkedIn, con `target="_blank"` y `rel="noopener noreferrer"`. Sin imagen, se muestra un degradado. **Si no hay workshops cargados, la sección entera desaparece** en vez de mostrar un contenedor vacío.

### 6.5 Banda de respaldo institucional
Franja propia con el eyebrow `CON EL RESPALDO DE` centrado y los logos a altura óptica pareja, máximo 48px. Si aún no hay archivo de logo, se muestra el nombre en texto — el sitio funciona antes de tener los logos.

> El texto exacto de esta banda debe coincidir con lo autorizado por ambas instituciones. Ver riesgo #1.

### 6.6 Formulario
Dos columnas en escritorio (explicación + aviso de privacidad a la izquierda, campos a la derecha), una en móvil. Campos sobre vidrio azul, con foco marcado en el color de acento.

- Validación campo por campo, con `aria-invalid` y el foco puesto en el primer error.
- Mensajes concretos: «Faltan datos obligatorios. Revisa los campos marcados», no «Error».
- Al enviar, el formulario se reemplaza por la confirmación: «Listo, ya eres parte del directorio.»
- Si el registro todavía no está conectado, el mensaje ofrece la salida real: escribir al correo.
- Trampa anti-spam invisible (campo `sitio_web`): si viene lleno, es un bot y se descarta en silencio.
- Debajo del formulario va el **directorio de miembros**: tarjetas con nombre, estado, área/rol y LinkedIn de quienes autorizaron la publicación, filtrables por estado. Cada persona aparece **24 horas después** de registrarse (§9.9). Antes de eso, el sitio solo muestra cuántos registros están en espera.

### 6.7 Estados vacíos y de error
- **Contenido que no carga:** el bloque muestra el aviso en mono y el resto de la página sigue funcionando. Un fallo nunca deja la página en blanco.
- **Imagen rota:** se sustituye por iniciales o por un degradado.
- **Sin servicios:** «Estamos preparando nuestros próximos programas. Escríbenos si quieres saber cuándo abren.»

### 6.8 Accesibilidad (piso no negociable)
- Foco visible de 2px en el color de acento con separación, en todo elemento interactivo.
- Todo alcanzable por teclado y en orden lógico; los nodos del mapa tienen `tabindex` y etiqueta descriptiva.
- Los estados dormidos exponen su información por texto, no solo por color.
- HTML semántico, un solo `<h1>` por página, `alt` en todas las imágenes.
- `prefers-reduced-motion` respetado.

### 6.9 Rendimiento y metadatos
Menos de 500 KB en la primera carga; fuentes con `display: swap`; imágenes en WebP con `loading="lazy"` fuera del hero. Objetivo Lighthouse: ≥90 en Rendimiento, ≥95 en Accesibilidad.

Cada página tiene su propio `<title>`, `meta description` y Open Graph, porque el sitio se difunde por WhatsApp y LinkedIn y la tarjeta de previsualización importa tanto como la página.

---

## 7. Contenido propuesto

*Borradores para aprobación del board. Ya están cargados en el sitio; se editan en `assets/js/contenido.js`.*

**Eyebrow del hero:** `ORGANIZACIÓN SIN FINES DE LUCRO · BRISBANE, AUSTRALIA`

**Titular:** Talento peruano construyendo tecnología en Australia.

**Bajada:** Somos una comunidad de profesionales peruanos en tecnología radicados en Australia. Compartimos lo que sabemos, abrimos puertas y ayudamos a que el siguiente en llegar no empiece de cero.

**Quiénes somos:** PeruTechAU nació en Brisbane como un grupo de profesionales peruanos que trabajan en tecnología en Australia. En nuestro primer año reunimos a más de 130 miembros y realizamos workshops presenciales donde la gente no solo aprende: sale con algo construido.

**Misión:** Conectar y fortalecer a la comunidad peruana de tecnología en Australia mediante formación práctica, mentoría y espacios de encuentro que abran oportunidades profesionales reales.

**Visión:** Que en cada estado de Australia exista un capítulo activo de PeruTechAU, y que ningún profesional peruano en tecnología tenga que abrirse camino solo.

> La visión está escrita a propósito para conectar con el mapa: lo que el mapa muestra vacío es exactamente lo que la visión promete llenar.

**Los tres pilares:**

| Mono | Título | Línea |
|------|--------|-------|
| `01 CONECTAR` | Encontrar a los tuyos | Una red de peruanos en tecnología repartidos por Australia, a un mensaje de distancia. |
| `02 FORMAR` | Salir con algo hecho | Workshops donde se construye y se entrega un certificado que sirve para postular. |
| `03 ABRIR` | Dejar la puerta abierta | Cada capítulo nuevo empieza porque alguien decidió abrirlo. |

*Aquí la numeración sí corresponde: es la secuencia real por la que pasa un miembro.*

**Microcopy del mapa:** «Sin capítulo todavía. ¿Lo abres tú?» · `1 / 8 capítulos activos` · «Quiero abrir este capítulo»

**CTA de cierre:** ¿Trabajas en tecnología y eres peruano en Australia? Únete al grupo. Es gratis y siempre lo será.

**Footer:** PeruTechAU · Organización sin fines de lucro · Brisbane, Queensland

**Métricas del primer año** (130 miembros, 85% de satisfacción, 25% de participación en eventos presenciales): cargadas como fila de tres cifras bajo el hero. Si el board decide no publicarlas, se vacía el array `cifras` y la fila desaparece sola.

---

## 8. Arquitectura técnica

### 8.1 Repositorio y hosting

Repositorio **público** en GitHub → **GitHub Pages**, gratis, con dominio propio y HTTPS automático.

| ID | Requerimiento | Detalle |
|----|--------------|---------|
| RT-01 | Repositorio público | `perutechau-web`. Público habilita GitHub Pages sin costo. |
| RT-02 | Migrar a organización | Crear la organización `perutechau` con **dos owners** y transferir el repo. Plan Free. Evita que el acceso dependa de una sola persona. |
| RT-03 | Rama protegida | Proteger `main`: exigir pull request antes de fusionar. Gratis en repos públicos. |
| RT-04 | Sitio estático | HTML + CSS + JS. Sin backend, sin CMS, sin framework, sin compilación. |
| RT-05 | Contenido en un solo archivo | Todo el contenido vive en `assets/js/contenido.js`, compartido por las cuatro páginas. |
| RT-06 | HTTPS | «Enforce HTTPS» activado en Pages. |
| RT-07 | Verificar el dominio en GitHub | Reduce el riesgo de secuestro del subdominio. |

**Implicaciones de que el repo sea público** — revisadas con Jhordy:
- Ningún dato de miembros, correo personal, credencial ni token entra al repositorio. Nunca.
- El historial de commits también es público: un dato subido por error queda visible aunque se borre después.
- Las fotos y bios de la directiva se vuelven públicas **al hacer commit**, no al publicar el sitio. El consentimiento se recoge antes.
- El `.gitignore` bloquea `.xlsx`, `.csv` y cualquier export del formulario desde el primer commit.

### 8.2 Estructura de archivos

```
perutechau-web/
├── index.html              Inicio
├── capitulos.html          Capítulos + Directiva
├── servicios.html          Servicios
├── unete.html              Formulario de registro
├── assets/
│   ├── css/estilos.css     Tokens de las 3 paletas + todos los estilos
│   ├── js/contenido.js     ← EL ÚNICO ARCHIVO QUE SE EDITA A DIARIO
│   ├── js/app.js           Motor de render, formulario, mapa
│   └── img/                logo · respaldo · directiva · workshops · og-cover
├── apps-script/codigo.gs   Script de la hoja de cálculo (no se despliega)
├── .gitignore
├── README.md               Guía de mantenimiento y despliegue
└── README-formulario.md    Montaje de la base de datos, paso a paso
```

> **Conciliación con la v3.** La v3 proponía cuatro archivos JSON en `/data/` cargados con `fetch()`. Se sustituyeron por un único `contenido.js` porque `fetch()` de archivos locales falla al abrir el sitio con doble clic (restricción del navegador con `file://`), lo que habría impedido revisar el sitio sin subirlo a un servidor. La ventaja de fondo se conserva y mejora: **un solo lugar donde editar contenido, sin tocar HTML**, y ahora compartido por las cuatro páginas a la vez.

### 8.3 Por qué sin framework

El sitio pasa de Catherine a Jhordy y probablemente después a otros voluntarios. Un sitio que se abre con doble clic y se edita con cualquier editor sobrevive a los cambios de equipo; un proyecto con dependencias y compilación se rompe a los seis meses cuando nadie recuerda cómo levantarlo. Si más adelante hace falta blog o multiidioma, se migra a Astro conservando el mismo HTML.

### 8.4 Dominio

Único gasto del proyecto.

**Restricción encontrada:** `.org.au` no es viable hoy. Las reglas de auDA exigen que el registrante sea una entidad sin fines de lucro registrada en Australia (asociación incorporada, company limited by guarantee o inscrita en la ACNC) con ABN/ACN activo. Una asociación no incorporada no califica.

| Opción | Costo aprox./año | Viabilidad |
|--------|------------------|-----------|
| **perutechau.org** (Cloudflare Registrar) ⭐ | ~USD 10–12 (~AUD 16–19) | ✅ Sin requisitos. Precio a costo, privacidad WHOIS y DNSSEC incluidos |
| perutechau.com | ~USD 10–11 | ✅ Sin requisitos, pero comunica menos «sin fines de lucro» |
| perutechau.au | variable | ⚠️ Requiere presencia australiana verificada |
| perutechau.org.au | variable | ❌ Requiere entidad NFP incorporada con ABN |

Precios verificados en agosto 2026; confirmar al comprar. Registrar con una cuenta institucional, no personal.

---

## 9. Entregable B — Formulario y base de datos

### 9.1 Lo primero: no existe la «base de datos local»

GitHub Pages sirve archivos y nada más; no ejecuta código en el servidor, así que la página no puede guardar nada por sí sola. Guardar en el navegador tampoco sirve: `localStorage` deja la información solo en el dispositivo de quien llenó el formulario — nadie más la vería.

**La hoja de cálculo de Google *es* la base de datos.** Es la opción correcta: gratis, ya la conoce el board, y era el plan original de Angel (formulario conectado a Excel).

### 9.2 Arquitectura

```
   Formulario en unete.html
   (diseño propio, sin iframes)
                 │  POST
                 ▼
   Google Apps Script  ──── apps-script/codigo.gs
   (recibe, valida, escribe)
                 │
                 ▼
   ┌─────────────────────────────────────────┐
   │  HOJA DE CÁLCULO DE GOOGLE              │
   │  Pestaña "Respuestas"   ← PRIVADA       │
   │    nombre, correo, estado, área,        │
   │    consent_publico, publicar_desde…     │
   │  Pestaña "Publico"      ← solo totales  │
   │    codigo,miembros / QLD,42 / NSW,17    │
   └─────────────────────────────────────────┘
                 │  GET …/exec?accion=publico  (JSON)
                 ▼
   { conteo: {NSW:17…},                → fichas "NSW · 17 miembros"
     miembros: [ solo quienes          → directorio de miembros
       autorizaron y ya pasaron 24 h ],
     pendientes: 2 }                   → "2 en espera de 24 h"
```

**La decisión de fondo: el script decide qué es público.** `Respuestas` guarda los datos personales y nunca se publica. El mismo script que recibe los registros responde a un `GET` con lo único que la web puede saber: los totales por estado y las tarjetas de quienes autorizaron aparecer, ya cumplidas las 24 horas. Nunca devuelve correos. La pestaña `Publico` (solo `codigo,miembros`) se mantiene como alternativa por CSV.

**Por qué le sirve a la organización:** el conteo por estado es el dato que decide dónde abrir el próximo capítulo. El formulario alimenta el mapa y el mapa justifica el formulario.

### 9.3 Requerimientos

| ID | Requerimiento | Estado |
|----|--------------|--------|
| RF-F-01 | Formulario en línea para los miembros | ✅ En `unete.html` |
| RF-F-02 | Persistencia en hoja de cálculo | ✅ Vía Apps Script |
| RF-F-03 | Revisión previa del board antes del envío | ⏳ Pendiente |
| RF-F-04 | Formato de salida utilizable por la web | ✅ Pestaña `Publico` en CSV |
| RF-F-05 | Sin retrabajo manual | ✅ El conteo se recalcula solo |
| RF-F-06 | Separación de datos públicos y privados | ✅ Dos pestañas |
| RF-F-07 | Sin duplicados | ✅ Si el correo ya existe, actualiza la fila |
| RF-F-08 | Anti-spam | ✅ Trampa invisible + validación en el servidor |
| RF-F-09 | Directorio de miembros con ventana de revisión de 24 h | ✅ Solo quienes autorizaron; filtro en servidor y en cliente |

### 9.4 Campos

| Columna | Obligatorio | ¿Se publica? |
|---------|-------------|--------------|
| Fecha | automático | No |
| Nombre | Sí | No |
| Correo | Sí | No |
| Estado | Sí | Solo como total agregado |
| Ciudad | No | No |
| Área o especialidad | Sí | No |
| Nivel de experiencia | No | No |
| Rol actual | No | No |
| LinkedIn | No | No |
| Disponibilidad de voluntariado | No | No |
| Consentimiento de datos | Sí | No |
| Consentimiento de publicación | No | No |
| `publicar_desde` | automático (fecha + 24 h) | No |

Si la persona marca el consentimiento de publicación, **nombre, estado, área, rol y LinkedIn** pasan al directorio cuando se cumple `publicar_desde`. Ciudad, nivel, correo y voluntariado no se publican nunca.

### 9.5 Los dos consentimientos, separados

1. **Guardar y contactar** — obligatorio, sin esto no hay registro.
2. **Publicar nombre y foto en la web** — opcional, casilla aparte.

Juntarlos obligaría a alguien a aceptar aparecer públicamente solo para poder ser miembro. Separarlos también deja registro escrito de quién autorizó qué, que es exactamente lo que hace falta antes de subir las fotos de la directiva al repositorio público.

### 9.6 Montaje
Seis pasos, unos 20 minutos, sin programar. El detalle está en **`README-formulario.md`**: crear la hoja → pegar `codigo.gs` → publicar el script como aplicación web → pegar la URL en `contenido.js` → publicar solo la pestaña `Publico` como CSV → activar el aviso por correo (opcional).

### 9.7 Reglas permanentes
- La hoja **nunca** se descarga al repositorio.
- La pestaña `Respuestas` **nunca** se publica.
- La URL del `/exec` puede estar en el código público: solo permite escribir, no leer.
- Para dar de baja a alguien: se borra la fila y se ejecuta `actualizarConteo`.
- Para impedir que un registro llegue al directorio: borrar la fila **antes** de `publicar_desde`.
- `HORAS_ESPERA` (script) y `publicacion_horas` (`contenido.js`) deben coincidir.

### 9.9 Directorio de miembros y ventana de publicación

Cuando alguien se registra, su estado suma un miembro al instante y, si marcó la casilla opcional de publicación, su tarjeta aparece en el directorio. La ventana de espera es configurable (`HORAS_ESPERA` en el script, `publicacion_horas` en `contenido.js`). **Decisión del 26-08-2026: ventana en 0, publicación inmediata.** Si el board quiere una ventana de revisión (p. ej. 24 h) para borrar registros que no correspondan antes de que se vean, basta con cambiar ambos valores.

El filtro se aplica en el servidor (`codigo.gs`), que es quien tiene los datos; el cliente lo repite por seguridad. Mientras no haya endpoint configurado, el formulario trabaja en modo de prueba: guarda el registro solo en el navegador de quien lo llenó y aplica la misma regla, para poder revisar el flujo completo sin montar la hoja.

### 9.8 Alternativas descartadas
**Google Forms incrustado** se monta en cinco minutos, pero rompe el diseño y no permite el conteo por estado. **Microsoft Forms** tiene el mismo inconveniente visual. **Netlify Forms** obliga a mover el hosting fuera de GitHub Pages y limita a 100 envíos mensuales en el plan gratuito. La solución con Apps Script es la única que mantiene el formulario dentro del diseño, conserva GitHub Pages y permite el conteo.

---

## 10. Contenido pendiente de entrega

| # | Contenido | Req. | Responsable | Estado |
|---|-----------|------|-------------|--------|
| 1 | Elegir paleta entre las tres | §5.2 | Board | ⏳ |
| 2 | Nombre y descripción del servicio | RF-W-07 | Yajaira | ⏳ |
| 3 | Aprobación de misión, visión y «quiénes somos» | RF-W-01 | Board | ⏳ Borradores cargados |
| 4 | Logos de Embajada y PROMPERÚ | RF-W-02 | Marcos | ✅ Cargados en `assets/img/` |
| 5 | Aval escrito del uso de logos y texto autorizado | RF-W-02 | Marcos | ⏳ **Verificar antes de publicar** |
| 6 | URL de LinkedIn de cada actividad | RF-W-08 | Admin de LinkedIn | ⏳ Cinco actividades cargadas con foto y fecha real; faltan los enlaces |
| 7 | Bios y consentimiento de la directiva | RF-W-06 | Cada integrante | ⏳ Fotos cargadas; faltan bios y consentimiento escrito |
| 8 | Logo de PeruTechAU en vectorial | Todos | Board | ⏳ |
| 9 | Correo de contacto real y URL del LinkedIn | RF-W-10 | Board | ⏳ |
| 10 | Imagen `og-cover.png` (1200×630) | §6.9 | Diseño | ⏳ |
| 11 | Confirmar lista de capítulos: ¿por estado o por ciudad? | RF-W-03 | Board | ⏳ Cargado por ciudad con código de estado |
| 12 | Qué columnas se entregan a la Embajada | §9.4 | Board | ⏳ **Antes de enviar el formulario** |

---

## 11. Secuencia

1. El board elige la paleta.
2. Angel y el board revisan los campos del formulario (RF-F-03).
3. Se define qué datos se entregan a la Embajada y se refleja en el aviso de privacidad.
4. Se monta la hoja de cálculo siguiendo `README-formulario.md` y se pega el endpoint.
5. **En paralelo:** el board aprueba los textos de §7 y entrega el contenido de §10.
6. Se carga todo en `contenido.js` y se revisa que no quede ningún placeholder.
7. Revisión de seguridad del repositorio con Jhordy.
8. Compra del dominio y publicación con HTTPS.
9. Envío del formulario a los miembros del grupo.
10. Handover a Jhordy; Catherine pasa a apoyo ligero.

---

## 12. Riesgos

| # | Riesgo | Acción |
|---|--------|--------|
| 1 | Uso de las marcas de Embajada y PROMPERÚ sin aval escrito | **Riesgo más alto del sitio.** Confirmar autorización y texto exacto antes de publicar. |
| 2 | Repo público con datos personales | Ningún export del formulario entra al repo. `.gitignore` desde el primer commit. Consentimiento de la directiva **antes** de subir fotos. |
| 3 | Datos de miembros mal gestionados | Dos administradores de la hoja como mínimo. Revisión de Jhordy antes del envío. |
| 4 | Repo o dominio atados a una cuenta personal | Migrar a organización con dos owners; registrar el dominio con correo institucional. |
| 5 | Dominio sin dueño de costo | Definir quién paga los ~AUD 16–19 anuales. |
| 6 | Catherine pasa a apoyo ligero tras publicar | Handover documentado: repo, accesos, dominio, guía de despliegue. |
| 7 | Publicar con contenido placeholder | Checklist de §13.6. El sitio de referencia tiene ese error visible. |
| 8 | Textos sin aprobar | Los borradores de §7 están cargados; si no se aprueban, el sitio saldría con texto no validado por el board. |

---

## 13. Implementación y mantenimiento

### 13.1 Cómo se actualiza el sitio (para cualquiera del board)

Todo el contenido está en **`assets/js/contenido.js`**. No hay que tocar HTML ni CSS.

**Activar un capítulo:** cambiar `activo: false` por `activo: true` y agregar descripción y contacto. El mapa, el contador, la barra y la ficha se actualizan solos.

**Agregar un workshop:** copiar un bloque en `workshops` y pegar el enlace de LinkedIn. Se ordenan solos por fecha. Array vacío = la sección desaparece.

**Agregar a alguien a la directiva:** copiar un bloque. Sin foto, aparecen las iniciales.

**Poner los logos:** copiar los archivos a `assets/img/` y escribir la ruta en el bloque `respaldo`.

**Cambiar de paleta:** cambiar `data-tema` en el `<html>` de las cuatro páginas.

### 13.2 Estructura de datos

```js
capitulos: [
  { codigo:"QLD", nombre:"Brisbane", estado:"Queensland", activo:true,
    x:95, y:52, miembros:0,
    descripcion:"Nuestro capítulo fundador.", contacto:"brisbane@perutechau.org" }
]
directiva: [ { nombre, cargo, bio, foto, linkedin } ]
workshops: [ { titulo, fecha:"AAAA-MM-DD", descripcion, imagen, linkedin_url } ]
servicios: [ { nombre, descripcion, gratuito:true, capitulo } ]
respaldo:  [ { nombre, logo } ]
formulario:{ endpoint, conteo_url, publicacion_horas }
```

`x` e `y` son la posición en el mapa (0–100), ya calculadas según la geografía real.

### 13.3 Cómo funciona el motor

`app.js` se carga en las cuatro páginas y renderiza **solo lo que existe en cada una**: antes de escribir en un elemento comprueba que esté presente. Por eso el mismo archivo sirve a las cuatro pestañas sin errores, y agregar una página nueva no obliga a duplicar lógica.

Si un bloque falla, el error queda contenido en esa sección y el resto de la página sigue funcionando.

### 13.4 Reglas de construcción
- Todo el color sale de las variables de `:root`; ningún hex suelto en el marcado.
- Un solo `<h1>` por página; jerarquía de encabezados sin saltos.
- `prefers-reduced-motion` respetado.
- Foco visible en todo elemento interactivo.
- Sin analítica, sin scripts de terceros. `localStorage` solo para la paleta elegida y para el modo de prueba del formulario, que deja de usarse en cuanto hay endpoint.
- Todo texto visible pasa por `esc()` antes de insertarse, para evitar inyección desde el contenido.

### 13.5 Antes de publicar: borrar el selector de paletas
Cuando el board elija, borrar en las cuatro páginas el bloque `<aside id="selectorPaleta">` y, en `app.js`, el bloque final marcado *SELECTOR DE PALETA*. Dejar fijo el `data-tema` elegido.

### 13.6 Criterios de aceptación
- [ ] Las cuatro pestañas cargan, navegan entre sí y marcan la activa.
- [ ] Brisbane activo; los otros siete estados visibles, marcados «Próximamente» y no clicables.
- [ ] El contador de capítulos se calcula desde los datos, no está escrito a mano.
- [ ] La directiva se renderiza en el orden definido, con fallback de iniciales.
- [ ] Cada workshop enlaza a LinkedIn en pestaña nueva con `rel="noopener noreferrer"`.
- [ ] Logos de Embajada y PROMPERÚ visibles con el eyebrow `CON EL RESPALDO DE`.
- [ ] Misión, visión y declaración de organización sin fines de lucro presentes.
- [ ] El formulario valida, muestra errores claros y confirma el envío.
- [ ] Los dos consentimientos están separados y el obligatorio bloquea el envío.
- [ ] El directorio muestra solo a quienes autorizaron, y solo pasadas 24 h del registro; el conteo sube de inmediato.
- [ ] Correcto a 375, 768 y 1440 px; el mapa se sustituye por lista en móvil.
- [ ] Navegación completa por teclado con foco visible.
- [ ] `prefers-reduced-motion` desactiva las animaciones.
- [ ] Tarjeta Open Graph correcta al pegar el enlace en WhatsApp y LinkedIn.
- [ ] **Cero placeholder:** sin *lorem ipsum*, sin «TODO», sin bloques sin editar.
- [ ] `.gitignore` presente desde el primer commit; ningún dato personal en el repo.
- [ ] Selector de paletas eliminado.
- [ ] Lighthouse ≥90 en Rendimiento y ≥95 en Accesibilidad.

### 13.7 Despliegue
1. Crear repo **público** `perutechau-web` y subir la carpeta.
2. Settings → Pages → rama `main`, carpeta `/ (root)`.
3. Registrar el dominio y apuntar el DNS a GitHub Pages: cuatro registros `A` del dominio raíz a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, y un `CNAME` de `www` hacia `<usuario>.github.io`.
4. Settings → Pages → Custom domain → escribir el dominio (crea el archivo `CNAME`) → **Enforce HTTPS**.
5. Verificar el dominio en GitHub para prevenir el secuestro del subdominio.
6. Proteger `main` y documentar en el README quién tiene acceso al repo, al dominio, al DNS y a la hoja de cálculo.

---

## 14. Registro de cambios

| Versión | Qué cambió |
|---------|-----------|
| 1.0 | Primeros requerimientos extraídos del hilo del board: capítulos, directiva, servicios. |
| 1.1 | Se completó el mensaje truncado: landing con misión y visión, respaldo institucional, workshops enlazados a LinkedIn, perusv.org como referencia. |
| 1.2 | Catherine no se retira del grupo: pasa a apoyo ligero. Jhordy asume mantenimiento. |
| 2.0 | Investigación de hosting y dominio. GitHub Pages descartado por repo privado; `.org.au` descartado por reglas de auDA. Se añadió el brief de implementación. |
| 3.0 | Dirección de arte completa, sistema UI/UX y borradores de contenido. Repo pasa a público → GitHub Pages vuelve a ser viable y el proyecto queda en costo cero salvo el dominio. |
| 4.0 | Documento único. Se fusionan requerimientos y brief. Sitio construido: cuatro pestañas en vez de tres (se suma `unete.html`), paleta azul en tres variantes en vez de rojo/eucalipto, Space Grotesk + Inter en vez de Archivo Expanded + Public Sans, `contenido.js` en vez de archivos JSON, y se incorpora la arquitectura completa del formulario y la base de datos. |
| 4.1 | **Directorio de miembros con ventana de 24 h** (RF-F-09, §9.9): el endpoint devuelve JSON con conteo, miembros autorizados y pendientes; nueva sección en `unete.html`. Se completan los archivos que faltaban (`estilos.css`, `app.js`, `codigo.gs`, `README-formulario.md`, `CLAUDE.md`, `.gitignore`), se cargan logos, fotos de directiva y de workshops, y se corrigen `csv_conteo` → `conteo_url` y los hex sueltos del SVG del mapa. |
| **4.2** | **Revisión del board (27-08-2026).** Se retira toda afirmación de gratuidad total (RF-W-09): habrá servicios con costo. Cargos corregidos: Yajaira Navarro es *General Director*; Catherine Varas, *IT Lead y creadora de la web*. El servicio de mentoría se acota a lo confirmado: una hora al mes, en persona, de septiembre a diciembre de 2026, cuatro beneficiarios. Se suma el historial completo con las fechas reales de LinkedIn: meetup de TechSuyo en Sydney (junio 2025, donde nació la idea), Hola Networking Business Expo (septiembre 2025), primer evento presencial (octubre 2025) y las dos ediciones del Taller de Website con IA (abril y junio de 2026). Las fechas se muestran solo con mes y año. Se corrige el menú móvil, que se veía transparente sobre el contenido en navegadores sin `color-mix()`. |
