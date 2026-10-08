/**
 * SkyZ Solutions — AI Consultant floating chat widget (embeddable).
 *
 * Usage on any site:
 *   <script src="https://YOUR-AGENT.vercel.app/widget.js" defer></script>
 *
 * The widget reads its own script URL, so no configuration is needed.
 * Styling follows the SkyZ lavender identity and adapts to light/dark
 * via prefers-color-scheme.
 */
(function () {
  'use strict';

  // ---- Resolve the agent API base from this script's own URL -------------
  var script =
    document.currentScript ||
    (function () {
      var all = document.getElementsByTagName('script');
      return all[all.length - 1];
    })();

  var API_BASE = '';
  try {
    API_BASE = new URL(script.src).origin;
  } catch (e) {
    API_BASE = '';
  }

  // ---- Persistent per-visitor session ------------------------------------
  var SESSION_KEY = 'skyz-agent-session';
  var sessionId = null;
  try {
    sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId =
        (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
        's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SESSION_KEY, sessionId);
    }
  } catch (e) {
    sessionId = 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }

  // ---- Styles (SkyZ lavender identity, light + dark) ----------------------
  var css = '' +
    ':root{--sz-bg:#FBFAFD;--sz-surface:#FFFFFF;--sz-ink:#211D2E;--sz-muted:#5D5470;--sz-border:#E9E5F2;--sz-accent:#7C4DE0;--sz-accent2:#9F7AEA;--sz-bot-bg:#F1EBFA;--sz-bot-ink:#3B2A5E;}' +
    '@media(prefers-color-scheme:dark){:root{--sz-bg:#0B0813;--sz-surface:#131020;--sz-ink:#F3F0FA;--sz-muted:#A79FBC;--sz-border:#251F3A;--sz-accent:#A78BFA;--sz-accent2:#C4B5FD;--sz-bot-bg:rgba(167,139,250,.12);--sz-bot-ink:#E6DFF6;}}' +
    '.sz-fab{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:9999px;border:none;cursor:pointer;z-index:2147483000;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,var(--sz-accent2),var(--sz-accent));box-shadow:0 10px 30px rgba(124,77,224,.35);transition:transform .3s cubic-bezier(.175,.885,.32,1.275),box-shadow .3s ease;}' +
    '.sz-fab:hover{transform:scale(1.08);box-shadow:0 14px 34px rgba(124,77,224,.45);}' +
    '.sz-fab svg{width:26px;height:26px;fill:currentColor;}' +
    '.sz-panel{position:fixed;bottom:96px;right:24px;width:380px;max-width:calc(100vw - 32px);height:500px;max-height:min(72vh,560px);background:var(--sz-surface);border:1px solid var(--sz-border);border-radius:20px;box-shadow:0 18px 50px rgba(33,29,46,.18);display:flex;flex-direction:column;overflow:hidden;z-index:2147483000;opacity:0;visibility:hidden;transform:translateY(16px) scale(.96);transition:all .3s cubic-bezier(.16,1,.3,1);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
    '.sz-panel.active{opacity:1;visibility:visible;transform:translateY(0) scale(1);}' +
    '.sz-head{background:linear-gradient(135deg,var(--sz-accent2),var(--sz-accent));color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:13.5px;letter-spacing:.2px;}' +
    '.sz-head-sub{display:block;font-weight:400;font-size:10.5px;opacity:.85;margin-top:2px;letter-spacing:1.2px;text-transform:uppercase;}' +
    '.sz-close{background:rgba(255,255,255,.18);border:none;color:#fff;width:28px;height:28px;border-radius:9999px;font-size:15px;line-height:1;cursor:pointer;transition:background .2s;}' +
    '.sz-close:hover{background:rgba(255,255,255,.35);}' +
    '.sz-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--sz-bg);scroll-behavior:smooth;}' +
    '.sz-msg{max-width:85%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.55;word-wrap:break-word;overflow-wrap:anywhere;}' +
    '.sz-msg.user{align-self:flex-end;background:var(--sz-accent);color:#fff;border-bottom-right-radius:4px;}' +
    '.sz-msg.bot{align-self:flex-start;background:var(--sz-bot-bg);color:var(--sz-bot-ink);border-bottom-left-radius:4px;}' +
    '.sz-msg.bot p{margin:0 0 8px;}.sz-msg.bot p:last-child{margin-bottom:0;}' +
    '.sz-msg.bot a{color:var(--sz-accent);font-weight:600;text-decoration:underline;}' +
    '.sz-typing{display:inline-flex;gap:4px;align-items:center;padding:4px 0;}' +
    '.sz-typing i{width:6px;height:6px;border-radius:9999px;background:var(--sz-accent);opacity:.4;animation:szBounce 1.2s infinite;}' +
    '.sz-typing i:nth-child(2){animation-delay:.15s;}.sz-typing i:nth-child(3){animation-delay:.3s;}' +
    '@keyframes szBounce{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-4px);opacity:1;}}' +
    '.sz-input{display:flex;gap:8px;padding:12px;border-top:1px solid var(--sz-border);background:var(--sz-surface);}' +
    '.sz-input input{flex:1;min-width:0;padding:10px 14px;border:1px solid var(--sz-border);border-radius:12px;outline:none;font-size:13.5px;background:var(--sz-bg);color:var(--sz-ink);transition:border-color .2s,box-shadow .2s;}' +
    '.sz-input input:focus{border-color:var(--sz-accent);box-shadow:0 0 0 3px rgba(124,77,224,.12);}' +
    '.sz-input button{background:var(--sz-accent);color:#fff;border:none;padding:10px 16px;border-radius:12px;cursor:pointer;font-weight:600;font-size:13.5px;transition:background .2s,opacity .2s;}' +
    '.sz-input button:hover{filter:brightness(1.08);}' +
    '.sz-input button:disabled{opacity:.55;cursor:not-allowed;}' +
    '@media(max-width:480px){.sz-panel{bottom:0;right:0;width:100vw;max-width:100vw;height:100vh;max-height:100vh;border-radius:0;border:none;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- Markup --------------------------------------------------------------
  var fab = document.createElement('button');
  fab.className = 'sz-fab';
  fab.setAttribute('aria-label', 'Chat with SkyZ AI consultant');
  fab.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.84.5 3.56 1.37 5.04L2 22l4.96-1.37C8.44 21.5 10.16 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.85-.39-4.04-1.07l-.29-.17-3.08.85.85-3.08-.17-.29C4.39 14.85 4 13.47 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'sz-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'SkyZ AI consultant chat');
  panel.innerHTML =
    '<div class="sz-head"><span>Sky-Z Solutions — AI Expert<span class="sz-head-sub">Online • replies instantly</span></span><button class="sz-close" aria-label="Close chat">&times;</button></div>' +
    '<div class="sz-msgs" id="sz-msgs"></div>' +
    '<div class="sz-input"><input id="sz-input" type="text" placeholder="Ask about your project..." autocomplete="off"><button id="sz-send">Send</button></div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var msgs = panel.querySelector('#sz-msgs');
  var input = panel.querySelector('#sz-input');
  var sendBtn = panel.querySelector('#sz-send');

  // ---- Safe mini-markdown (escape first — never trust model text) ---------
  function esc(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function renderBot(text) {
    var t = esc(String(text))
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    var paras = t.split(/\n{2,}/);
    return paras.map(function (p) { return '<p>' + p.trim() + '</p>'; }).join('');
  }
  function addUser(text) {
    var d = document.createElement('div');
    d.className = 'sz-msg user';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function addBotHTML(html) {
    var d = document.createElement('div');
    d.className = 'sz-msg bot';
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  addBotHTML('<p>Hello! Welcome to <b>Sky-Z Solutions</b>. How can I assist you with your digital project today?</p>');

  // ---- Chat toggle ----------------------------------------------------------
  function toggle() {
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      setTimeout(function () { input.focus(); }, 250);
    }
  }
  fab.addEventListener('click', toggle);
  panel.querySelector('.sz-close').addEventListener('click', toggle);

  // ---- Send -----------------------------------------------------------------
  var busy = false;
  function send() {
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    addUser(text);
    input.value = '';

    var typing = addBotHTML('<span class="sz-typing"><i></i><i></i><i></i></span>');

    fetch(API_BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, session_id: sessionId }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        typing.remove();
        if (res.ok && res.data && res.data.reply) {
          addBotHTML(renderBot(res.data.reply));
        } else {
          addBotHTML('<p>Sorry — I could not reach the server just now. Please try again in a moment.</p>');
        }
      })
      .catch(function () {
        typing.remove();
        addBotHTML('<p>Network error occurred. Please check your connection and try again.</p>');
      })
      .then(function () {
        busy = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') send();
  });
})();
