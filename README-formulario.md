# Formulario y base de datos — montaje paso a paso

El formulario de `unete.html` guarda cada registro en una **hoja de cálculo de Google**.
No hace falta programar: son seis pasos, unos 20 minutos.

```
unete.html  ──POST──▶  Apps Script (codigo.gs)  ──▶  Hoja "Respuestas"  (privada)
                                                 ──▶  Hoja "Publico"     (solo totales)
capitulos.html / unete.html  ◀──GET──  Apps Script  ──▶  conteo por estado
                                                          + directorio de miembros
                                                            (autorizados, ≥ 24 h)
```

## 1. Crear la hoja
1. Entra a [sheets.google.com](https://sheets.google.com) con la cuenta institucional (no una personal).
2. Crea una hoja nueva y llámala `PeruTechAU — Miembros`.
3. Comparte la hoja con **al menos dos administradores** del board.

## 2. Pegar el script
1. En la hoja: **Extensiones → Apps Script**.
2. Borra el contenido del editor y pega todo `apps-script/codigo.gs`.
3. Si quieres recibir un correo por cada registro nuevo, escribe el correo en `AVISAR_A`.
4. Guarda (Ctrl+S).

## 3. Probar
1. En el editor, elige la función `probar` y pulsa **Ejecutar**.
2. Acepta los permisos (la primera vez pide autorización).
3. Vuelve a la hoja: deben existir las pestañas `Respuestas` (con una fila de prueba) y `Publico`.
4. Borra la fila de prueba y ejecuta `actualizarConteo`.

## 4. Publicar el script como aplicación web
1. **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier persona**.
4. Implementar. Copia la URL que termina en `/exec`.

> Cada vez que edites `codigo.gs` hay que crear una **nueva versión** de la implementación
> (Implementar → Administrar implementaciones → editar → versión nueva). Si no, el sitio sigue usando el script viejo.

## 5. Pegar la URL en el sitio
En `assets/js/contenido.js`:

```js
formulario: {
  endpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
  conteo_url: "",            // vacío: el conteo también sale del endpoint
  publicacion_horas: 24
}
```

Con eso el formulario ya guarda en la hoja y el sitio lee el conteo y el directorio.

## 6. (Opcional) Conteo por CSV en vez del endpoint
Si prefieres que el conteo salga de una pestaña publicada:
1. **Archivo → Compartir → Publicar en la web**.
2. Elige **solo la pestaña `Publico`** y el formato **CSV**.
3. Pega la URL en `conteo_url`.

Nunca publiques la pestaña `Respuestas`.

---

## Cómo funciona la publicación a las 24 horas

Cuando alguien se registra:

1. Se guarda la fila con la fecha y una columna `publicar_desde` = fecha + 24 h.
2. El conteo del estado sube **de inmediato** (la ficha de capítulo muestra `QLD · 43 miembros`).
3. Si la persona marcó **«autorizo que mi nombre y foto se publiquen»**, su tarjeta aparece en el
   **directorio de miembros** de `unete.html` cuando se cumple `publicar_desde`. Antes de eso no sale.
4. Si no la marcó, su nombre **nunca** aparece; solo cuenta en el total.

Esas 24 horas son la ventana de revisión del board: si un registro no corresponde (spam, broma,
datos falsos), **borra la fila antes de que se cumpla el plazo** y nunca llega a publicarse.
Para revisar rápido, ordena la pestaña `Respuestas` por la columna `publicar_desde`.

Para cambiar la ventana: edita `HORAS_ESPERA` en `codigo.gs` (y vuelve a implementar) y
`publicacion_horas` en `contenido.js`. Deben coincidir.

## Qué devuelve el endpoint (GET `…/exec?accion=publico`)

```json
{
  "ok": true,
  "conteo": { "QLD": 43, "NSW": 12, "VIC": 0, "ACT": 0, "SA": 0, "WA": 0, "NT": 0, "TAS": 0 },
  "miembros": [
    { "nombre": "María Quispe", "estado": "QLD", "area": "Data / IA", "rol": "Data Engineer",
      "linkedin": "https://www.linkedin.com/in/...", "fecha": "2026-08-20T03:12:00.000Z" }
  ],
  "pendientes": 2,
  "horas_espera": 24
}
```

**Nunca** incluye correos, ciudades, niveles ni a nadie que no haya autorizado la publicación.

## Modo de prueba (sin endpoint)

Mientras `endpoint` esté vacío, el formulario funciona en **modo de prueba**: guarda el registro
solo en el navegador de quien lo llenó (`localStorage`) y aplica la misma regla de 24 h, para que
puedas probar el flujo completo antes de montar la hoja. El sitio lo indica con el texto
«modo de prueba · solo este navegador». Nada sale de ese navegador. En cuanto pegues el endpoint,
el modo de prueba deja de usarse.

## Dar de baja a alguien
1. Borra su fila en `Respuestas`.
2. Ejecuta `actualizarConteo` (o espera al siguiente registro, que lo hace solo).
3. El directorio lo deja de mostrar en la siguiente carga de la página.

## Reglas permanentes
- La hoja **nunca** se descarga al repositorio (`.gitignore` bloquea `.xlsx` y `.csv`).
- La pestaña `Respuestas` **nunca** se publica en la web.
- La URL `/exec` puede estar en el código público: solo permite registrar y leer datos ya públicos.
- Dos administradores de la hoja como mínimo.
