/* ==================================================================
   CONTENIDO DEL SITIO
   ------------------------------------------------------------------
   Este archivo es lo ÚNICO que hay que editar para actualizar el sitio.
   Lo comparten las cuatro páginas: cambias algo aquí y cambia en todas.
   No hace falta tocar HTML ni CSS.

   · Para activar un capítulo: cambia "activo": false por true
     y agrega su descripción y contacto.
   · Para agregar un workshop: copia un bloque y pega el enlace
     de la publicación de LinkedIn.
   · Para agregar a alguien a la directiva: copia un bloque.
     Si no hay foto, se muestran las iniciales automáticamente.
   ================================================================== */
const CONTENIDO = {

  contacto: {
    correo: "hola@perutechau.org",              // ← reemplazar por el correo real
    linkedin: "https://www.linkedin.com/company/perutechau",  // ← reemplazar
    // Grupo oficial de WhatsApp de la comunidad. Si se deja vacío,
    // el enlace desaparece del pie de las cuatro páginas.
    whatsapp: "https://shorturl.at/cKht1"
  },

  /* ---------------- FORMULARIO Y BASE DE DATOS ----------------
     endpoint: la URL que entrega Google Apps Script al publicar el
     script como aplicación web (termina en /exec). Recibe los
     registros y devuelve el conteo por estado y el directorio.
     Mientras esté vacía, el formulario funciona en MODO DE PRUEBA:
     guarda el registro solo en el navegador de quien lo llenó.

     conteo_url: opcional. Si el endpoint no responde, de aquí salen
     los totales por estado (pestaña "Publico" publicada como CSV).
     Si ambos están vacíos, se usan los números escritos a mano en
     "miembros" dentro de cada capítulo.

     publicacion_horas: cuántas horas después del registro aparece
     una persona en el directorio de miembros (solo si autorizó
     publicar su nombre). 0 = de inmediato. Debe coincidir con
     HORAS_ESPERA en apps-script/codigo.gs.

     Ninguna de las URLs expone correos.
     ------------------------------------------------------------ */
  formulario: {
    endpoint: "https://script.google.com/macros/s/AKfycbw389v4nF3H6mYCqGqI6fplQaQFs-hW3J6QSBENpXVoyWAfBowiiyuDkenUGsoFgWW2/exec",
    conteo_url: "",
    publicacion_horas: 0
  },

  hero: {
    eyebrow: "Organización sin fines de lucro · Brisbane, Australia",
    titulo: "Talento peruano construyendo tecnología en Australia.",
    bajada: "Somos una comunidad de profesionales peruanos en tecnología radicados en Australia. Compartimos lo que sabemos, abrimos puertas y ayudamos a que el siguiente en llegar no empiece de cero."
  },

  // Las cifras del primer año. Si el board decide no publicarlas,
  // deja el array vacío: []  y la fila desaparece sola.
  cifras: [
    { valor: "130+", etiqueta: "Miembros en el primer año" },
    { valor: "85%",  etiqueta: "Satisfacción en nuestros workshops" },
    { valor: "7",    etiqueta: "Estados esperando su capítulo" }
  ],

  nosotros: {
    titulo: "Una comunidad que se construye entre todos",
    texto: "PeruTechAU nació en Brisbane como un grupo de profesionales peruanos que trabajan en tecnología en Australia. En nuestro primer año reunimos a más de 130 miembros y realizamos workshops presenciales donde la gente no solo aprende: sale con algo construido.",
    mision: "Conectar y fortalecer a la comunidad peruana de tecnología en Australia mediante formación práctica, mentoría y espacios de encuentro que abran oportunidades profesionales reales.",
    vision: "Que en cada estado de Australia exista un capítulo activo de PeruTechAU, y que ningún profesional peruano en tecnología tenga que abrirse camino solo."
  },

  pilares: [
    { n:"01", clave:"Conectar", titulo:"Encontrar a los tuyos",
      texto:"Una red de peruanos en tecnología repartidos por Australia, a un mensaje de distancia." },
    { n:"02", clave:"Formar", titulo:"Salir con algo hecho",
      texto:"Workshops donde se construye y se entrega un certificado que sirve para postular." },
    { n:"03", clave:"Abrir", titulo:"Dejar la puerta abierta",
      texto:"Cada capítulo nuevo empieza porque alguien decidió abrirlo." }
  ],

  // x / y son la posición en el mapa (0-100). Ya están calculadas
  // según la geografía real; normalmente no hay que tocarlas.
  // "miembros" se actualiza solo desde la hoja de cálculo si
  // configuraste endpoint o conteo_url. Si no, escribe el número a mano.
  capitulos: [
    { codigo:"QLD", nombre:"Brisbane",  estado:"Queensland",         activo:true,  x:95, y:52, miembros:0,
      descripcion:"Nuestro capítulo fundador.", contacto:"brisbane@perutechau.org" },
    { codigo:"NSW", nombre:"Sydney",    estado:"New South Wales",    activo:false, x:91, y:70, miembros:0 },
    { codigo:"VIC", nombre:"Melbourne", estado:"Victoria",           activo:false, x:77, y:82, miembros:0 },
    { codigo:"ACT", nombre:"Canberra",  estado:"Capital Territory",  activo:false, x:86, y:75, miembros:0 },
    { codigo:"SA",  nombre:"Adelaide",  estado:"South Australia",    activo:false, x:62, y:73, miembros:0 },
    { codigo:"WA",  nombre:"Perth",     estado:"Western Australia",  activo:false, x:9,  y:65, miembros:0 },
    { codigo:"NT",  nombre:"Darwin",    estado:"Northern Territory", activo:false, x:44, y:8,  miembros:0 },
    { codigo:"TAS", nombre:"Hobart",    estado:"Tasmania",           activo:false, x:82, y:96, miembros:0 }
  ],

  // Opciones de los desplegables del formulario.
  opciones: {
    area: ["Software / Desarrollo","Data / IA","Ciberseguridad","Cloud / DevOps",
           "Producto / Diseño UX","QA / Testing","IT Support / Redes",
           "Gestión de proyectos","Estudiante","Otro"],
    nivel: ["Estudiante o en transición","Junior (0-2 años)","Semi senior (3-5 años)",
            "Senior (6+ años)","Liderazgo / Management"],
    voluntario: ["Todavía no, solo quiero ser miembro","Sí, dictando o apoyando workshops",
                 "Sí, en tecnología (web, datos, seguridad)","Sí, en comunicación y comunidad",
                 "Sí, quiero abrir el capítulo de mi estado"]
  },

  directiva: [
    { nombre:"Marcos Burgos",   cargo:"Head",
      bio:"", foto:"assets/img/directiva-marcos.jpg", linkedin:"" },
    { nombre:"Yajaira Navarro", cargo:"General Director",
      bio:"", foto:"assets/img/directiva-yajaira.jpg", linkedin:"" },
    { nombre:"Catherine Varas", cargo:"IT Lead · Creadora de la web",
      bio:"", foto:"assets/img/directiva-catherine.jpg", linkedin:"" },
    { nombre:"Jhordy Novoa",    cargo:"Software & Cybersecurity Engineer",
      bio:"", foto:"assets/img/directiva-jhordy.jpg", linkedin:"" }
  ],

  // Solo lo confirmado por el board. No prometer que todo es gratuito:
  // habrá actividades con costo cuando haya invitados o materiales externos.
  // Marca "gratuito: true" únicamente en los servicios que sí lo son.
  servicios: [
    { nombre:"Mentoría 1 a 1 en Building Innovation Capabilities",
      descripcion:"Una sesión de una hora al mes, en persona, de septiembre a diciembre de 2026. Cupos limitados: cuatro personas en total.",
      gratuito:true, capitulo:"Queensland" }
  ],

  // Todo lo que la comunidad ya hizo, en orden: se ordena solo por fecha,
  // el más reciente aparece primero. Si dejas el array vacío [], la sección
  // entera desaparece.
  // ⚠️ PENDIENTE: pegar el "linkedin_url" de cada publicación y confirmar
  // las fechas marcadas como provisionales.
  workshops: [
    { titulo:"Meetup TechSuyo en Sydney", fecha:"2025-06-01",
      descripcion:"Marcos participó en el meetup de TechSuyo en Sydney, junto a la Embajada del Perú y PROMPERÚ. De ese encuentro salió la idea de armar PeruTechAU en Brisbane.",
      imagen:"assets/img/sydney-techsuyo.jpg", linkedin_url:"" },
    { titulo:"Hola Networking 2025", fecha:"2025-08-01",   // ⚠️ fecha provisional
      descripcion:"Participamos en Hola Networking 2025, en el Parlamento de Queensland, presentando la comunidad a profesionales latinoamericanos y a empresas australianas.",
      imagen:"assets/img/hola-networking.jpg", linkedin_url:"" },
    { titulo:"Primera reunión de la comunidad", fecha:"2025-09-01",   // ⚠️ fecha provisional
      descripcion:"La primera vez que nos juntamos en persona en un parque de Brisbane, para conocernos y decidir qué queríamos construir.",
      imagen:"assets/img/reunion.jpg", linkedin_url:"" },

    // ⚠️ PENDIENTE — PRIMER WORKSHOP: falta la foto y el enlace de LinkedIn.
    // Copia la foto a assets/img/workshop-primero.jpg, quita las barras de
    // las cuatro líneas de abajo y completa título, fecha y enlace.
    // { titulo:"", fecha:"2025-10-01",
    //   descripcion:"",
    //   imagen:"assets/img/workshop-primero.jpg", linkedin_url:"" },

    { titulo:"Crea tu landing page", fecha:"2025-11-01",   // ⚠️ fecha provisional · segundo workshop
      descripcion:"Segundo workshop presencial: cada participante construyó y publicó su propia landing page, y se llevó su certificado de participación.",
      imagen:"assets/img/workshop-1.jpg", linkedin_url:"" }
  ],

  // Logos institucionales. Coloca los archivos en assets/img/ y pon
  // aquí la ruta. Si "logo" queda vacío, se muestra solo el nombre.
  respaldo: [
    { nombre:"Embajada del Perú en Australia", logo:"assets/img/embajada.jpg" },
    { nombre:"PROMPERÚ", logo:"assets/img/promperu.png" }
  ]
};
