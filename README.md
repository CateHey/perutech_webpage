# PeruTechAU — Sitio web

> Para desarrollar o modificar el código, lee primero **`CLAUDE.md`**: es la fuente única de verdad del proyecto.
> Este README es la guía práctica para actualizar contenido y desplegar.

Sitio estático de cuatro pestañas: **Inicio · Capítulos · Servicios · Únete**.
Sin frameworks, sin `npm`, sin compilación. Se abre haciendo doble clic en `index.html`
y se despliega copiando la carpeta a un repositorio de GitHub.

```
index.html       Inicio      hero, misión y visión, pilares, workshops, respaldo
capitulos.html   Capítulos   mapa de capítulos, fichas por estado, directiva
servicios.html   Servicios   servicios gratuitos para miembros
unete.html       Únete       formulario de registro
```

---

## Cómo actualizar el contenido

Todo el contenido vive en **un solo archivo**: `assets/js/contenido.js`.
Lo comparten las cuatro páginas, así que cambiar algo ahí lo cambia en todas.

**No hace falta tocar nada más.** El HTML, el CSS y el JavaScript se quedan como están.

| Archivo | Para qué | ¿Se edita? |
|---------|----------|-----------|
| `assets/js/contenido.js` | Textos, capítulos, directiva, workshops, servicios | **Sí, siempre** |
| `assets/css/estilos.css` | Colores y estilos | Solo para cambiar la paleta |
| `assets/js/app.js` | Motor de render | Casi nunca |
| `*.html` | Estructura de cada pestaña | Solo al agregar una sección nueva |
| `apps-script/codigo.gs` | Script de la hoja de cálculo | Solo al cambiar la base de datos |

### Activar un capítulo nuevo
Busca el capítulo en la lista `capitulos` y cambia `activo: false` por `activo: true`.
Agrégale su descripción y su correo:

```js
{ codigo:"NSW", nombre:"Sydney", estado:"New South Wales", activo:true, x:91, y:70,
  descripcion:"Nuestro capítulo en Sydney.", contacto:"sydney@perutechau.org" }
```

El mapa, el contador (`1 / 8 capítulos activos`) y la barra de progreso se actualizan solos.

### Agregar un workshop
Copia un bloque dentro de `workshops` y pega el enlace de la publicación de LinkedIn:

```js
{ titulo:"Nombre del workshop", fecha:"2026-03-15",
  descripcion:"Una o dos líneas sobre qué se hizo.",
  imagen:"assets/img/workshop-marzo.jpg", linkedin_url:"https://www.linkedin.com/posts/..." }
```

- Los workshops se ordenan solos: el más reciente aparece primero.
- Si no hay imagen, se muestra un degradado en su lugar.
- Si dejas el array vacío `[]`, toda la sección desaparece.

### Agregar a alguien a la directiva
Copia un bloque dentro de `directiva`. Si no hay foto, se muestran las iniciales sobre un degradado — nunca se rompe el diseño.

```js
{ nombre:"Nombre Apellido", cargo:"Su cargo",
  bio:"Máximo 240 caracteres.", foto:"assets/img/nombre.jpg",
  linkedin:"https://www.linkedin.com/in/..." }
```

### Poner los logos institucionales
Ya están cargados (`assets/img/embajada.jpg` y `assets/img/promperu.png`). Para cambiarlos,
copia el archivo nuevo a `assets/img/` y actualiza la ruta en el bloque `respaldo`:

```js
respaldo: [
  { nombre:"Embajada del Perú en Australia", logo:"assets/img/embajada.jpg" },
  { nombre:"PROMPERÚ", logo:"assets/img/promperu.png" }
]
```

Los logos se muestran a color sobre una tarjeta blanca. Si `logo` queda vacío, se muestra solo el nombre en texto.

### Imágenes
Todas van en `assets/img/`, sin espacios en el nombre. Las que ya existen:

| Archivo | Uso |
|---------|-----|
| `directiva-*.jpg` | Fotos de la directiva (cuadradas) |
| `reunion.jpg` | Primera reunión de la comunidad (parque de Brisbane) |
| `workshop-1.jpg`, `workshop-2.jpg` | Workshop «Crea tu landing page» (la 2 queda de repuesto) |
| `embajada.jpg`, `promperu.png` | Logos de respaldo |
| `og-cover.png` | **Pendiente.** Imagen de 1200×630 para la previsualización al compartir |

