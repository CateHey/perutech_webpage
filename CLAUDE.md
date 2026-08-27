# PeruTechAU — Sitio web · guía para desarrollar

Fuente única de verdad técnica del proyecto. El README es la guía de contenido y despliegue;
`perutechau-documento-maestro.md` es el documento de requerimientos y diseño para el board.

## Qué es
Sitio estático de cuatro pestañas (Inicio · Capítulos · Servicios · Únete) para una comunidad
sin fines de lucro de profesionales peruanos en tecnología en Australia. Sin frameworks, sin
`npm`, sin compilación. Se abre con doble clic en `index.html` y se despliega en GitHub Pages.

## Estructura
```
index.html · capitulos.html · servicios.html · unete.html
assets/css/estilos.css      tokens de las 3 paletas + todos los estilos
assets/js/contenido.js      ← ÚNICO archivo que se edita a diario (textos, capítulos, etc.)
assets/js/app.js            motor de render: nav, mapa, fichas, directiva, formulario, directorio
assets/img/                 logos, fotos, workshops, og-cover.png
apps-script/codigo.gs       Google Apps Script de la hoja de cálculo (no se despliega)
README.md                   guía de contenido y despliegue
README-formulario.md        montaje de la base de datos paso a paso
```

## Reglas de construcción
- Todo el color sale de las variables de `:root` en `estilos.css`. Ningún hex suelto en el marcado
  (en el SVG del mapa se usa `var(--cian)` / `var(--grana)`).
- Un solo `<h1>` por página; jerarquía sin saltos.
- `app.js` renderiza solo lo que existe: antes de escribir en un `id` comprueba que esté.
  Cada bloque va dentro de `bloque(id, fn)` para contener errores.
- Todo texto visible pasa por `esc()`; toda URL externa por `urlSegura()`.
- `prefers-reduced-motion` respetado; foco visible en todo elemento interactivo.
- Sin analítica ni scripts de terceros. Fuentes de Google Fonts con `display=swap`.
- `localStorage` solo para: la paleta elegida (`ptau_tema`) y el **modo de prueba** del
  formulario (`ptau_registros_demo`), que se usa únicamente cuando `formulario.endpoint` está vacío.
  Con endpoint configurado no se guarda ningún dato personal en el navegador.

## Reglas de contenido que vienen del board
- **Nunca afirmar que todo es gratuito** («es y será gratuito», «100% gratuito»). Hay y habrá
  servicios con costo (invitados externos que cobran, obsequios, comida). La gratuidad se declara
  servicio por servicio con `gratuito: true`. Lo único siempre gratis: **registrarse**.
- Cargos exactos (revisión del 2026-08-27): Marcos Burgos *Head*, Yajaira Navarro *General Director*,
  Catherine Varas *IT Lead · Creadora de la web*, Jhordy Novoa *Software & Cybersecurity Engineer*.
- `workshops` en `contenido.js` es el historial completo de actividades, no solo workshops:
  meetup de Sydney, Hola Networking, primer evento presencial y las dos ediciones del taller.
  Se ordena solo por fecha y **se muestra solo mes y año**, así que el día de `fecha` da igual.

## Formulario y directorio (ventana de publicación)
- `unete.html` envía un `POST` (JSON, `Content-Type: text/plain` para evitar preflight CORS) al
  endpoint de Apps Script. El script valida, evita duplicados por correo y escribe en `Respuestas`.
- El conteo por estado sube de inmediato y se muestra en las fichas de `capitulos.html`.
- El **directorio de miembros** (`#directorioLista` en `unete.html`) muestra solo a quienes marcaron
  `consent_publico` y cuyo registro tiene ≥ `publicacion_horas` horas. **Hoy es 0: se publica de
  inmediato** (decisión del 2026-08-26). El filtro se aplica en el servidor (`HORAS_ESPERA` en
  `codigo.gs`) y se repite en el cliente; si se quiere ventana de revisión, poner 24 en ambos.
- `GET …/exec?accion=publico` devuelve `{ conteo, miembros, pendientes }`. Nunca correos.
- Si cambias la ventana, cambia **ambos**: `HORAS_ESPERA` y `publicacion_horas`.

## Cómo probar en local
1. Abrir `index.html` con doble clic (o `python -m http.server` en la carpeta).
2. Sin endpoint, el formulario entra en modo de prueba: el registro queda en `localStorage`.
   Para sembrar el directorio en modo de prueba, en la consola:
   `localStorage.setItem('ptau_registros_demo', JSON.stringify([{nombre:'Prueba Uno',correo:'a@b.co',estado:'QLD',area:'Data / IA',consent_publico:true,fecha:new Date(Date.now()-25*3600e3).toISOString()}]))`
   y recargar `unete.html`.
3. Validar sintaxis: `node --check assets/js/app.js assets/js/contenido.js` y
   `python -m http.server` + Lighthouse en Chrome.

## Antes de publicar
- Borrar el `<aside id="selectorPaleta">` de las cuatro páginas y el bloque *SELECTOR DE PALETA*
  al final de `app.js`. Dejar fijo `data-tema` en el `<html>`.
- `og:image` debe ser una URL absoluta (`https://dominio/assets/img/og-cover.png`) en las cuatro páginas.
- Revisar la lista de pendientes del README.

## Seguridad del repositorio
Repositorio público. Nunca subir datos de miembros, exports de la hoja, credenciales ni fotos sin
consentimiento escrito. `.gitignore` bloquea `.xlsx`, `.csv`, `.env` y exports.
