// ==========================================================================
// FORTEX SOLUCIONS — site script
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Terminal boot-sequence animation ---------- */
const terminalLines = [
  { text: '> iniciando diagnóstico Fortex...', cls: 'prompt' },
  { text: '> escaneando red local ........... [OK]', cls: 'ok' },
  { text: '> verificando firewall ........... [OK]', cls: 'ok' },
  { text: '> respaldo automático ............ [OK]', cls: 'ok' },
  { text: '> antivirus actualizado .......... [OK]', cls: 'ok' },
  { text: '> equipo listo para trabajar', cls: 'prompt' },
];

const terminalEl = document.getElementById('terminal-body');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeTerminal() {
  if (!terminalEl) return;
  terminalEl.textContent = '';

  if (prefersReducedMotion) {
    terminalLines.forEach(line => {
      const span = document.createElement('span');
      span.className = line.cls;
      span.textContent = line.text + '\n';
      terminalEl.appendChild(span);
    });
    return;
  }

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= terminalLines.length) {
      setTimeout(typeTerminal, 4200); // restart the boot sequence
      return;
    }
    const line = terminalLines[lineIndex];
    const span = document.createElement('span');
    span.className = line.cls;
    terminalEl.appendChild(span);

    let charIndex = 0;
    const speed = 18;

    (function typeChar() {
      if (charIndex < line.text.length) {
        span.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        span.textContent += '\n';
        lineIndex++;
        setTimeout(typeLine, 260);
      }
    })();
  }

  typeLine();
}

typeTerminal();

/* ---------- Contact form: send via WhatsApp or Email ---------- */
const PHONE_INTL = '50670891135'; // Costa Rica country code + local number
const EMAIL_TO = 'fortexsolucions@gmail.com';

const form = document.getElementById('contact-form');
const noteEl = document.getElementById('form-note');

function readForm() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  return { name, phone, email, service, message };
}

function validate({ name, message }) {
  if (!name || !message) {
    noteEl.textContent = 'Completá al menos tu nombre y el mensaje antes de enviar.';
    noteEl.classList.add('error');
    return false;
  }
  noteEl.classList.remove('error');
  noteEl.textContent = '';
  return true;
}

function buildBody(data) {
  const lines = [
    `Nombre: ${data.name}`,
    data.phone ? `Teléfono: ${data.phone}` : null,
    data.email ? `Correo: ${data.email}` : null,
    `Servicio de interés: ${data.service}`,
    '',
    'Mensaje:',
    data.message,
  ].filter(Boolean);
  return lines.join('\n');
}

document.getElementById('send-whatsapp').addEventListener('click', () => {
  const data = readForm();
  if (!validate(data)) return;

  const text = `Hola Fortex Solucions, mi nombre es ${data.name}.\n\n${buildBody(data)}`;
  const url = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');

  noteEl.textContent = 'Abriendo WhatsApp con tu mensaje listo para enviar...';
});

document.getElementById('send-email').addEventListener('click', () => {
  const data = readForm();
  if (!validate(data)) return;

  const subject = `Consulta desde la web — ${data.service}`;
  const body = buildBody(data);
  const url = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;

  noteEl.textContent = 'Abriendo tu cliente de correo con el mensaje listo para enviar...';
});
