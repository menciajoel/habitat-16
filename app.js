'use strict';

/**
 * HABITAT 16 — app.js
 * Minimal JS: nav toggle, smooth anchor assist, WhatsApp CTAs, year.
 * No dependencies.
 */

(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
})();

const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

// Year
(() => {
  const y = qs('#y');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Mobile nav toggle
(() => {
  const btn = qs('[data-nav-toggle]');
  const nav = qs('[data-nav]');
  if (!btn || !nav) return;

  const mq = window.matchMedia('(max-width: 980px)');
  const header = qs('.site-header');

  const setHeaderHeight = () => {
    if (!header) return;
    const height = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  };

  const setState = (open) => {
    nav.dataset.open = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  const close = () => setState(false);
  const open = () => setState(true);
  const toggle = () => (nav.dataset.open === 'true' ? close() : open());

  btn.addEventListener('click', () => {
    if (!mq.matches) return;
    toggle();
  });

  qsa('a[href^="#"]', nav).forEach(a => {
    a.addEventListener('click', () => close());
  });

  document.addEventListener('click', (e) => {
    if (!mq.matches || nav.dataset.open !== 'true') return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav.dataset.open === 'true') close();
  });

  const syncBreakpoint = () => {
    if (!mq.matches) {
      setState(false);
    }
  };

  setHeaderHeight();
  syncBreakpoint();
  window.addEventListener('resize', setHeaderHeight);
  if (mq.addEventListener) {
    mq.addEventListener('change', syncBreakpoint);
  } else if (mq.addListener) {
    mq.addListener(syncBreakpoint);
  }
})();

// WhatsApp CTAs
(() => {
  const rawPhone = document.body?.dataset.whatsappPhone || '50499533576';
  const phone = rawPhone.replace(/\D/g, '');

  const defaultMessage = 'Hola, quiero un diagnóstico sin costo para hacer mi casa inteligente en Tegucigalpa y alrededores.';

  const buildMessageFromForm = (data) => {
    const parts = [defaultMessage, ''];
    if (data.name) parts.push(`Nombre: ${data.name}`);
    if (data.zone) parts.push(`Zona: ${data.zone}`);
    if (data.goal) parts.push(`Interés: ${data.goal}`);
    if (data.msg) parts.push(`Mensaje: ${data.msg}`);
    return parts.join('\n').trim();
  };

  const openWhatsApp = (message = '') => {
    const text = message ? `?text=${encodeURIComponent(message)}` : '';
    const url = `https://wa.me/${phone}${text}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
  };

  qsa('[data-whatsapp]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = el.dataset.message || defaultMessage;
      openWhatsApp(msg);
    });
  });

  const form = qs('[data-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const message = buildMessageFromForm(data);
      openWhatsApp(message);
    });
  }
})();