---

## Formulario y directorio de miembros

El formulario de `unete.html` guarda cada registro en una hoja de cálculo de Google
(montaje en `README-formulario.md`). Con cada registro:

1. **El conteo de su estado sube de inmediato** y se ve en las fichas de `capitulos.html`.
2. Si la persona marcó la casilla opcional de publicación, **su tarjeta aparece en el
   directorio de miembros de `unete.html` 24 horas después**. Ese plazo es la ventana para que
   el board revise el registro y borre lo que no corresponda antes de que se publique.
3. Si no la marcó, su nombre nunca aparece.

Mientras `formulario.endpoint` esté vacío, el formulario funciona en modo de prueba
(solo guarda en el navegador de quien lo llena) para poder revisar el flujo sin la hoja.

### Cambiar la paleta
Hay tres paletas listas en `assets/css/estilos.css`: `bandera`, `pacifico` y `vivo`.
Para elegir una, cambia el atributo en el `<html>` de **las cuatro páginas**:

```html
<html lang="es" data-tema="pacifico">
```

Mientras el board decide, el sitio muestra un selector abajo a la derecha para
compararlas en vivo. **Antes de publicar**, borra en las cuatro páginas el bloque
`<aside id="selectorPaleta">` y, en `app.js`, el bloque final marcado
*SELECTOR DE PALETA*.

---

## Pendientes antes de publicar

- [ ] Correo real de contacto (en `CONTENIDO.contacto.correo`)
- [ ] URL real del LinkedIn de PeruTechAU
- [ ] Confirmar con Yajaira el nombre exacto del servicio
- [ ] Workshops: confirmar las fechas de la primera reunión y del workshop de landing page, y pegar los enlaces de LinkedIn (las fotos ya están)
- [ ] Bios de la directiva y **consentimiento escrito** de cada integrante (las fotos ya están cargadas;
      la de Yajaira trae el marco «#OpenToWork» de LinkedIn — pedir una sin marco)
- [x] Logos de Embajada y PROMPERÚ cargados — falta el **aval escrito para usarlos**
- [ ] Imagen `assets/img/og-cover.png` (1200×630 px) para la previsualización al compartir
- [ ] Decidir si se publican las cifras del primer año
- [ ] Elegir la paleta y borrar el selector
- [ ] Conectar el formulario a la hoja de cálculo (ver `README-formulario.md`)
- [ ] Cambiar `og:image` a la URL absoluta del dominio en las cuatro páginas

---

## Desplegar en GitHub Pages

1. Crear un repositorio **público** llamado `perutechau-web`.
2. Subir el contenido de esta carpeta a la rama `main`.
3. En el repo: **Settings → Pages** → Source: `Deploy from a branch` → rama `main`, carpeta `/ (root)`.
4. A los pocos minutos el sitio queda en `https://<usuario>.github.io/perutechau-web/`.

### Con dominio propio
1. Registrar `perutechau.org` (recomendado: Cloudflare Registrar, ~AUD 16–19 al año).
2. En el DNS del dominio, crear cuatro registros `A` del dominio raíz apuntando a las IP de GitHub Pages:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   y un `CNAME` de `www` hacia `<usuario>.github.io`.
3. En **Settings → Pages → Custom domain**, escribir el dominio. Esto crea el archivo `CNAME`.
4. Marcar **Enforce HTTPS**.
5. Verificar el dominio en GitHub (Settings → Pages → Verify) para prevenir el secuestro del subdominio.

---

## Reglas de seguridad del repositorio

El repositorio es **público**, y el historial de commits también lo es.

- Nunca subir datos de miembros, exports del formulario, hojas de cálculo ni credenciales.
- Un archivo subido por error queda visible en el historial aunque después se borre.
- Las fotos y bios de la directiva se vuelven públicas al hacer commit, no al publicar el sitio: recoger el consentimiento **antes**.
- Proteger la rama `main` para exigir pull request antes de fusionar.

---

## Accesos a documentar

| Recurso | Responsable | Respaldo |
|---------|-------------|----------|
| Repositorio GitHub | | |
| Registrador del dominio | | |
| DNS | | |
| Correo de contacto | | |

Completar esta tabla y mantenerla al día. Ningún acceso debe depender de una sola persona.
