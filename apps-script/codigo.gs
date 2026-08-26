/* ==================================================================
   PERUTECHAU — SCRIPT DE LA HOJA DE CÁLCULO (Google Apps Script)
   ------------------------------------------------------------------
   Este archivo NO se despliega con el sitio. Se pega en el editor de
   Apps Script de la hoja de cálculo (Extensiones → Apps Script) y se
   publica como aplicación web. Ver README-formulario.md.

   Qué hace:
   · doPost  → recibe un registro del formulario, lo valida y lo
               escribe en la pestaña "Respuestas". Si el correo ya
               existe, actualiza esa fila (sin duplicados).
   · doGet   → devuelve JSON con:
                 conteo    totales por estado (para las fichas)
                 miembros  quienes autorizaron publicar su nombre Y
                           cuyo registro tiene ≥ HORAS_ESPERA horas
                 pendientes cuántos autorizaron pero aún no cumplen
                           las horas
               Nunca devuelve correos ni datos de quien no autorizó.
   · actualizarConteo → recalcula la pestaña "Publico" (codigo,miembros).
   ================================================================== */

const HOJA_RESPUESTAS = "Respuestas";
const HOJA_PUBLICO = "Publico";
const HORAS_ESPERA = 0;                // horas antes de publicar un nombre (0 = de inmediato)
const AVISAR_A = "catyvaras19@gmail.com"; // recibe un correo por cada registro nuevo
const ESTADOS = ["QLD", "NSW", "VIC", "ACT", "SA", "WA", "NT", "TAS"];
const COLUMNAS = [
  "fecha", "nombre", "correo", "estado", "ciudad", "area", "nivel", "rol",
  "linkedin", "voluntario", "consent_datos", "consent_publico", "publicar_desde", "origen"
];

