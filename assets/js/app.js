/* ==================================================================
   PERUTECHAU — MOTOR DE RENDER
   ------------------------------------------------------------------
   Se carga en las cuatro páginas y renderiza solo lo que existe en
   cada una: antes de escribir en un elemento comprueba que esté.
   Si un bloque falla, el error queda contenido en esa sección.
   Todo texto visible pasa por esc() antes de insertarse.
   ================================================================== */
(function () {
  "use strict";

  /* ---------------- UTILIDADES ---------------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const urlSegura = (u) => {
    const s = String(u || "").trim();
    return /^https?:\/\//i.test(s) ? s : "";
  };
  const iniciales = (nombre) => String(nombre || "")
    .trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
  const fechaLegible = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  };
  const bloque = (id, fn) => {
    const el = $(id);
    if (!el) return;
    try { fn(el); }
    catch (err) {
      console.error("[PeruTechAU] Falló el bloque #" + id, err);
      el.innerHTML = '<p class="aviso-carga">Este contenido no se pudo cargar.</p>';
    }
  };

  const HAY_CONTENIDO = typeof CONTENIDO === "object" && CONTENIDO !== null;
  const C = HAY_CONTENIDO ? CONTENIDO : {};
  const FORM = C.formulario || {};
  const HORAS_PUBLICACION = Number(FORM.publicacion_horas) > 0 ? Number(FORM.publicacion_horas) : 24;
  const MS_PUBLICACION = HORAS_PUBLICACION * 60 * 60 * 1000;
  const ENDPOINT = String(FORM.endpoint || "").trim();
  const CLAVE_DEMO = "ptau_registros_demo";

  if (!HAY_CONTENIDO) {
    console.error("[PeruTechAU] No se encontró CONTENIDO. Revisa assets/js/contenido.js");
  }

  /* ---------------- REVELADO AL HACER SCROLL ---------------- */
  // Se define antes que los bloques porque varios lo usan al renderizar.
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observador = (!reducirMovimiento && "IntersectionObserver" in window)
    ? new IntersectionObserver((entradas) => {
        entradas.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("visible"); observador.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
    : null;
  function observarRevelar(raiz) {
    (raiz || document).querySelectorAll(".revelar:not(.visible)").forEach((el) => {
      if (observador) observador.observe(el); else el.classList.add("visible");
    });
  }

  /* ---------------- NAVEGACIÓN ---------------- */
  (function nav() {
    const nav = $("nav");
    const boton = $("navBoton");
    const enlaces = $("navEnlaces");
    if (!nav) return;

    const archivo = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    nav.querySelectorAll("a[href]").forEach((a) => {
      const destino = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (destino && destino === archivo) a.setAttribute("aria-current", "page");
    });

    const alScroll = () => nav.classList.toggle("con-borde", window.scrollY > 8);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });

    if (!boton || !enlaces) return;
    const cerrar = (devolverFoco) => {
      enlaces.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      if (devolverFoco) boton.focus();
    };
    boton.addEventListener("click", () => {
      const abierto = enlaces.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", String(abierto));
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      if (abierto) { const primero = enlaces.querySelector("a"); if (primero) primero.focus(); }
    });
    enlaces.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && enlaces.classList.contains("abierto")) cerrar(true);
    });
  })();

  /* ---------------- PIE ---------------- */
  (function pie() {
    const contacto = C.contacto || {};
    const correo = $("pieCorreo");
    const linkedin = $("pieLinkedin");
    if (correo && contacto.correo) correo.href = "mailto:" + contacto.correo;
    if (linkedin) {
      const u = urlSegura(contacto.linkedin);
      if (u) linkedin.href = u; else linkedin.hidden = true;
    }
  })();

  /* ---------------- INICIO ---------------- */
  bloque("heroEyebrow", (el) => { el.textContent = (C.hero || {}).eyebrow || ""; });
  bloque("heroTitulo", (el) => { el.textContent = (C.hero || {}).titulo || ""; });
  bloque("heroBajada", (el) => { el.textContent = (C.hero || {}).bajada || ""; });

  bloque("cifras", (el) => {
    const cifras = Array.isArray(C.cifras) ? C.cifras : [];
    if (!cifras.length) { el.remove(); return; }
    el.innerHTML = cifras.map((c) => `
      <div class="cifra">
        <div class="cifra-valor degradado">${esc(c.valor)}</div>
        <p class="cifra-etiqueta">${esc(c.etiqueta)}</p>
      </div>`).join("");
  });

  bloque("nosotrosTitulo", (el) => { el.textContent = (C.nosotros || {}).titulo || ""; });
  bloque("nosotrosTexto", (el) => { el.textContent = (C.nosotros || {}).texto || ""; });
  bloque("mision", (el) => { el.textContent = (C.nosotros || {}).mision || ""; });
  bloque("vision", (el) => { el.textContent = (C.nosotros || {}).vision || ""; });

  bloque("pilares", (el) => {
    const pilares = Array.isArray(C.pilares) ? C.pilares : [];
    el.innerHTML = pilares.map((p) => `
      <article class="pilar revelar">
        <p class="mono"><span>${esc(p.n)}</span><span>${esc(p.clave)}</span></p>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.texto)}</p>
      </article>`).join("");
  });

  bloque("workshopsLista", (el) => {
    const lista = (Array.isArray(C.workshops) ? C.workshops : [])
      .slice().sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    const seccion = el.closest("section");
    if (!lista.length) { if (seccion) seccion.remove(); else el.remove(); return; }
    el.innerHTML = lista.map((w) => {
      const url = urlSegura(w.linkedin_url);
      const imagen = w.imagen
        ? `<img src="${esc(w.imagen)}" alt="" loading="lazy" onerror="this.remove()">` : "";
      const interior = `
        <div class="workshop-imagen">${imagen}</div>
        <div>
          <span class="mono">${esc(fechaLegible(w.fecha))}</span>
          <h3>${esc(w.titulo)}</h3>
          <p>${esc(w.descripcion)}</p>
        </div>
        <span class="workshop-flecha" aria-hidden="true">→</span>`;
      return url
        ? `<a class="workshop revelar" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${interior}</a>`
        : `<article class="workshop revelar">${interior}</article>`;
    }).join("");
  });

  bloque("respaldoLista", (el) => {
    const lista = Array.isArray(C.respaldo) ? C.respaldo : [];
    const seccion = el.closest("section");
    if (!lista.length) { if (seccion) seccion.remove(); return; }
    el.innerHTML = lista.map((r) => r.logo
      ? `<span class="respaldo-item"><img class="respaldo-logo" src="${esc(r.logo)}" alt="${esc(r.nombre)}" loading="lazy"
           onerror="this.parentNode.outerHTML='<span class=\\'respaldo-nombre\\'>${esc(r.nombre)}</span>'"></span>`
      : `<span class="respaldo-nombre">${esc(r.nombre)}</span>`).join("");
  });

  /* ---------------- CAPÍTULOS ---------------- */
  const CAPITULOS = Array.isArray(C.capitulos) ? C.capitulos : [];
  const capituloPorCodigo = (codigo) => CAPITULOS.find((c) => c.codigo === codigo);
  const correoContacto = () => (C.contacto || {}).correo || "";
  const UMBRAL_ARRANQUE = 10;

  function mailtoAbrir(cap) {
    const asunto = encodeURIComponent(`Quiero abrir el capítulo de ${cap.nombre} (${cap.codigo})`);
    return `mailto:${correoContacto()}?subject=${asunto}`;
  }

  function renderMapa() {
    const nodos = $("nodos"), enlaces = $("enlaces"), rejilla = $("rejilla");
    if (!nodos || !enlaces || !rejilla) return;
    const svg = nodos.ownerSVGElement;
    const W = 620, H = 500;
    const px = (c) => ({ x: (c.x / 100) * W, y: (c.y / 100) * H });

    let rej = '<g class="mapa-rejilla">';
    for (let x = 0; x <= W; x += 62) rej += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
    for (let y = 0; y <= H; y += 62.5) rej += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
    rejilla.innerHTML = rej + "</g>";

    const activos = CAPITULOS.filter((c) => c.activo);
    enlaces.innerHTML = activos.map((a) => CAPITULOS.filter((c) => !c.activo).map((d) => {
      const p = px(a), q = px(d);
      return `<line class="mapa-enlace" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
    }).join("")).join("");

    nodos.innerHTML = CAPITULOS.map((c) => {
      const p = px(c);
      const etiqueta = c.activo
        ? `${c.nombre}, ${c.estado}: capítulo activo`
        : `${c.nombre}, ${c.estado}: sin capítulo todavía. ¿Lo abres tú?`;
      const extra = c.activo
        ? `<circle class="halo" cx="${p.x}" cy="${p.y}" r="26"/><circle class="resplandor" cx="${p.x}" cy="${p.y}" r="16"/>` : "";
      const dx = c.x > 80 ? -18 : 18, anchor = c.x > 80 ? "end" : "start";
      return `<g class="nodo ${c.activo ? "nodo-activo" : "nodo-dormido"}" tabindex="0" role="img"
                 aria-label="${esc(etiqueta)}" data-codigo="${esc(c.codigo)}">
        <title>${esc(etiqueta)}</title>${extra}
        <circle class="base" cx="${p.x}" cy="${p.y}" r="${c.activo ? 9 : 7}"/>
        <text x="${p.x + dx}" y="${p.y + 4}" text-anchor="${anchor}">${esc(c.codigo)}</text>
      </g>`;
    }).join("") + `<text class="mapa-mensaje" id="mapaMensaje" x="${W / 2}" y="${H - 18}" text-anchor="middle"></text>`;

    const mensaje = $("mapaMensaje");
    const mostrar = (g) => {
      const c = capituloPorCodigo(g.dataset.codigo);
      if (!c || !mensaje) return;
      mensaje.textContent = c.activo
        ? `${c.nombre.toUpperCase()} · CAPÍTULO ACTIVO`
        : "Sin capítulo todavía. ¿Lo abres tú?";
      mensaje.classList.add("visible");
    };
    const ocultar = () => mensaje && mensaje.classList.remove("visible");
    nodos.querySelectorAll(".nodo").forEach((g) => {
      g.addEventListener("mouseenter", () => mostrar(g));
      g.addEventListener("focus", () => mostrar(g));
      g.addEventListener("mouseleave", ocultar);
      g.addEventListener("blur", ocultar);
    });
    if (svg) svg.removeAttribute("aria-hidden");
  }

  function renderContador() {
    const texto = $("contadorTexto"), barra = $("contadorBarra");
    if (!texto || !barra) return;
    const total = CAPITULOS.length, activos = CAPITULOS.filter((c) => c.activo).length;
    texto.textContent = `${activos} / ${total} capítulos activos`;
    barra.style.width = total ? `${Math.round((activos / total) * 100)}%` : "0";
  }

  function renderFichas(conteo) {
    const el = $("capitulosLista");
    if (!el) return;
    el.innerHTML = CAPITULOS.map((c) => {
      const n = conteo && conteo[c.codigo] != null ? Number(conteo[c.codigo]) : Number(c.miembros || 0);
      const miembros = n > 0 ? `<p class="ficha-miembros">${esc(c.codigo)} · ${n} ${n === 1 ? "miembro" : "miembros"}</p>` : "";
      if (c.activo) {
        const correo = c.contacto || correoContacto();
        return `<article class="ficha ficha-activa revelar">
          <div class="ficha-cabecera"><span class="codigo">${esc(c.codigo)}</span><span class="etiqueta etiqueta-activa">Activo</span></div>
          <h3>${esc(c.nombre)}</h3>
          <p class="ficha-estado">${esc(c.estado)}</p>${miembros}
          <p class="ficha-texto">${esc(c.descripcion || "")}</p>
          ${correo ? `<a class="ficha-accion" href="mailto:${esc(correo)}">Escribir al capítulo →</a>` : ""}
        </article>`;
      }
      const texto = n >= UMBRAL_ARRANQUE
        ? "Ya hay gente suficiente para arrancar. ¿Lo abres tú?"
        : "Sin capítulo todavía. ¿Lo abres tú?";
      return `<article class="ficha ficha-dormida revelar" aria-disabled="true">
        <div class="ficha-cabecera"><span class="codigo">${esc(c.codigo)}</span><span class="etiqueta etiqueta-proximamente">Próximamente</span></div>
        <h3>${esc(c.nombre)}</h3>
        <p class="ficha-estado">${esc(c.estado)}</p>${miembros}
        <p class="ficha-texto">${texto}</p>
        <a class="ficha-accion" href="${esc(mailtoAbrir(c))}">Quiero abrir este capítulo →</a>
      </article>`;
    }).join("");
    observarRevelar(el);
  }

  bloque("nodos", renderMapa);
  bloque("contadorTexto", renderContador);
  bloque("capitulosLista", () => renderFichas(null));

  bloque("directivaLista", (el) => {
    const lista = Array.isArray(C.directiva) ? C.directiva : [];
    el.innerHTML = lista.map((p) => {
      const li = urlSegura(p.linkedin);
      const foto = p.foto
        ? `<img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy"
             onerror="this.outerHTML='<span class=\\'persona-iniciales\\'>${esc(iniciales(p.nombre))}</span>'">`
        : `<span class="persona-iniciales" aria-hidden="true">${esc(iniciales(p.nombre))}</span>`;
      return `<article class="persona revelar">
        <div class="persona-foto">${foto}</div>
        <h3>${esc(p.nombre)}</h3>
        <span class="mono cargo">${esc(p.cargo)}</span>
        ${p.bio ? `<p>${esc(String(p.bio).slice(0, 240))}</p>` : ""}
        ${li ? `<a href="${esc(li)}" target="_blank" rel="noopener noreferrer">LinkedIn →</a>` : ""}
      </article>`;
    }).join("");
  });

  /* ---------------- SERVICIOS ---------------- */
  bloque("serviciosLista", (el) => {
    const lista = Array.isArray(C.servicios) ? C.servicios : [];
    if (!lista.length) {
      el.innerHTML = `<p class="vacio">Estamos preparando nuestros próximos programas. Escríbenos si quieres saber cuándo abren.</p>`;
      return;
    }
    el.innerHTML = lista.map((s) => `
      <article class="vidrio servicio revelar">
        <div class="servicio-cabecera">
          <span class="mono">${esc(s.capitulo || "Todos los capítulos")}</span>
          ${s.gratuito ? `<span class="etiqueta etiqueta-gratis">Gratuito</span>` : ""}
        </div>
        <h3>${esc(s.nombre)}</h3>
        <p>${esc(s.descripcion)}</p>
      </article>`).join("");
  });

  /* ---------------- DATOS PÚBLICOS (conteo + directorio) ---------------- */
  // Modo demo: sin endpoint, los registros se guardan solo en este
  // navegador para poder probar el flujo completo antes de conectar
  // la hoja de cálculo. Nunca se usa cuando hay endpoint.
  const demo = {
    activo: () => !ENDPOINT,
    leer() {
      try { const v = JSON.parse(localStorage.getItem(CLAVE_DEMO) || "[]"); return Array.isArray(v) ? v : []; }
      catch (_) { return []; }
    },
    guardar(lista) { try { localStorage.setItem(CLAVE_DEMO, JSON.stringify(lista)); } catch (_) {} },
    agregar(reg) {
      const lista = this.leer().filter((r) => r.correo !== reg.correo);
      lista.push(reg);
      this.guardar(lista);
    },
    publico() {
      const ahora = Date.now();
      const todos = this.leer();
      const conteo = {};
      todos.forEach((r) => { conteo[r.estado] = (conteo[r.estado] || 0) + 1; });
      const listos = todos.filter((r) => r.consent_publico && ahora - new Date(r.fecha).getTime() >= MS_PUBLICACION);
      const pendientes = todos.filter((r) => r.consent_publico && ahora - new Date(r.fecha).getTime() < MS_PUBLICACION).length;
      return {
        ok: true, demo: true, conteo, pendientes,
        miembros: listos.map((r) => ({ nombre: r.nombre, estado: r.estado, area: r.area, rol: r.rol, linkedin: r.linkedin, fecha: r.fecha }))
      };
    }
  };

  function parsearCSV(texto) {
    const conteo = {};
    String(texto).split(/\r?\n/).forEach((linea) => {
      const [codigo, n] = linea.split(",").map((s) => String(s || "").trim().replace(/^"|"$/g, ""));
      if (codigo && /^\d+$/.test(n || "")) conteo[codigo.toUpperCase()] = Number(n);
    });
    return conteo;
  }

  async function cargarPublico() {
    if (demo.activo()) return demo.publico();
    const salida = { ok: true, conteo: null, miembros: [], pendientes: 0 };
    try {
      const r = await fetch(ENDPOINT + (ENDPOINT.includes("?") ? "&" : "?") + "accion=publico", { cache: "no-store" });
      const j = await r.json();
      if (j && j.ok) {
        salida.conteo = j.conteo || null;
        salida.miembros = Array.isArray(j.miembros) ? j.miembros : [];
        salida.pendientes = Number(j.pendientes || 0);
        return salida;
      }
    } catch (err) { console.warn("[PeruTechAU] No se pudo leer el endpoint", err); }
    const csv = String(FORM.conteo_url || "").trim();
    if (csv) {
      try { salida.conteo = parsearCSV(await (await fetch(csv, { cache: "no-store" })).text()); }
      catch (err) { console.warn("[PeruTechAU] No se pudo leer el CSV de conteo", err); }
    }
    return salida;
  }

  const publicoPromesa = ($("capitulosLista") || $("directorioLista")) ? cargarPublico() : null;

  if (publicoPromesa) {
    publicoPromesa.then((pub) => {
      if (pub.conteo && $("capitulosLista")) renderFichas(pub.conteo);
      renderDirectorio(pub);
    }).catch((err) => console.warn("[PeruTechAU] Datos públicos no disponibles", err));
  }

  /* ---------------- DIRECTORIO DE MIEMBROS ---------------- */
  // Muestra solo a quienes marcaron el consentimiento de publicación y
  // cuyo registro tiene al menos HORAS_PUBLICACION de antigüedad. El
  // filtro real se aplica en el servidor (codigo.gs); aquí se vuelve a
  // aplicar por si acaso.
  function renderDirectorio(pub) {
    const el = $("directorioLista"), nota = $("directorioNota"), filtros = $("directorioFiltros");
    if (!el) return;
    const ahora = Date.now();
    const miembros = (pub.miembros || []).filter((m) => {
      const t = new Date(m.fecha).getTime();
      return m.nombre && (isNaN(t) || ahora - t >= MS_PUBLICACION);
    }).sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

    if (nota) {
      const partes = [`${miembros.length} ${miembros.length === 1 ? "miembro publicado" : "miembros publicados"}`];
      if (pub.pendientes > 0) partes.push(`${pub.pendientes} en espera de ${HORAS_PUBLICACION} h`);
      if (pub.demo) partes.push("modo de prueba · solo este navegador");
      nota.textContent = partes.join(" · ");
    }

    const pintar = (codigo) => {
      const lista = codigo ? miembros.filter((m) => m.estado === codigo) : miembros;
      if (!lista.length) {
        el.innerHTML = `<p class="vacio">${codigo
          ? "Todavía no hay miembros publicados en este estado."
          : `Todavía no hay miembros publicados. Cada registro aparece aquí ${HORAS_PUBLICACION} horas después de completarse, solo si la persona autorizó publicar su nombre.`}</p>`;
        return;
      }
      el.innerHTML = lista.map((m) => {
        const cap = capituloPorCodigo(m.estado);
        const li = urlSegura(m.linkedin);
        const t = new Date(m.fecha).getTime();
        const nuevo = !isNaN(t) && ahora - t < 7 * 24 * 60 * 60 * 1000;
        const foto = urlSegura(m.foto);
        return `<article class="vidrio miembro">
          <div class="miembro-avatar" aria-hidden="true">${foto ? `<img src="${esc(foto)}" alt="" loading="lazy">` : esc(iniciales(m.nombre))}</div>
          <div class="miembro-cuerpo">
            <span class="mono">${esc(m.estado)}${cap ? " · " + esc(cap.nombre) : ""}</span>
            <h3>${esc(m.nombre)}${nuevo ? '<span class="miembro-nuevo">Nuevo</span>' : ""}</h3>
            ${m.area || m.rol ? `<p>${esc([m.rol, m.area].filter(Boolean).join(" · "))}</p>` : ""}
            ${li ? `<a href="${esc(li)}" target="_blank" rel="noopener noreferrer">LinkedIn →</a>` : ""}
          </div>
        </article>`;
      }).join("");
    };

    if (filtros) {
      const estados = CAPITULOS.filter((c) => miembros.some((m) => m.estado === c.codigo));
      filtros.innerHTML = estados.length
        ? `<button class="filtro" type="button" aria-pressed="true" data-codigo="">Todos</button>` +
          estados.map((c) => `<button class="filtro" type="button" aria-pressed="false" data-codigo="${esc(c.codigo)}">${esc(c.codigo)} · ${esc(c.nombre)}</button>`).join("")
        : "";
      filtros.addEventListener("click", (e) => {
        const b = e.target.closest(".filtro");
        if (!b) return;
        filtros.querySelectorAll(".filtro").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        pintar(b.dataset.codigo || "");
      });
    }
    pintar("");
  }

  /* ---------------- FORMULARIO ---------------- */
  bloque("formRegistro", (form) => {
    const op = C.opciones || {};
    const llenar = (id, lista, placeholder) => {
      const sel = $(id);
      if (!sel) return;
      sel.innerHTML = `<option value="">${esc(placeholder)}</option>` +
        lista.map((o) => typeof o === "string"
          ? `<option value="${esc(o)}">${esc(o)}</option>`
          : `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
    };
    llenar("f_estado", CAPITULOS.map((c) => ({ value: c.codigo, label: `${c.estado} (${c.codigo})` })), "Elige tu estado");
    llenar("f_area", op.area || [], "Elige un área");
    llenar("f_nivel", op.nivel || [], "Elige tu nivel (opcional)");
    llenar("f_voluntario", op.voluntario || [], "Elige una opción (opcional)");

    const estado = $("formEstado"), boton = $("formBoton");
    const mostrar = (texto, tipo) => {
      if (!estado) return;
      estado.textContent = texto;
      estado.className = "form-estado" + (tipo ? " " + tipo : "");
    };
    const marcarError = (campo, texto) => {
      campo.setAttribute("aria-invalid", "true");
      const contenedor = campo.closest(".campo") || campo.closest(".consentimiento");
      if (contenedor && !contenedor.querySelector(".campo-error")) {
        const p = document.createElement("p");
        p.className = "campo-error";
        p.id = campo.id + "_error";
        p.textContent = texto;
        contenedor.appendChild(p);
        campo.setAttribute("aria-describedby", p.id);
      }
    };
    const limpiarErrores = () => {
      form.querySelectorAll("[aria-invalid]").forEach((c) => { c.removeAttribute("aria-invalid"); c.removeAttribute("aria-describedby"); });
      form.querySelectorAll(".campo-error").forEach((p) => p.remove());
      mostrar("", "");
    };
    form.querySelectorAll("input, select").forEach((c) => {
      c.addEventListener("input", () => {
        if (c.getAttribute("aria-invalid")) {
          c.removeAttribute("aria-invalid");
          const p = $(c.id + "_error"); if (p) p.remove();
        }
      });
    });

    const validar = () => {
      const errores = [];
      const v = (id) => { const c = $(id); return c ? String(c.value || "").trim() : ""; };
      if (!v("f_nombre") || v("f_nombre").length < 3) errores.push(["f_nombre", "Escribe tu nombre y apellidos."]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("f_correo"))) errores.push(["f_correo", "Escribe un correo válido."]);
      if (!v("f_estado")) errores.push(["f_estado", "Elige el estado donde vives."]);
      if (!v("f_area")) errores.push(["f_area", "Elige tu área o especialidad."]);
      const li = v("f_linkedin");
      if (li && !/^https?:\/\/([a-z0-9-]+\.)?linkedin\.com\//i.test(li)) errores.push(["f_linkedin", "Debe ser un enlace de linkedin.com (o déjalo vacío)."]);
      const consent = $("f_consent1");
      if (consent && !consent.checked) errores.push(["f_consent1", "Necesitamos tu autorización para guardar tus datos."]);
      return errores;
    };

    const datos = () => {
      const fd = new FormData(form);
      const o = {};
      fd.forEach((val, k) => { o[k] = typeof val === "string" ? val.trim() : val; });
      o.consent_datos = !!$("f_consent1") && $("f_consent1").checked;
      o.consent_publico = !!$("f_consent2") && $("f_consent2").checked;
      o.origen = location.hostname || "local";
      return o;
    };

    const confirmar = (reg, resultado) => {
      const publico = reg.consent_publico;
      const cuando = publico
        ? `Como autorizaste publicar tu nombre, aparecerás en el directorio de miembros dentro de ${HORAS_PUBLICACION} horas.`
        : `Solo sumaremos tu registro al conteo de ${esc(reg.estado)}; tu nombre no se publica porque no marcaste esa casilla.`;
      const demoAviso = resultado && resultado.demo
        ? `<p class="mono" style="margin-top:16px">Modo de prueba: este registro solo se guardó en este navegador. Conecta el endpoint para guardarlo en la hoja de cálculo.</p>` : "";
      form.outerHTML = `<div class="vidrio confirmacion revelar visible" role="status" aria-live="polite">
        <p class="mono">Registro recibido</p>
        <h2>Listo, ya eres parte del directorio.</h2>
        <p>${cuando}</p>
        <p>Si quieres corregir o borrar tus datos, escríbenos a <a href="mailto:${esc(correoContacto())}">${esc(correoContacto())}</a>.</p>
        ${demoAviso}
        <a class="btn btn-fantasma" href="capitulos.html" style="margin-top:20px">Ver los capítulos</a>
      </div>`;
      if (publicoPromesa && $("directorioLista")) cargarPublico().then(renderDirectorio);
    };

    async function enviar(reg) {
      if (demo.activo()) {
        demo.agregar({
          nombre: reg.nombre, correo: reg.correo, estado: reg.estado, area: reg.area,
          rol: reg.rol, linkedin: urlSegura(reg.linkedin), consent_publico: reg.consent_publico,
          fecha: new Date().toISOString()
        });
        return { ok: true, demo: true };
      }
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(reg)
      });
      const j = await r.json().catch(() => ({ ok: r.ok }));
      if (!j || !j.ok) throw new Error((j && j.error) || "Respuesta inválida del servidor");
      return j;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      limpiarErrores();
      const reg = datos();
      if (reg.sitio_web) { confirmar(reg, { ok: true }); return; } // bot: se descarta en silencio
      const errores = validar();
      if (errores.length) {
        errores.forEach(([id, texto]) => { const c = $(id); if (c) marcarError(c, texto); });
        mostrar("Faltan datos obligatorios. Revisa los campos marcados.", "error");
        const primero = $(errores[0][0]); if (primero) primero.focus();
        return;
      }
      delete reg.sitio_web;
      if (boton) { boton.disabled = true; boton.textContent = "Enviando…"; }
      try {
        const resultado = await enviar(reg);
        confirmar(reg, resultado);
      } catch (err) {
        console.error("[PeruTechAU] Error al enviar", err);
        mostrar(`No pudimos guardar tu registro. Inténtalo de nuevo o escríbenos a ${correoContacto()}.`, "error");
        if (boton) { boton.disabled = false; boton.textContent = "Registrarme"; }
      }
    });
  });

  /* ---------------- REVELADO: arranque ---------------- */
  observarRevelar(document);
  new MutationObserver(() => observarRevelar(document)).observe(document.body, { childList: true, subtree: true });

  /* ==================================================================
     SELECTOR DE PALETA — SOLO PARA ELEGIR.
     Cuando el board decida, borra este bloque y el <aside
     id="selectorPaleta"> de las cuatro páginas.
     ================================================================== */
  (function selectorPaleta() {
    const aside = $("selectorPaleta");
    if (!aside) return;
    const CLAVE = "ptau_tema";
    const nombres = { bandera: "Bandera", pacifico: "Pacífico", vivo: "Vivo" };
    const aplicar = (tema, guardar) => {
      if (!nombres[tema]) return;
      document.documentElement.setAttribute("data-tema", tema);
      const n = $("nombrePaleta"); if (n) n.textContent = nombres[tema];
      aside.querySelectorAll("button[data-p]").forEach((b) => {
        b.style.borderColor = b.dataset.p === tema ? "#fff" : "transparent";
        b.setAttribute("aria-pressed", String(b.dataset.p === tema));
      });
      if (guardar) { try { localStorage.setItem(CLAVE, tema); } catch (_) {} }
    };
    let guardado = null;
    try { guardado = localStorage.getItem(CLAVE); } catch (_) {}
    aplicar(guardado || document.documentElement.getAttribute("data-tema") || "bandera", false);
    aside.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-p]");
      if (b) aplicar(b.dataset.p, true);
    });
  })();
})();
