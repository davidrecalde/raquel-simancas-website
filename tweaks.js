/* Tweaks panel — accent / density / mode.
   Loaded on every page so the toolbar toggle works site-wide.
   Persists to localStorage AND uses __edit_mode_set_keys when present. */

(function () {
  const STORAGE = "raquel-tweaks";
  const DEFAULTS = { accent: "petroleum", density: "comfortable", mode: "light" };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORAGE) || "{}")); }
    catch (e) { return { ...DEFAULTS }; }
  }
  function save(state) { localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function apply(state) {
    const r = document.documentElement;
    r.setAttribute("data-accent", state.accent);
    r.setAttribute("data-density", state.density);
    r.setAttribute("data-mode", state.mode);
  }

  let state = load();
  apply(state);

  /* ---------- Panel ---------- */
  let panel = null;
  function buildPanel() {
    panel = document.createElement("div");
    panel.id = "tweaks-panel";
    panel.innerHTML = `
      <style>
        #tweaks-panel {
          position: fixed; right: 20px; bottom: 20px;
          width: 320px; z-index: 200;
          background: var(--paper); color: var(--ink);
          border: 1px solid var(--line);
          font-family: var(--sans); font-size: 0.88rem;
          box-shadow: 0 24px 48px -16px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.06);
        }
        #tweaks-panel .hd {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-bottom: 1px solid var(--line);
          cursor: grab;
        }
        #tweaks-panel .hd .ti { font-family: var(--mono); font-size: 0.74rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--mineral); }
        #tweaks-panel .hd button { color: var(--mineral); font-size: 1.1rem; line-height: 1; padding: 4px 8px; }
        #tweaks-panel .hd button:hover { color: var(--accent); }
        #tweaks-panel .bd { padding: 18px; display: grid; gap: 22px; }
        #tweaks-panel .sec label.lab { display: block; font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--mineral); margin-bottom: 10px; }
        #tweaks-panel .swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        #tweaks-panel .sw { aspect-ratio: 1.4 / 1; border: 1px solid var(--line); cursor: pointer; position: relative; padding: 0; transition: transform 0.15s, border-color 0.15s; }
        #tweaks-panel .sw:hover { transform: translateY(-1px); }
        #tweaks-panel .sw.on { outline: 1px solid var(--ink); outline-offset: 2px; }
        #tweaks-panel .sw .nm { position: absolute; bottom: 4px; left: 6px; font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.95); mix-blend-mode: difference;}
        #tweaks-panel .seg { display: flex; border: 1px solid var(--line); }
        #tweaks-panel .seg button { flex: 1; padding: 8px 10px; font-size: 0.78rem; color: var(--mineral); background: transparent; border-right: 1px solid var(--line); transition: background 0.15s, color 0.15s; }
        #tweaks-panel .seg button:last-child { border-right: 0; }
        #tweaks-panel .seg button.on { background: var(--ink); color: var(--paper); }
      </style>
      <div class="hd">
        <div class="ti">Tweaks</div>
        <button data-act="close" aria-label="Close">×</button>
      </div>
      <div class="bd">
        <div class="sec">
          <label class="lab">Accent color</label>
          <div class="swatches" data-group="accent">
            <button class="sw" data-v="petroleum" style="background:#1F4047"><span class="nm">Petroleum</span></button>
            <button class="sw" data-v="green" style="background:#3F5C46"><span class="nm">Mineral</span></button>
            <button class="sw" data-v="copper" style="background:#A8623B"><span class="nm">Copper</span></button>
            <button class="sw" data-v="titanium" style="background:#5A5C5E"><span class="nm">Titanium</span></button>
          </div>
        </div>
        <div class="sec">
          <label class="lab">Editorial density</label>
          <div class="seg" data-group="density">
            <button data-v="comfortable">Comfortable</button>
            <button data-v="dense">Dense</button>
          </div>
        </div>
        <div class="sec">
          <label class="lab">Surface</label>
          <div class="seg" data-group="mode">
            <button data-v="light">Paper</button>
            <button data-v="dark">Deep field</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelectorAll("[data-group]").forEach(group => {
      const key = group.dataset.group;
      group.querySelectorAll("button[data-v]").forEach(btn => {
        if (btn.dataset.v === state[key]) btn.classList.add("on");
        btn.addEventListener("click", () => {
          state[key] = btn.dataset.v;
          group.querySelectorAll("button[data-v]").forEach(b => b.classList.toggle("on", b.dataset.v === state[key]));
          apply(state); save(state);
          try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: state[key] } }, "*"); } catch(e){}
        });
      });
    });
    panel.querySelector('[data-act="close"]').addEventListener("click", hide);
  }

  function show() {
    if (!panel) buildPanel();
    panel.style.display = "block";
  }
  function hide() {
    if (panel) panel.style.display = "none";
    try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch(e){}
  }

  /* Listen first, then advertise */
  window.addEventListener("message", e => {
    const d = e.data || {};
    if (d.type === "__activate_edit_mode") show();
    else if (d.type === "__deactivate_edit_mode") hide();
  });
  try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e){}
})();