/* ---------------- ENTRADAS HTTP ---------------- */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const datos = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Trampa anti-spam: si el campo oculto viene lleno, es un bot.
    if (datos.sitio_web) return json_({ ok: true });

    const reg = validar_(datos);
    if (reg.error) return json_({ ok: false, error: reg.error });

    const hoja = hojaRespuestas_();
    const fila = filaPorCorreo_(hoja, reg.correo);
    const ahora = new Date();
    const publicarDesde = new Date(ahora.getTime() + HORAS_ESPERA * 3600 * 1000);
    const valores = [
      ahora, reg.nombre, reg.correo, reg.estado, reg.ciudad, reg.area, reg.nivel, reg.rol,
      reg.linkedin, reg.voluntario, "Sí", reg.consent_publico ? "Sí" : "No", publicarDesde, reg.origen
    ];

    if (fila > 0) {
      // Actualiza pero conserva la fecha original: no reinicia las 24 h.
      const fechaOriginal = aFecha_(hoja.getRange(fila, 1).getValue());
      const publicarOriginal = aFecha_(hoja.getRange(fila, 13).getValue());
      valores[0] = fechaOriginal || ahora;
      valores[12] = publicarOriginal || publicarDesde;
      hoja.getRange(fila, 1, 1, valores.length).setValues([valores]);
    } else {
      hoja.appendRow(valores);
    }

    actualizarConteo();
    if (AVISAR_A && fila === 0) avisar_(reg);

    return json_({ ok: true, actualizado: fila > 0, publicar_desde: valores[12].toISOString() });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet(e) {
  try {
    const accion = (e && e.parameter && e.parameter.accion) || "publico";
    if (accion === "diagnostico") return json_(diagnostico_());
    if (accion !== "publico") return json_({ ok: false, error: "Acción desconocida" });
    const pub = miembrosPublicos_();
    return json_({
      ok: true,
      conteo: conteoPorEstado_(),
      miembros: pub.miembros,
      pendientes: pub.pendientes,
      horas_espera: HORAS_ESPERA,
      actualizado: new Date().toISOString()
    });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/* ---------------- LÓGICA ---------------- */
function validar_(d) {
  const t = (v, max) => String(v == null ? "" : v).trim().slice(0, max || 200);
  const nombre = t(d.nombre, 120);
  const correo = t(d.correo, 160).toLowerCase();
  const estado = t(d.estado, 5).toUpperCase();
  const area = t(d.area, 80);
  const linkedin = t(d.linkedin, 200);

  if (nombre.length < 3) return { error: "Nombre inválido" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return { error: "Correo inválido" };
  if (ESTADOS.indexOf(estado) < 0) return { error: "Estado inválido" };
  if (!area) return { error: "Área obligatoria" };
  if (!(d.consent_datos === true || d.consent_datos === "true" || d.consent_datos === "on")) {
    return { error: "Falta el consentimiento de datos" };
  }
  if (linkedin && !/^https?:\/\/([a-z0-9-]+\.)?linkedin\.com\//i.test(linkedin)) return { error: "LinkedIn inválido" };

  return {
    nombre, correo, estado, area, linkedin,
    ciudad: t(d.ciudad, 80), nivel: t(d.nivel, 80), rol: t(d.rol, 120),
    voluntario: t(d.voluntario, 120), origen: t(d.origen, 80),
    consent_publico: d.consent_publico === true || d.consent_publico === "true" || d.consent_publico === "on"
  };
}

// Convierte lo que devuelve una celda (Date, número de serie o texto) en Date, o null.
// No se usa `instanceof Date`: en Apps Script falla con valores que vienen de la hoja.
function aFecha_(v) {
  if (v === null || v === undefined || v === "") return null;
  if (Object.prototype.toString.call(v) === "[object Date]") return isNaN(v.getTime()) ? null : v;
  if (typeof v === "number") return new Date(Math.round((v - 25569) * 86400 * 1000)); // serie de Sheets
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}
function esSi_(v) {
  const s = String(v === true ? "si" : v).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return s === "si" || s === "true" || s === "yes";
}

function miembrosPublicos_() {
  const filas = leerRespuestas_();
  const ahora = Date.now();
  const miembros = [], pendientesArr = [];
  filas.forEach(function (f) {
    if (!esSi_(f.consent_publico)) return;
    // La ventana vigente (HORAS_ESPERA) manda siempre: cambiarla aplica a todas las
    // filas, incluso a las escritas con otra ventana. publicar_desde queda informativo.
    const fecha = aFecha_(f.fecha);
    const publicar = fecha ? new Date(fecha.getTime() + HORAS_ESPERA * 3600 * 1000) : aFecha_(f.publicar_desde);
    if (!publicar) return;
    if (ahora >= publicar.getTime()) {
      miembros.push({
        nombre: f.nombre, estado: f.estado, area: f.area, rol: f.rol,
        linkedin: f.linkedin,
        fecha: fecha ? fecha.toISOString() : ""
      });
    } else {
      pendientesArr.push(f);
    }
  });
  return { miembros: miembros, pendientes: pendientesArr.length };
}

// GET …/exec?accion=diagnostico → estado interno SIN datos personales, para depurar.
function diagnostico_() {
  const filas = leerRespuestas_();
  return {
    ok: true,
    filas: filas.length,
    con_consentimiento_publico: filas.filter(function (f) { return esSi_(f.consent_publico); }).length,
    tipos_fecha: filas.slice(0, 3).map(function (f) {
      return { fecha: Object.prototype.toString.call(f.fecha), publicar_desde: Object.prototype.toString.call(f.publicar_desde),
               consent_publico: String(f.consent_publico), fecha_ok: !!aFecha_(f.fecha), publicar_ok: !!aFecha_(f.publicar_desde) };
    }),
    horas_espera: HORAS_ESPERA, avisar_a_configurado: !!AVISAR_A, ahora: new Date().toISOString()
  };
}

function conteoPorEstado_() {
  const conteo = {};
  ESTADOS.forEach(function (c) { conteo[c] = 0; });
  leerRespuestas_().forEach(function (f) {
    const c = String(f.estado || "").toUpperCase();
    if (conteo.hasOwnProperty(c)) conteo[c] += 1;
  });
  return conteo;
}

function actualizarConteo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(HOJA_PUBLICO);
  if (!hoja) hoja = ss.insertSheet(HOJA_PUBLICO);
  const conteo = conteoPorEstado_();
  const filas = [["codigo", "miembros"]].concat(ESTADOS.map(function (c) { return [c, conteo[c]]; }));
  hoja.clearContents();
  hoja.getRange(1, 1, filas.length, 2).setValues(filas);
}

/* ---------------- ACCESO A LA HOJA ---------------- */
function hojaRespuestas_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(HOJA_RESPUESTAS);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_RESPUESTAS);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function leerRespuestas_() {
  const hoja = hojaRespuestas_();
  const ultima = hoja.getLastRow();
  if (ultima < 2) return [];
  const valores = hoja.getRange(2, 1, ultima - 1, COLUMNAS.length).getValues();
  return valores
    .filter(function (v) { return String(v[2] || "").trim() !== ""; })
    .map(function (v) {
      const o = {};
      COLUMNAS.forEach(function (col, i) { o[col] = v[i]; });
      return o;
    });
}

function filaPorCorreo_(hoja, correo) {
  const ultima = hoja.getLastRow();
  if (ultima < 2) return 0;
  const correos = hoja.getRange(2, 3, ultima - 1, 1).getValues();
  for (let i = 0; i < correos.length; i++) {
    if (String(correos[i][0]).trim().toLowerCase() === correo) return i + 2;
  }
  return 0;
}

function avisar_(reg) {
  try {
    MailApp.sendEmail({
      to: AVISAR_A,
      subject: "PERUTECH REGISTRO - " + reg.nombre,
      body: "Nombre: " + reg.nombre + "\nEstado: " + reg.estado + "\nÁrea: " + reg.area +
            "\nPublicar nombre: " + (reg.consent_publico ? "Sí (en " + HORAS_ESPERA + " h)" : "No") +
            "\n\nRevisa la hoja de cálculo. Si no corresponde, borra la fila antes de que se publique."
    });
  } catch (_) {}
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- PRUEBA MANUAL (Ejecutar → probar) ---------------- */
function probar() {
  const r = doPost({ postData: { contents: JSON.stringify({
    nombre: "Prueba Interna", correo: "prueba@perutechau.org", estado: "QLD",
    area: "Software / Desarrollo", consent_datos: true, consent_publico: true, origen: "prueba"
  }) } });
  Logger.log(r.getContent());
  Logger.log(doGet({ parameter: { accion: "publico" } }).getContent());
}
