(() => {
    "use strict";

    /* ===================== Zana ndogo ===================== */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const Rich = window.DaftariRich;
    const Media = window.DaftariMedia;
    const Bg = window.DaftariBg;
    const now = () => Date.now();
    const DAY = 86400000;
    const uid = () =>
        window.crypto && crypto.randomUUID
            ? crypto.randomUUID()
            : now().toString(36) + Math.random().toString(36).slice(2, 10);

    // Hujenga elementi kwa usalama (maandishi ya mtumiaji hayapitii innerHTML kamwe).
    function h(tag, attrs, ...kids) {
        const e = document.createElement(tag);
        if (attrs) {
            for (const [k, v] of Object.entries(attrs)) {
                if (v == null || v === false) continue;
                if (k === "class") e.className = v;
                else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
                else e.setAttribute(k, v === true ? "" : v);
            }
        }
        for (const kid of kids.flat()) {
            if (kid == null || kid === false) continue;
            e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
        }
        return e;
    }

    /* ===================== Ikoni ===================== */
    const ICONS = {
        search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
        x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
        back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
        more: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
        trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
        archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
        share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
        check: '<polyline points="20 6 9 17 4 12"/>',
        copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
        settings: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
        layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
        grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
        list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
        lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
        upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
        pin: '<line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>',
        restore: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
        tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
        "check-square": '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
        "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        chevron: '<polyline points="6 9 12 15 18 9"/>',
        bold: '<path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/>',
        italic: '<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>',
        heading: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
        link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
        image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
        palette: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
        grip: '<circle cx="9" cy="6" r="1.5" fill="currentColor"/><circle cx="15" cy="6" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="18" r="1.5" fill="currentColor"/><circle cx="15" cy="18" r="1.5" fill="currentColor"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    };
    const icon = (name) =>
        `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
    const svgIcon = (name) => {
        const t = document.createElement("template");
        t.innerHTML = icon(name);
        return t.content.firstChild;
    };
    function hydrateIcons(root = document) {
        $$("[data-icon]", root).forEach((el) => {
            if (el.dataset.iconDone) return;
            el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
            el.dataset.iconDone = "1";
        });
    }

    /* ===================== Tarehe ===================== */
    const MONTHS = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"];
    function relTime(ts) {
        const min = Math.floor((now() - ts) / 60000);
        if (min < 1) return "Sasa hivi";
        if (min < 60) return min === 1 ? "Dakika 1 iliyopita" : `Dakika ${min} zilizopita`;
        const d = new Date(ts);
        const n = new Date();
        const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
        if (ts >= startToday) {
            const hr = Math.floor(min / 60);
            return hr === 1 ? "Saa 1 iliyopita" : `Saa ${hr} zilizopita`;
        }
        if (ts >= startToday - DAY) return "Jana";
        const days = Math.floor((startToday - ts) / DAY) + 1;
        if (days < 7) return `Siku ${days} zilizopita`;
        const y = d.getFullYear() !== n.getFullYear() ? ` ${d.getFullYear()}` : "";
        return `${d.getDate()} ${MONTHS[d.getMonth()]}${y}`;
    }

    /* ===================== Tarehe ya mwisho ===================== */
    const pad2 = (n) => String(n).padStart(2, "0");
    const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const todayStr = () => ymd(new Date());
    const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate() + 1); return ymd(d); };

    function fmtDue(s) {
        if (s === todayStr()) return "Leo";
        if (s === tomorrowStr()) return "Kesho";
        const [y, m, d] = s.split("-").map(Number);
        return `${d} ${MONTHS[m - 1]}${y !== new Date().getFullYear() ? " " + y : ""}`;
    }
    function isFinished(n) {
        const items = n.items.filter((i) => i.text.trim());
        return n.type === "list" && items.length > 0 && items.every((i) => i.done);
    }
    function dueInfo(n) {
        if (!n.due) return null;
        const finished = isFinished(n);
        const overdue = n.due < todayStr() && !finished;
        return { overdue, finished, text: (overdue ? "Imechelewa · " : "") + fmtDue(n.due) };
    }

    /* ===================== Hifadhi ===================== */
    const KEY_NOTES = "daftari.notes.v1";
    const KEY_SET = "daftari.settings.v1";
    const memStore = {};
    const store = {
        get(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return memStore[key] ?? null;
            }
        },
        set(key, value) {
            memStore[key] = value;
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },
    };

    const COLORS = [
        ["default", "Kawaida"],
        ["yellow", "Njano"],
        ["green", "Kijani"],
        ["blue", "Bluu"],
        ["pink", "Waridi"],
        ["purple", "Zambarau"],
    ];
    const COLOR_IDS = COLORS.map((c) => c[0]);

    const normTag = (t) =>
        String(t == null ? "" : t).replace(/^#+/, "").trim().toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
    const num = (v, fallback) => (Number.isFinite(v) ? v : fallback);

    function newItem(text = "") {
        return { id: uid(), text, done: false };
    }

    function newNote(type) {
        const t = now();
        return {
            id: uid(), type, title: "", body: "",
            items: type === "list" ? [newItem("")] : [],
            color: "default", pinned: false, archived: false, trashedAt: null,
            tags: [], due: null, html: "", images: [], bg: "", bgTone: "", order: -t,
            createdAt: t, updatedAt: t,
        };
    }

    // Husafisha note yoyote inayotoka kwenye hifadhi au faili la nakala.
    function sanitizeNote(raw) {
        if (!raw || typeof raw !== "object") return null;
        const t = now();
        const items = Array.isArray(raw.items)
            ? raw.items.slice(0, 500).map((i) => ({
                  id: str(i && i.id, 64) || uid(),
                  text: str(i && i.text, 1000),
                  done: !!(i && i.done),
              }))
            : [];
        const tags = Array.isArray(raw.tags)
            ? [...new Set(raw.tags.map(normTag).filter(Boolean))].slice(0, 20)
            : [];
        const html = typeof raw.html === "string" && raw.html ? Rich.sanitize(raw.html) : "";
        const images = Array.isArray(raw.images)
            ? raw.images
                  .slice(0, 20)
                  .map((i) => ({ id: str(i && i.id, 64), w: num(i && i.w, 0), h: num(i && i.h, 0) }))
                  .filter((i) => /^[\w-]{1,64}$/.test(i.id))
            : [];
        const bg =
            typeof raw.bg === "string" && /^[pu]:[\w-]{1,64}$/.test(raw.bg) && (raw.bg[0] === "u" || Bg.byId(raw.bg.slice(2)))
                ? raw.bg
                : "";
        return {
            id: str(raw.id, 64) || uid(),
            type: raw.type === "list" ? "list" : "text",
            title: str(raw.title, 300),
            body: str(raw.body, 100000) || (html ? Rich.toPlain(html).slice(0, 100000) : ""),
            html, images, bg,
            bgTone: bg && raw.bgTone === "light" ? "light" : bg ? "dark" : "",
            order: Number.isFinite(raw.order) ? raw.order : -num(raw.createdAt, t),
            items, tags,
            color: COLOR_IDS.includes(raw.color) ? raw.color : "default",
            pinned: !!raw.pinned,
            archived: !!raw.archived,
            trashedAt: Number.isFinite(raw.trashedAt) ? raw.trashedAt : null,
            due: typeof raw.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.due) ? raw.due : null,
            createdAt: num(raw.createdAt, t),
            updatedAt: num(raw.updatedAt, t),
        };
    }

    const state = {
        notes: [],
        settings: { theme: "auto", view: "grid", sort: "updated", pinHash: null, pinSalt: null, seeded: false, fontSize: "m" },
        filter: "all",
        query: "",
        sel: new Set(),
    };

    function loadAll() {
        const savedSettings = store.get(KEY_SET);
        if (savedSettings && typeof savedSettings === "object") Object.assign(state.settings, savedSettings);
        if (!["auto", "light", "dark"].includes(state.settings.theme)) state.settings.theme = "auto";
        if (!["grid", "list"].includes(state.settings.view)) state.settings.view = "grid";
        if (!["updated", "created", "title", "manual"].includes(state.settings.sort)) state.settings.sort = "updated";
        if (!["s", "m", "l"].includes(state.settings.fontSize)) state.settings.fontSize = "m";

        const saved = store.get(KEY_NOTES);
        state.notes = Array.isArray(saved) ? saved.map(sanitizeNote).filter(Boolean) : [];

        // Tupio husafishwa baada ya siku 30.
        const limit = now() - 30 * DAY;
        state.notes = state.notes.filter((n) => !(n.trashedAt && n.trashedAt < limit));

        if (!state.settings.seeded && state.notes.length === 0) seedNotes();
    }

    function seedNotes() {
        const t = now();
        const welcome = newNote("text");
        Object.assign(welcome, {
            title: "Karibu Daftari Langu",
            body:
                "Hii ni note yako ya kwanza.\n\n" +
                "• Bonyeza + kuongeza note au orodha\n" +
                "• Chagua rangi, ongeza lebo, au bandika juu\n" +
                "• Tafuta kwa haraka kwenye kisanduku cha juu\n" +
                "• Inafanya kazi bila intaneti\n" +
                "• Notes zako zinakaa kwenye simu yako tu\n\n" +
                "Futa note hii ukiwa tayari.",
            color: "green", pinned: true, tags: ["karibu"], createdAt: t, updatedAt: t,
        });
        const list = newNote("list");
        Object.assign(list, {
            title: "Orodha ya sokoni (mfano)",
            items: [
                { id: uid(), text: "Nyanya na vitunguu", done: false },
                { id: uid(), text: "Mchele", done: false },
                { id: uid(), text: "Mafuta ya kupikia", done: true },
            ],
            color: "yellow", tags: ["nyumbani"], createdAt: t - 1000, updatedAt: t - 1000,
        });
        state.notes.push(welcome, list);
        state.settings.seeded = true;
        saveSettings();
        flushSave();
    }

    let saveTimer = null;
    function setStatus(text) {
        const s = $("#ed-status");
        if (s) s.textContent = text;
    }
    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(flushSave, 300);
        setStatus("Inahifadhi...");
    }
    function flushSave() {
        if (bodyDirty) syncBody();
        clearTimeout(saveTimer);
        saveTimer = null;
        const ok = store.set(KEY_NOTES, state.notes);
        setStatus(ok ? "Imehifadhiwa" : "Haikuhifadhiwa: hifadhi ya kifaa imejaa au imezimwa");
    }
    function saveSettings() {
        store.set(KEY_SET, state.settings);
    }

    /* ===================== Ujumbe mfupi (toast) ===================== */
    let toastTimer = null;
    function hideToast() {
        const box = $("#toast");
        box.hidden = true;
    }
    // Dirisha (dialog) lililo wazi huzuia kila kitu nje yake, kwa hiyo ujumbe huwekwa ndani yake.
    function placeToast(box) {
        const open = $$("dialog[open]:not(#confirm)");
        const host = open[open.length - 1] || document.body;
        if (box.parentNode !== host) host.append(box);
    }
    document.addEventListener("close", (e) => {
        const box = $("#toast");
        if (e.target && e.target.tagName === "DIALOG" && e.target.contains(box)) document.body.append(box);
    }, true);
    function toast(message, actionLabel, onAction) {
        const box = $("#toast");
        const act = $("#toast-act");
        $("#toast-msg").textContent = message;
        act.hidden = !actionLabel;
        act.textContent = actionLabel || "";
        act.onclick = () => {
            hideToast();
            clearTimeout(toastTimer);
            if (onAction) onAction();
        };
        box.hidden = false;
        placeToast(box);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, actionLabel ? 6000 : 2600);
    }

    /* ===================== Madirisha ===================== */
    function openModal(dlg) {
        dlg.showModal();
        try { history.pushState({ modal: 1 }, ""); } catch (e) { /* hakuna historia */ }
    }
    function closeModal(dlg) {
        if (!dlg.open) return;
        if (history.state && history.state.modal) history.back();
        else dlg.close();
    }
    function onModalClosed() {
        if (history.state && history.state.modal) history.back();
    }
    window.addEventListener("popstate", () => {
        $$("dialog[open]").forEach((d) => d.close());
    });

    function confirmDialog(message, okLabel = "Futa", danger = true) {
        return new Promise((resolve) => {
            const dlg = $("#confirm");
            $("#confirm-msg").textContent = message;
            const ok = $("#confirm-ok");
            ok.textContent = okLabel;
            ok.className = "btn " + (danger ? "danger" : "primary");
            dlg.returnValue = "";
            dlg.addEventListener("close", () => resolve(dlg.returnValue === "ok"), { once: true });
            dlg.showModal();
        });
    }

    /* ===================== Kuchuja na kupanga ===================== */
    function noteText(n) {
        const body = n.type === "list" ? n.items.map((i) => (i.done ? "[x] " : "[ ] ") + i.text).join("\n") : n.body;
        return [n.title, body].filter((s) => s && s.trim()).join("\n\n");
    }

    function matches(n, q) {
        const hay = [n.title, n.body, n.items.map((i) => i.text).join(" "), n.tags.join(" ")].join("\n").toLowerCase();
        return hay.includes(q);
    }

    function visibleNotes() {
        const q = state.query.trim().toLowerCase();
        const f = state.filter;
        let list = state.notes.filter((n) => {
            if (f === "trash") return !!n.trashedAt;
            if (n.trashedAt) return false;
            if (f === "archive") return n.archived;
            if (n.archived && !q) return false;
            if (f === "lists" && n.type !== "list") return false;
            if (f === "due" && !n.due) return false;
            if (f.startsWith("tag:") && !n.tags.includes(f.slice(4))) return false;
            return true;
        });
        if (q) list = list.filter((n) => matches(n, q));
        const key = state.settings.sort;
        list.sort((a, b) => {
            if (f === "due") return a.due.localeCompare(b.due) || b.updatedAt - a.updatedAt;
            if (key === "manual") return a.order - b.order;
            if (key === "title") return (a.title || "~").localeCompare(b.title || "~", "sw");
            if (key === "created") return b.createdAt - a.createdAt;
            return b.updatedAt - a.updatedAt;
        });
        return list;
    }

    function highlight(text, q) {
        const query = q.trim();
        if (!query) return text;
        const frag = document.createDocumentFragment();
        const lower = text.toLowerCase();
        const ql = query.toLowerCase();
        let i = 0;
        let idx;
        while ((idx = lower.indexOf(ql, i)) !== -1) {
            if (idx > i) frag.append(text.slice(i, idx));
            frag.append(h("mark", null, text.slice(idx, idx + ql.length)));
            i = idx + ql.length;
        }
        frag.append(text.slice(i));
        return frag;
    }

    /* ===================== Kuchora orodha kuu ===================== */
    function setFilter(f) {
        state.filter = f;
        state.sel.clear();
        render();
        window.scrollTo({ top: 0 });
    }

    const FILTERS = [
        ["all", "Zote", "file-text"],
        ["lists", "Orodha", "check-square"],
        ["due", "Ratiba", "calendar"],
        ["archive", "Kumbukumbu", "archive"],
        ["trash", "Tupio", "trash"],
    ];
    let tagCounts = new Map();
    let navCounts = {};

    function filterLabel(f) {
        if (f.startsWith("tag:")) return "#" + f.slice(4);
        const m = FILTERS.find((x) => x[0] === f);
        return m ? m[1] : "Zote";
    }

    function pickRow(f, label, icon, count) {
        const b = h("button", {
            type: "button", class: "pick-row", "aria-pressed": String(state.filter === f),
            onclick: () => { $("#navsheet").close(); $("#tagsheet").close(); setFilter(f); },
        });
        if (icon) b.append(svgIcon(icon));
        b.append(h("span", { class: "pick-label" }, label));
        if (count) b.append(h("span", { class: "n" }, String(count)));
        return b;
    }

    function renderNavSheet() {
        const box = $("#nav-list");
        box.textContent = "";
        FILTERS.forEach(([f, label, icon]) => box.append(pickRow(f, label, icon, navCounts[f])));
    }

    function renderTagSheet() {
        const box = $("#tag-list");
        box.textContent = "";
        const q = ($("#tag-search").value || "").trim().toLowerCase().replace(/^#/, "");
        const tags = [...tagCounts.keys()].sort((x, y) => x.localeCompare(y, "sw")).filter((t) => !q || t.toLowerCase().includes(q));
        if (!tags.length) {
            box.append(h("p", { class: "hint" }, tagCounts.size ? "Hakuna lebo inayolingana." : "Bado hakuna lebo. Ongeza lebo ndani ya note."));
            return;
        }
        tags.forEach((t) => box.append(pickRow("tag:" + t, "#" + t, null, tagCounts.get(t))));
    }

    function renderChips() {
        const live = state.notes.filter((n) => !n.trashedAt);
        navCounts = {
            due: live.filter((n) => n.due && !n.archived && !isFinished(n)).length,
            trash: state.notes.length - live.length,
        };
        tagCounts = new Map();
        live.forEach((n) => n.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)));
        if (state.filter.startsWith("tag:") && !tagCounts.has(state.filter.slice(4))) state.filter = "all";

        // Kichujio kinachotumika kinaonekana kama chip yenye ✕
        const nav = $("#chips");
        nav.textContent = "";
        if (state.filter !== "all") {
            const x = svgIcon("x");
            nav.append(h("button", { class: "chip", type: "button", "aria-pressed": "true", "aria-label": "Ondoa kichujio " + filterLabel(state.filter), onclick: () => setFilter("all") }, filterLabel(state.filter), x));
        }
        $("#nav-btn").classList.toggle("on", FILTERS.some((m) => m[0] === state.filter && m[0] !== "all"));
        $("#tag-btn").classList.toggle("on", state.filter.startsWith("tag:"));
        renderNavSheet();
        renderTagSheet();
    }
    let tagsOpen = false;

    function emptyState() {
        const q = state.query.trim();
        const f = state.filter;
        let ring = "file-text";
        let title = "Hakuna notes bado";
        let text = "Anza kuandika wazo lako la kwanza.";
        let action = true;
        if (q) { ring = "search"; title = "Hakuna matokeo"; text = `Hakuna note yenye “${q}”.`; action = false; }
        else if (f === "archive") { ring = "archive"; title = "Kumbukumbu ni tupu"; text = "Notes unazozihifadhi kando zitaonekana hapa."; action = false; }
        else if (f === "trash") { ring = "trash"; title = "Tupio ni tupu"; text = "Notes ulizofuta zitakaa hapa kwa siku 30."; action = false; }
        else if (f === "due") { ring = "calendar"; title = "Hakuna ratiba"; text = "Weka tarehe kwenye note ili ionekane hapa."; action = false; }
        else if (f === "lists") { ring = "check-square"; title = "Hakuna orodha"; text = "Tengeneza orodha ya mambo ya kufanya."; }
        const box = $("#empty");
        box.textContent = "";
        const r = h("div", { class: "ring" });
        r.append(svgIcon(ring));
        box.append(r, h("h2", null, title), h("p", null, text));
        if (action) box.append(h("button", { class: "btn primary", type: "button", onclick: () => createNote(f === "lists" ? "list" : "text") }, "Note mpya"));
    }

    function render() {
        const host = $("#notes");
        host.textContent = "";
        renderChips();
        const visibleIds = new Set(visibleNotes().map((x) => x.id));
        [...state.sel].forEach((id) => { if (!visibleIds.has(id)) state.sel.delete(id); });
        renderSelbar();

        const viewBtn = $("#view-btn");
        viewBtn.textContent = "";
        viewBtn.append(svgIcon(state.settings.view === "grid" ? "list" : "grid"));
        viewBtn.setAttribute("aria-label", state.settings.view === "grid" ? "Onyesha kama orodha" : "Onyesha kama gridi");

        const banner = $("#banner");
        const inTrash = state.filter === "trash";
        const trashed = state.notes.filter((n) => n.trashedAt);
        banner.hidden = !(inTrash && trashed.length);
        if (!banner.hidden) {
            banner.textContent = "";
            banner.append(
                h("span", null, "Notes kwenye tupio hufutwa kabisa baada ya siku 30."),
                h("button", { class: "btn danger", type: "button", onclick: emptyTrash }, "Safisha tupio")
            );
        }

        const list = visibleNotes();
        const empty = $("#empty");
        empty.hidden = list.length > 0;
        if (!empty.hidden) emptyState();
        if (!list.length) return;

        const grid = (items) => h("div", { class: "notes" + (state.settings.view === "list" ? " list" : "") }, items.map(renderCard));
        const sectioned = !state.query.trim() && !["archive", "trash", "due"].includes(state.filter);
        const pinned = sectioned ? list.filter((n) => n.pinned) : [];
        if (pinned.length) {
            const rest = list.filter((n) => !n.pinned);
            host.append(h("div", { class: "section-label" }, "Zilizobandikwa"), grid(pinned));
            if (rest.length) host.append(h("div", { class: "section-label" }, "Nyingine"), grid(rest));
        } else {
            host.append(grid(list));
        }
        requestAnimationFrame(markOverflow);
    }

    function markOverflow() {
        $$(".card-body.rich").forEach((el) => el.classList.toggle("fade", el.scrollHeight > el.clientHeight + 2));
    }

    function bgInfo(n) {
        if (!n.bg) return null;
        if (n.bg[0] === "p") {
            const p = Bg.byId(n.bg.slice(2));
            return p ? { kind: "p", id: p.id, tone: p.tone } : null;
        }
        return { kind: "u", id: n.bg.slice(2), tone: n.bgTone === "light" ? "light" : "dark" };
    }

    // Weka mandharinyuma kwenye kadi (flavor "c") au kihariri (flavor "p")
    function applyBg(el, n, flavor) {
        [...el.classList].forEach((c) => { if (/^bg[pc]-/.test(c)) el.classList.remove(c); });
        el.classList.remove("has-bg");
        el.style.backgroundImage = "";
        el.style.backgroundPosition = "";
        el.removeAttribute("data-tone");
        const info = bgInfo(n);
        if (!info) return false;
        el.classList.add("has-bg");
        el.dataset.tone = info.tone;
        if (info.kind === "p") {
            Bg.ensure(info.id);
            el.classList.add("bg" + flavor + "-" + info.id);
        } else {
            const scrim = Bg.SCRIM[info.tone];
            const set = (u) => {
                el.style.backgroundImage = `linear-gradient(${scrim},${scrim}),url("${u}")`;
                el.style.backgroundPosition = "center";
            };
            const u = Media.urlSync(info.id);
            if (u) set(u);
            else Media.url(info.id).then((url) => { if (url) set(url); });
        }
        return true;
    }

    function setImgSrc(img, id) {
        const u = Media.urlSync(id);
        if (u) { img.src = u; return; }
        Media.url(id).then((url) => { if (url) img.src = url; else img.classList.add("missing"); });
    }

    /* ---- Kuburuta kupanga upya ---- */
    // el = kipengee kinachoburutwa, container = kisanduku chake, sel = kiteuzi cha ndugu zake.
    function startDrag(e, el, container, sel, onDone) {
        if (e.button != null && e.button > 0) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = el.getBoundingClientRect();
        const offX = e.clientX - rect.left, offY = e.clientY - rect.top;
        const ghost = el.cloneNode(true);
        ghost.classList.add("drag-ghost");
        ghost.removeAttribute("id");
        ghost.style.width = rect.width + "px";
        ghost.style.left = "0px";
        ghost.style.top = "0px";
        document.body.append(ghost);
        el.classList.add("drag-source");
        document.body.classList.add("is-dragging");
        let x = e.clientX, y = e.clientY, raf = 0;
        const place = () => { ghost.style.transform = `translate(${x - offX}px, ${y - offY}px)`; };
        place();
        const tick = () => {
            const edge = 70;
            if (y < edge) window.scrollBy(0, -Math.ceil((edge - y) / 5));
            else if (y > window.innerHeight - edge) window.scrollBy(0, Math.ceil((y - (window.innerHeight - edge)) / 5));
            const sc = container.closest("dialog");
            if (sc) {
                const r = sc.getBoundingClientRect();
                if (y < r.top + edge) sc.scrollBy(0, -8);
                else if (y > r.bottom - edge) sc.scrollBy(0, 8);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const move = (ev) => {
            ev.preventDefault();
            x = ev.clientX; y = ev.clientY;
            place();
            const target = document.elementsFromPoint(x, y).find((n) => n !== el && n !== ghost && n.matches && n.matches(sel) && container.contains(n));
            if (!target) return;
            const before = el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING;
            if (before) target.after(el); else target.before(el);
        };
        const end = (ev) => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", end);
            window.removeEventListener("pointercancel", end);
            cancelAnimationFrame(raf);
            ghost.remove();
            el.classList.remove("drag-source");
            document.body.classList.remove("is-dragging");
            if (ev.type !== "pointercancel") onDone([...container.querySelectorAll(sel)]);
        };
        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
    }

    function gripButton(label, onStart) {
        const g = h("button", { class: "grip", type: "button", "aria-label": label, tabindex: "-1" });
        g.append(svgIcon("grip"));
        g.addEventListener("pointerdown", onStart);
        g.addEventListener("click", (e) => e.stopPropagation());
        g.addEventListener("contextmenu", (e) => e.preventDefault());
        return g;
    }

    const canReorderNotes = () =>
        state.settings.sort === "manual" && !state.query.trim() && state.filter !== "trash";

    function renderCard(n) {
        const q = state.query;
        const trashed = !!n.trashedAt;
        const hasBg = !!bgInfo(n);
        const card = h("article", { class: "card" + (trashed ? " in-trash" : "") + (state.sel.has(n.id) ? " selected" : "") + (n.images.length ? " has-cover" : ""), "data-color": hasBg ? "default" : n.color, "data-id": n.id });
        applyBg(card, n, "c");
        attachSelect(card, n);
        if (state.sel.has(n.id)) {
            const badge = h("span", { class: "sel-badge" });
            badge.append(svgIcon("check"));
            card.append(badge);
        }
        if (!trashed) {
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", "Fungua note: " + (n.title || "bila kichwa"));
            card.addEventListener("click", () => openEditor(n.id));
            card.addEventListener("keydown", (e) => {
                if (e.target === card && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    openEditor(n.id);
                }
            });
        }

        if (n.images.length) {
            const cover = h("div", { class: "card-cover" });
            const im = h("img", { alt: "", loading: "lazy", draggable: "false" });
            setImgSrc(im, n.images[0].id);
            cover.append(im);
            if (n.images.length > 1) cover.append(h("span", { class: "cover-more" }, "+" + (n.images.length - 1)));
            card.append(cover);
        }
        if (canReorderNotes()) {
            card.classList.add("has-grip");
            card.append(gripButton("Buruta kupanga upya", (e) => {
                const box = card.parentElement;
                startDrag(e, card, box, ".card", (els) => {
                    const ids = els.map((c) => c.dataset.id);
                    const notes = ids.map((id) => state.notes.find((x) => x.id === id)).filter(Boolean);
                    const slots = notes.map((x) => x.order).sort((a, b) => a - b);
                    for (let i = 1; i < slots.length; i++) if (slots[i] <= slots[i - 1]) slots[i] = slots[i - 1] + 0.001;
                    notes.forEach((x, i) => { x.order = slots[i]; });
                    flushSave();
                });
            }));
        }
        if (n.pinned && !trashed) card.append(h("span", { class: "card-pin", "aria-label": "Imebandikwa" }, svgIcon("pin")));
        if (n.title) card.append(h("h3", { class: "card-title" }, highlight(n.title, q)));

        if (n.type === "list") {
            const shown = n.items.filter((i) => i.text.trim());
            const open = shown.filter((i) => !i.done);
            const done = shown.filter((i) => i.done);
            const ordered = [...open, ...done];
            const ul = h("ul", { class: "card-items" });
            ordered.slice(0, 7).forEach((it) => {
                const box = h("button", {
                    class: "box", type: "button", "aria-pressed": String(it.done),
                    "aria-label": it.done ? "Ondoa alama" : "Weka alama",
                    onclick: (e) => {
                        e.stopPropagation();
                        if (trashed) return;
                        it.done = !it.done;
                        n.updatedAt = now();
                        flushSave();
                        render();
                    },
                });
                box.append(svgIcon("check"));
                ul.append(h("li", { class: "card-item" + (it.done ? " done" : "") }, box, h("span", null, highlight(it.text, q))));
            });
            if (ordered.length) card.append(ul);
            if (ordered.length > 7) card.append(h("p", { class: "card-more" }, `+${ordered.length - 7} zaidi`));
        } else if (n.body.trim()) {
            if (n.html) {
                const rb = Rich.render(n.html, q);
                rb.className = "card-body rich";
                card.append(rb);
            } else {
                card.append(h("p", { class: "card-body" }, highlight(n.body.slice(0, 600), q)));
            }
        }

        if (!n.title && !n.body.trim() && !n.items.some((i) => i.text.trim()) && !n.images.length) {
            card.append(h("p", { class: "card-body" }, "Note tupu"));
        }

        const di = dueInfo(n);
        if (n.tags.length || di) {
            const row = h("div", { class: "card-tags" });
            if (di) {
                const b = h("span", { class: "tag due" + (di.overdue ? " overdue" : "") });
                b.append(svgIcon("calendar"), di.text);
                row.append(b);
            }
            n.tags.forEach((t) => row.append(h("span", { class: "tag" }, "#", t)));
            card.append(row);
        }

        const foot = h("div", { class: "card-foot" });
        foot.append(h("span", { class: "card-time" }, trashed ? "Imefutwa " + relTime(n.trashedAt).toLowerCase() : relTime(n.updatedAt)));
        const actions = h("div", { class: "card-actions" });
        const act = (name, label, fn) => {
            const b = h("button", {
                class: "icon-btn", type: "button", "aria-label": label, title: label,
                onclick: (e) => { e.stopPropagation(); fn(); },
            });
            b.append(svgIcon(name));
            actions.append(b);
        };
        if (trashed) {
            act("restore", "Rejesha", () => restoreNote(n));
            act("trash", "Futa milele", () => deleteForever(n));
        } else {
            act("pin", n.pinned ? "Ondoa kubandika" : "Bandika juu", () => { n.pinned = !n.pinned; n.updatedAt = now(); commit(); });
            act("archive", n.archived ? "Toa kumbukumbu" : "Weka kumbukumbu", () => archiveNote(n, !n.archived));
            act("trash", "Futa", () => trashNote(n));
        }
        foot.append(actions);
        card.append(foot);
        return card;
    }

    /* ===================== Uchaguzi wa notes nyingi ===================== */
    function attachSelect(card, n) {
        let timer = null;
        let fired = false;
        let sx = 0;
        let sy = 0;
        let ptype = "mouse";
        const cancel = () => { clearTimeout(timer); timer = null; };
        card.addEventListener("pointerdown", (e) => {
            ptype = e.pointerType || "mouse";
            fired = false;
            if (ptype === "mouse" || e.target.closest("button")) return;
            sx = e.clientX;
            sy = e.clientY;
            timer = setTimeout(() => {
                timer = null;
                fired = true;
                try { if (navigator.vibrate) navigator.vibrate(12); } catch (err) { /* hakuna */ }
                toggleSel(n.id);
            }, 450);
        });
        card.addEventListener("pointermove", (e) => {
            if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel();
        });
        ["pointerup", "pointercancel", "pointerleave"].forEach((t) => card.addEventListener(t, cancel));
        card.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (ptype === "mouse") toggleSel(n.id);
        });
        card.addEventListener("click", (e) => {
            if (fired) { fired = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
            if (e.ctrlKey || e.metaKey || state.sel.size) {
                e.preventDefault();
                e.stopImmediatePropagation();
                toggleSel(n.id);
            }
        });
    }

    function toggleSel(id) {
        if (state.sel.has(id)) state.sel.delete(id);
        else state.sel.add(id);
        render();
    }
    const selectedNotes = () => state.notes.filter((n) => state.sel.has(n.id));

    function bulk(label, mutate) {
        const items = selectedNotes();
        if (!items.length) return;
        const snap = items.map((n) => ({ n, pinned: n.pinned, archived: n.archived, trashedAt: n.trashedAt, updatedAt: n.updatedAt }));
        items.forEach(mutate);
        state.sel.clear();
        commit();
        toast(`${label}: ${items.length}`, "Tendua", () => {
            snap.forEach((s) => { s.n.pinned = s.pinned; s.n.archived = s.archived; s.n.trashedAt = s.trashedAt; s.n.updatedAt = s.updatedAt; });
            commit();
        });
    }

    async function bulkDeleteForever() {
        const items = selectedNotes();
        if (!items.length) return;
        if (!(await confirmDialog(`Futa notes ${items.length} milele? Huwezi kuzirejesha.`, "Futa milele"))) return;
        state.notes = state.notes.filter((n) => !state.sel.has(n.id));
        state.sel.clear();
        commit();
    }

    function renderSelbar() {
        const bar = $("#selbar");
        const count = state.sel.size;
        bar.hidden = count === 0;
        document.body.classList.toggle("selecting", count > 0);
        if (!count) return;
        bar.textContent = "";
        const btn = (name, label, fn) => {
            const b = h("button", { class: "icon-btn", type: "button", "aria-label": label, title: label, onclick: fn });
            b.append(svgIcon(name));
            return b;
        };
        bar.append(
            btn("x", "Ghairi uchaguzi", () => { state.sel.clear(); render(); }),
            h("span", { class: "sel-count" }, `Umechagua ${count}`),
            btn("check-square", "Chagua zote", () => { visibleNotes().forEach((n) => state.sel.add(n.id)); render(); })
        );
        if (state.filter === "trash") {
            bar.append(
                btn("restore", "Rejesha", () => bulk("Zimerejeshwa", (n) => { n.trashedAt = null; n.updatedAt = now(); })),
                btn("trash", "Futa milele", bulkDeleteForever)
            );
        } else {
            const allPinned = selectedNotes().every((n) => n.pinned);
            const unarchive = state.filter === "archive";
            bar.append(
                btn("pin", allPinned ? "Ondoa kubandika" : "Bandika juu", () =>
                    bulk(allPinned ? "Zimeondolewa kubandikwa" : "Zimebandikwa", (n) => {
                        n.pinned = !allPinned;
                        if (n.pinned) n.archived = false;
                        n.updatedAt = now();
                    })),
                btn("archive", unarchive ? "Toa kumbukumbu" : "Weka kumbukumbu", () =>
                    bulk(unarchive ? "Zimetolewa kumbukumbuni" : "Zimewekwa kumbukumbu", (n) => {
                        n.archived = !unarchive;
                        if (n.archived) n.pinned = false;
                    })),
                btn("trash", "Futa", () => bulk("Zimehamishiwa tupio", (n) => { n.trashedAt = now(); }))
            );
        }
    }

    /* ===================== Vitendo kwa notes ===================== */
    function commit() {
        flushSave();
        render();
    }

    function trashNote(n) {
        n.trashedAt = now();
        commit();
        toast("Note imehamishiwa tupio", "Tendua", () => { n.trashedAt = null; commit(); });
    }

    function archiveNote(n, flag) {
        n.archived = flag;
        if (flag) n.pinned = false;
        commit();
        toast(flag ? "Imewekwa kumbukumbu" : "Imetolewa kumbukumbuni", "Tendua", () => { n.archived = !flag; commit(); });
    }

    function restoreNote(n) {
        n.trashedAt = null;
        n.updatedAt = now();
        commit();
        toast("Note imerejeshwa");
    }

    async function deleteForever(n) {
        if (!(await confirmDialog("Futa note hii milele? Huwezi kuirejesha.", "Futa milele"))) return;
        state.notes = state.notes.filter((x) => x !== n);
        commit();
    }

    async function emptyTrash() {
        const count = state.notes.filter((n) => n.trashedAt).length;
        if (!count) return;
        if (!(await confirmDialog(`Futa notes ${count} zilizo tupioni milele?`, "Safisha tupio"))) return;
        state.notes = state.notes.filter((n) => !n.trashedAt);
        commit();
    }

    function createNote(type) {
        const n = newNote(type);
        state.notes.push(n);
        state.sel.clear();
        state.query = "";
        $("#search").value = "";
        if (state.filter === "trash" || state.filter === "archive") state.filter = "all";
        flushSave();
        render();
        openEditor(n.id, { focus: true });
    }

    /* ===================== Kihariri ===================== */
    const editor = $("#editor");
    const edBody = $("#ed-body");
    let cur = null;
    let doneOpen = true;
    let bodyDirty = false;
    let bodyTimer = null;
    const MAX_IMAGES = 12;

    const isEmptyNote = (n) =>
        !n.title.trim() && !n.body.trim() && !n.items.some((i) => i.text.trim()) && n.tags.length === 0 && !n.due && !n.images.length;

    function touch() {
        if (!cur) return;
        cur.updatedAt = now();
        scheduleSave();
        updateMeta();
    }

    function updateMeta() {
        if (!cur) return;
        let info;
        if (cur.type === "list") {
            const total = cur.items.filter((i) => i.text.trim()).length;
            const done = cur.items.filter((i) => i.text.trim() && i.done).length;
            info = `${done}/${total} zimekamilika`;
        } else {
            const words = cur.body.trim() ? cur.body.trim().split(/\s+/).length : 0;
            info = `Maneno ${words}`;
        }
        $("#ed-meta").textContent = `${relTime(cur.updatedAt)} · ${info}`;
    }

    /* ---- Maandishi yenye umbizo ---- */
    const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    function setBodyContent(n) {
        edBody.innerHTML = n.html ? n.html : Rich.fromPlain(n.body);
        Rich.linkify(edBody);
        edBody.classList.toggle("is-empty", !n.body.trim());
        bodyDirty = false;
        clearTimeout(bodyTimer);
    }

    function syncBody() {
        clearTimeout(bodyTimer);
        bodyTimer = null;
        if (!bodyDirty || !cur || cur.type === "list") { bodyDirty = false; return; }
        bodyDirty = false;
        const html = Rich.sanitize(edBody.innerHTML);
        cur.html = html;
        cur.body = Rich.toPlain(html).slice(0, 100000);
        updateMeta();
    }

    function onBodyInput() {
        bodyDirty = true;
        edBody.classList.toggle("is-empty", !edBody.textContent.trim() && !edBody.querySelector("li"));
        clearTimeout(bodyTimer);
        bodyTimer = setTimeout(syncBody, 150);
        touch();
    }

    function updateToolState() {
        if (!cur || cur.type === "list") return;
        const set = (cmd, on) => {
            const b = $(`#ed-tools [data-cmd="${cmd}"]`);
            if (b) b.setAttribute("aria-pressed", String(!!on));
        };
        try {
            set("bold", document.queryCommandState("bold"));
            set("italic", document.queryCommandState("italic"));
            set("list", document.queryCommandState("insertUnorderedList"));
            set("heading", (document.queryCommandValue("formatBlock") || "").toLowerCase() === "h2");
        } catch (e) { /* hakuna */ }
    }

    /* ---- Picha za note ---- */
    function renderEdImages() {
        const box = $("#ed-images");
        box.textContent = "";
        const imgs = cur.images;
        box.hidden = imgs.length === 0;
        box.dataset.count = String(Math.min(imgs.length, 4));
        imgs.forEach((im, idx) => {
            const img = h("img", { alt: "Picha " + (idx + 1), draggable: "false" });
            setImgSrc(img, im.id);
            img.addEventListener("click", () => openLightbox(im.id));
            const rm = h("button", { class: "icon-btn ed-img-rm", type: "button", "aria-label": "Ondoa picha", onclick: () => removeImage(im) });
            rm.append(svgIcon("x"));
            box.append(h("figure", { class: "ed-img" }, img, rm));
        });
    }

    function removeImage(im) {
        const note = cur;
        const idx = note.images.indexOf(im);
        if (idx < 0) return;
        note.images.splice(idx, 1);
        touch();
        renderEdImages();
        toast("Picha imeondolewa", "Tendua", () => {
            note.images.splice(Math.min(idx, note.images.length), 0, im);
            note.updatedAt = now();
            if (cur === note) renderEdImages();
            flushSave();
            render();
        });
    }

    async function addImages(fileList) {
        const note = cur;
        if (!note) return;
        const files = [...fileList].filter((f) => !f.type || /^image\//.test(f.type));
        if (!files.length) return;
        const room = MAX_IMAGES - note.images.length;
        if (room <= 0) return toast(`Kikomo ni picha ${MAX_IMAGES} kwa kila note`);
        setStatus("Inapakia picha...");
        let ok = 0;
        let fail = 0;
        let memOnly = false;
        for (const f of files.slice(0, room)) {
            try {
                const r = await Media.processImage(f, { max: 1600, quality: 0.82 });
                const saved = await Media.put({ id: r.id, blob: r.blob, w: r.w, h: r.h });
                if (saved === false) memOnly = true;
                note.images.push({ id: r.id, w: r.w, h: r.h });
                ok++;
            } catch (e) {
                fail++;
            }
        }
        Media.persist();
        if (cur === note) { renderEdImages(); touch(); }
        else { note.updatedAt = now(); flushSave(); render(); }
        if (!ok) toast("Picha haikuweza kusomwa");
        else if (memOnly) toast("Hifadhi ya picha haipatikani kwenye kivinjari hiki. Picha zitapotea ukifunga app.");
        else if (fail) toast(`Picha ${ok} zimeongezwa, ${fail} hazikuweza kusomwa`);
        else toast(ok === 1 ? "Picha imeongezwa" : `Picha ${ok} zimeongezwa`);
        if (files.length > room) toast(`Kikomo ni picha ${MAX_IMAGES} kwa kila note`);
    }

    function openLightbox(id) {
        const dlg = $("#lightbox");
        const img = $("#lb-img");
        img.removeAttribute("src");
        Media.url(id).then((u) => { if (u) img.src = u; });
        dlg.showModal();
    }

    /* ---- Mandharinyuma ---- */
    function applyEditorBg() {
        const has = applyBg(editor, cur, "p");
        editor.dataset.color = has ? "default" : cur.color;
    }

    function buildBgGrid() {
        const grid = $("#bg-grid");
        if (grid.dataset.built) return;
        grid.dataset.built = "1";
        const label = (t) => h("span", { class: "sw-name" }, t);
        const none = h("button", { class: "swatch none", type: "button", "data-bg": "", "aria-label": "Bila mandharinyuma", "aria-pressed": "false" }, label("Hakuna"));
        const mine = h("button", { class: "swatch mine", type: "button", "aria-label": "Picha kutoka kwenye simu", onclick: () => $("#bg-input").click() });
        mine.append(svgIcon("image"), label("Picha yako"));
        grid.append(mine, none);
        Bg.PRESETS.forEach((p) => {
            Bg.ensure(p.id);
            const b = h("button", { class: "swatch has-bg bgp-" + p.id, type: "button", "data-bg": "p:" + p.id, "data-tone": p.tone, "aria-label": p.name, "aria-pressed": "false" }, label(p.name));
            grid.append(b);
        });
    }

    function markBgSelected() {
        $$("#bg-grid .swatch").forEach((b) => {
            let on = false;
            if (b.classList.contains("mine")) on = !!cur && cur.bg.startsWith("u:");
            else if (b.dataset.bg !== undefined) on = !!cur && (cur.bg || "") === b.dataset.bg;
            b.setAttribute("aria-pressed", String(on));
        });
    }

    function setBg(val) {
        if (!cur) return;
        cur.bg = val;
        cur.bgTone = "";
        touch();
        refreshEditorChrome();
        markBgSelected();
    }

    function openEditor(id, opts = {}) {
        const n = state.notes.find((x) => x.id === id);
        if (!n || n.trashedAt) return;
        cur = n;
        $("#ed-title").value = n.title;
        setBodyContent(n);
        $("#ed-menu").hidden = true;
        $("#ed-more").setAttribute("aria-expanded", "false");
        setStatus("");
        refreshEditorChrome();
        openModal(editor);
        showEditorType();
        if (opts.focus) {
            if (n.type === "list") {
                const first = $("#ed-items input");
                if (first) first.focus();
            } else {
                $("#ed-title").focus();
            }
        }
    }

    function refreshEditorChrome() {
        applyEditorBg();
        $$("#ed-colors .dot").forEach((d) => d.setAttribute("aria-checked", String(!cur.bg && d.dataset.color === cur.color)));
        renderEdImages();
        const pin = $("#ed-pin");
        pin.setAttribute("aria-pressed", String(cur.pinned));
        pin.setAttribute("aria-label", cur.pinned ? "Ondoa kubandika" : "Bandika juu");
        $("#ed-archive").setAttribute("aria-label", cur.archived ? "Toa kumbukumbu" : "Weka kumbukumbu");
        $("#ed-convert").lastChild.textContent = cur.type === "list" ? "Geuza kuwa maandishi" : "Geuza kuwa orodha";
        renderDue();
        renderEditorTags();
        updateMeta();
    }

    function showEditorType() {
        const isList = cur.type === "list";
        $("#ed-body").hidden = isList;
        $("#ed-list").hidden = !isList;
        $("#ed-fmt").hidden = isList;
        if (isList) renderListEditor();
        else updateToolState();
    }

    /* ---- Orodha ndani ya kihariri ---- */
    function itemRow(it) {
        const chk = h("button", {
            class: "chk", type: "button", "aria-pressed": String(it.done),
            "aria-label": it.done ? "Ondoa alama" : "Weka alama",
            onclick: () => { it.done = !it.done; touch(); renderListEditor(); },
        });
        chk.append(svgIcon("check"));

        const input = h("input", {
            type: "text", value: it.text, placeholder: "Kipengee", "aria-label": "Kipengee", maxlength: "1000",
            enterkeyhint: "next",
            oninput: (e) => { it.text = e.target.value; touch(); },
            onkeydown: (e) => {
                if (e.key === "Enter") { e.preventDefault(); addItemAfter(it); }
                else if (e.key === "Backspace" && it.text === "") { e.preventDefault(); removeItem(it); }
            },
        });

        const del = h("button", { class: "icon-btn", type: "button", "aria-label": "Futa kipengee", onclick: () => removeItem(it, false) });
        del.append(svgIcon("x"));
        const row = h("div", { class: "item" + (it.done ? " done" : ""), "data-item": it.id });
        if (!it.done) {
            row.append(gripButton("Buruta kipengee", (e) => {
                startDrag(e, row, row.parentElement, ".item:not(.done)", (els) => {
                    const byId = new Map(cur.items.map((i) => [i.id, i]));
                    const seq = els.map((r) => byId.get(r.dataset.item)).filter(Boolean);
                    const slots = [];
                    cur.items.forEach((i, idx) => { if (!i.done) slots.push(idx); });
                    const next = cur.items.slice();
                    slots.forEach((idx, k) => { if (seq[k]) next[idx] = seq[k]; });
                    cur.items = next;
                    touch();
                    renderListEditor();
                });
            }));
        }
        row.append(chk, input, del);
        return row;
    }

    function renderListEditor(focusId) {
        const wrap = $("#ed-items");
        wrap.textContent = "";
        const open = cur.items.filter((i) => !i.done);
        const done = cur.items.filter((i) => i.done);
        open.forEach((i) => wrap.append(itemRow(i)));

        const add = h("button", { class: "add-item", type: "button", onclick: () => addItemAfter(open[open.length - 1] || null) });
        add.append(svgIcon("plus"), "Kipengee kipya");
        wrap.append(add);

        if (done.length) {
            const head = h("button", {
                class: "done-head", type: "button", "aria-expanded": String(doneOpen),
                onclick: () => { doneOpen = !doneOpen; renderListEditor(); },
            });
            head.append(svgIcon("chevron"), `Zilizokamilika (${done.length})`);
            const clear = h("button", { class: "link", type: "button", onclick: clearDone }, "Futa zilizokamilika");
            wrap.append(h("div", { class: "done-row" }, head, clear));
            if (doneOpen) done.forEach((i) => wrap.append(itemRow(i)));
        }
        if (focusId) {
            const input = wrap.querySelector(`[data-item="${focusId}"] input`);
            if (input) input.focus();
        }
        updateMeta();
    }

    function addItemAfter(it) {
        const fresh = newItem("");
        const idx = it ? cur.items.indexOf(it) : cur.items.length - 1;
        cur.items.splice(idx + 1, 0, fresh);
        touch();
        renderListEditor(fresh.id);
    }

    function removeItem(it, focusPrev = true) {
        const open = cur.items.filter((i) => !i.done);
        const prev = open[open.indexOf(it) - 1];
        cur.items = cur.items.filter((i) => i !== it);
        if (!cur.items.length) cur.items.push(newItem(""));
        touch();
        renderListEditor(focusPrev && prev ? prev.id : null);
    }

    /* ---- Lebo ---- */
    function renderEditorTags() {
        const box = $("#ed-taglist");
        box.textContent = "";
        cur.tags.forEach((t) => {
            const x = h("button", { type: "button", "aria-label": "Ondoa lebo " + t, onclick: () => { cur.tags = cur.tags.filter((k) => k !== t); touch(); renderEditorTags(); } });
            x.append(svgIcon("x"));
            box.append(h("span", { class: "tag-chip" }, "#" + t, x));
        });
        const known = new Set();
        state.notes.forEach((n) => n.tags.forEach((t) => known.add(t)));
        const sug = $("#ed-tagsug");
        sug.textContent = "";
        const free = [...known].filter((t) => !cur.tags.includes(t)).slice(0, 12);
        free.forEach((t) => sug.append(h("button", {
            type: "button", class: "tag-pick",
            onpointerdown: (e) => e.preventDefault(),
            onclick: () => { if (cur.tags.length < 20) cur.tags.push(t); touch(); renderEditorTags(); },
        }, "#" + t)));
        sug.hidden = !free.length;
    }

    function addTagFromInput() {
        const input = $("#ed-tag");
        const parts = input.value.split(",").map(normTag).filter(Boolean);
        input.value = "";
        if (!parts.length || !cur) return;
        parts.forEach((t) => { if (!cur.tags.includes(t) && cur.tags.length < 20) cur.tags.push(t); });
        touch();
        renderEditorTags();
    }

    /* ---- Vitendo vya kihariri ---- */
    function convertType() {
        syncBody();
        if (cur.type === "text") {
            const lines = cur.body.split("\n").map((s) => s.trim()).filter(Boolean);
            cur.items = lines.length ? lines.map((l) => newItem(l.replace(/^[-*•]\s+/, ""))) : [newItem("")];
            cur.body = "";
            cur.html = "";
            cur.type = "list";
        } else {
            cur.body = cur.items.filter((i) => i.text.trim()).map((i) => (i.done ? "✓ " : "") + i.text).join("\n");
            cur.items = [];
            cur.type = "text";
            cur.html = "";
            setBodyContent(cur);
        }
        touch();
        refreshEditorChrome();
        showEditorType();
    }

    function renderDue() {
        const has = !!cur.due;
        $("#ed-due-btn").hidden = has;
        $("#ed-due-chip").hidden = !has;
        $("#ed-due").value = cur.due || "";
        if (has) {
            const info = dueInfo(cur);
            $("#ed-due-label").textContent = fmtDue(cur.due) + (info && info.overdue ? " · imechelewa" : "");
            $("#ed-due-chip").classList.toggle("overdue", !!(info && info.overdue));
        }
    }

    function openDatePicker() {
        const i = $("#ed-due");
        try { i.showPicker(); } catch (e) { i.focus(); i.click(); }
    }

    function clearDone() {
        const note = cur;
        const removed = note.items.filter((i) => i.done);
        if (!removed.length) return;
        note.items = note.items.filter((i) => !i.done);
        if (!note.items.length) note.items.push(newItem(""));
        touch();
        renderListEditor();
        toast("Zilizokamilika zimefutwa", "Tendua", () => {
            note.items = note.items.filter((i) => i.text.trim()).concat(removed);
            note.updatedAt = now();
            if (cur === note) renderListEditor();
            flushSave();
            render();
        });
    }

    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = h("a", { href: url, download: name });
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function downloadNote() {
        const text = noteText(cur);
        if (!text) return toast("Note ni tupu");
        const name = ((cur.title || "note").replace(/[\\/:*?"<>|]+/g, "").trim().slice(0, 40) || "note") + ".txt";
        downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), name);
        toast("Faili limepakuliwa");
    }

    async function shareNote() {
        const text = noteText(cur);
        if (!text) return toast("Note ni tupu");
        if (navigator.share) {
            try { await navigator.share({ title: cur.title || "Note", text }); return; }
            catch (e) { if (e && e.name === "AbortError") return; }
        }
        copyNote();
    }

    async function copyNote() {
        const text = noteText(cur);
        if (!text) return toast("Note ni tupu");
        try {
            await navigator.clipboard.writeText(text);
            toast("Maandishi yamenakiliwa");
        } catch (e) {
            toast("Imeshindwa kunakili");
        }
    }

    function duplicateNote() {
        const t = now();
        const copy = sanitizeNote({ ...JSON.parse(JSON.stringify(cur)), id: uid(), createdAt: t, updatedAt: t, pinned: false });
        copy.title = (copy.title ? copy.title + " " : "") + "(nakala)";
        copy.items = copy.items.map((i) => ({ ...i, id: uid() }));
        state.notes.push(copy);
        flushSave();
        toast("Nakala imetengenezwa");
    }

    /* ---- Matukio ya kihariri ---- */
    $("#ed-title").addEventListener("input", (e) => { cur.title = e.target.value; touch(); });
    edBody.addEventListener("input", onBodyInput);
    // Weka maandishi ya kawaida tu (hakuna umbizo la kunakili kutoka kwingine)
    edBody.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text/plain");
        if (!text) return;
        const t = text.trim();
        const href = /^(https?:\/\/\S+|www\.\S+)$/i.test(t) ? Rich.safeHref(t) : null;
        if (href) document.execCommand("insertHTML", false, `<a href="${escHtml(href)}">${escHtml(t)}</a>`);
        else document.execCommand("insertText", false, text);
    });
    edBody.addEventListener("drop", (e) => {
        e.preventDefault();
        const t = e.dataTransfer && e.dataTransfer.getData("text/plain");
        if (t) document.execCommand("insertText", false, t);
    });
    edBody.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest("a");
        if (!a) return;
        e.preventDefault();
        const href = a.getAttribute("href");
        toast(href.replace(/^https?:\/\//, "").slice(0, 42), "Fungua", () => window.open(href, "_blank", "noopener"));
    });
    document.addEventListener("selectionchange", () => { if (document.activeElement === edBody) updateToolState(); });

    // Toolbar: usiibe umakini wa kihariri ili uteuzi ubaki
    const tools = $("#ed-tools");
    ["pointerdown", "mousedown"].forEach((t) => tools.addEventListener(t, (e) => { if (e.target.closest(".tool")) e.preventDefault(); }));
    tools.addEventListener("click", (e) => {
        const b = e.target.closest(".tool");
        if (!b || !cur) return;
        const cmd = b.dataset.cmd;
        if (cmd === "image") return $("#img-input").click();
        if (cur.type === "list") return;
        edBody.focus();
        if (cmd === "link") return openLinkDialog();
        if (cmd === "bold") document.execCommand("bold");
        else if (cmd === "italic") document.execCommand("italic");
        else if (cmd === "list") document.execCommand("insertUnorderedList");
        else if (cmd === "heading") {
            const v = (document.queryCommandValue("formatBlock") || "").toLowerCase();
            document.execCommand("formatBlock", false, v === "h2" ? "div" : "h2");
        }
        onBodyInput();
        updateToolState();
    });

    // Kiungo
    let savedRange = null;
    function openLinkDialog() {
        const sel = window.getSelection();
        savedRange = sel.rangeCount && edBody.contains(sel.anchorNode) ? sel.getRangeAt(0).cloneRange() : null;
        const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
        const a = node && node.closest ? node.closest("a") : null;
        $("#link-url").value = a ? a.getAttribute("href") : "";
        $("#link-remove").hidden = !a;
        const dlg = $("#linkdlg");
        dlg.returnValue = "";
        dlg.showModal();
        $("#link-url").focus();
    }
    $("#link-url").addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); $("#linkdlg").close("ok"); }
    });
    $("#linkdlg").addEventListener("close", () => {
        const rv = $("#linkdlg").returnValue;
        if (!cur) return;
        edBody.focus();
        if (savedRange) {
            const s = window.getSelection();
            s.removeAllRanges();
            s.addRange(savedRange);
        }
        if (rv === "unlink") {
            document.execCommand("unlink");
            onBodyInput();
        } else if (rv === "ok") {
            const raw = $("#link-url").value.trim();
            if (!raw) return;
            const href = Rich.safeHref(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : "https://" + raw);
            if (!href) return toast("Kiungo si sahihi");
            if (window.getSelection().isCollapsed) document.execCommand("insertHTML", false, `<a href="${escHtml(href)}">${escHtml(raw)}</a>`);
            else document.execCommand("createLink", false, href);
            onBodyInput();
        }
    });

    // Picha
    $("#img-input").addEventListener("change", (e) => {
        const files = e.target.files ? [...e.target.files] : [];
        e.target.value = "";
        addImages(files);
    });
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id !== "lb-close") e.currentTarget.close(); });
    $("#lb-close").addEventListener("click", () => $("#lightbox").close());

    // Vichujio na lebo
    const navSheet = $("#navsheet"), tagSheet = $("#tagsheet");
    $("#nav-btn").addEventListener("click", () => { renderNavSheet(); navSheet.showModal(); });
    $("#tag-btn").addEventListener("click", () => { $("#tag-search").value = ""; renderTagSheet(); tagSheet.showModal(); });
    $("#nav-close").addEventListener("click", () => navSheet.close());
    $("#tag-close").addEventListener("click", () => tagSheet.close());
    [navSheet, tagSheet].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
    $("#tag-search").addEventListener("input", renderTagSheet);

    // Mandharinyuma
    const bgSheet = $("#bgsheet");
    $("#ed-bg").addEventListener("click", () => {
        if (!cur) return;
        buildBgGrid();
        markBgSelected();
        bgSheet.showModal();
    });
    $("#bg-close").addEventListener("click", () => bgSheet.close());
    bgSheet.addEventListener("click", (e) => { if (e.target === bgSheet) bgSheet.close(); });
    $("#bg-grid").addEventListener("click", (e) => {
        const b = e.target.closest(".swatch");
        if (b && b.dataset.bg !== undefined) setBg(b.dataset.bg);
    });
    $("#bg-input").addEventListener("change", async (e) => {
        const f = e.target.files && e.target.files[0];
        e.target.value = "";
        const note = cur;
        if (!f || !note) return;
        try {
            setStatus("Inapakia picha...");
            const r = await Media.processImage(f, { max: 1400, quality: 0.8 });
            const saved = await Media.put({ id: r.id, blob: r.blob, w: r.w, h: r.h });
            Media.persist();
            note.bg = "u:" + r.id;
            note.bgTone = r.tone;
            if (cur === note) { touch(); refreshEditorChrome(); markBgSelected(); }
            else { note.updatedAt = now(); flushSave(); render(); }
            if (saved === false) toast("Hifadhi ya picha haipatikani kwenye kivinjari hiki. Picha itapotea ukifunga app.");
        } catch (err) {
            toast("Picha haikuweza kusomwa");
        }
    });
    $("#ed-back").addEventListener("click", () => closeModal(editor));
    $("#ed-pin").addEventListener("click", () => { cur.pinned = !cur.pinned; if (cur.pinned) cur.archived = false; touch(); refreshEditorChrome(); });

    $("#ed-archive").addEventListener("click", () => {
        const n = cur;
        const flag = !n.archived;
        n.archived = flag;
        if (flag) n.pinned = false;
        n.updatedAt = now();
        closeModal(editor);
        toast(flag ? "Imewekwa kumbukumbu" : "Imetolewa kumbukumbuni", "Tendua", () => { n.archived = !flag; commit(); });
    });

    $("#ed-more").addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = $("#ed-menu");
        menu.hidden = !menu.hidden;
        $("#ed-more").setAttribute("aria-expanded", String(!menu.hidden));
    });
    editor.addEventListener("click", (e) => {
        if (e.target === editor) return closeModal(editor); // bonyeza nje ya kisanduku
        if (!e.target.closest("#ed-menu") && !e.target.closest("#ed-more")) {
            $("#ed-menu").hidden = true;
            $("#ed-more").setAttribute("aria-expanded", "false");
        }
    });
    $("#ed-menu").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        $("#ed-menu").hidden = true;
        $("#ed-more").setAttribute("aria-expanded", "false");
        const act = btn.dataset.act;
        if (act === "share") shareNote();
        else if (act === "copy") copyNote();
        else if (act === "duplicate") duplicateNote();
        else if (act === "txt") downloadNote();
        else if (act === "convert") convertType();
        else if (act === "delete") {
            const n = cur;
            n.trashedAt = now();
            closeModal(editor);
            toast("Note imehamishiwa tupio", "Tendua", () => { n.trashedAt = null; commit(); });
        }
    });

    $("#ed-tag").addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTagFromInput(); }
        else if (e.key === "Backspace" && !e.target.value && cur && cur.tags.length) {
            cur.tags.pop(); touch(); renderEditorTags();
        }
    });
    $("#ed-tag").addEventListener("change", addTagFromInput);
    $("#ed-tag").addEventListener("blur", addTagFromInput);

    // Tarehe ya mwisho
    $("#ed-due-btn").addEventListener("click", openDatePicker);
    $("#ed-due-label").addEventListener("click", openDatePicker);
    $("#ed-due").addEventListener("change", (e) => { cur.due = e.target.value || null; touch(); renderDue(); });
    $("#ed-due-clear").addEventListener("click", () => { cur.due = null; touch(); renderDue(); });

    // Rangi
    COLORS.forEach(([id, label]) => {
        $("#ed-colors").append(
            h("button", {
                class: "dot", type: "button", role: "radio", "data-color": id, "aria-label": label, title: label, "aria-checked": "false",
                onclick: () => { cur.color = id; cur.bg = ""; cur.bgTone = ""; touch(); refreshEditorChrome(); },
            })
        );
    });

    editor.addEventListener("close", () => {
        if (bodyDirty) syncBody();
        if (cur) {
            if (cur.type === "list") {
                cur.items = cur.items.filter((i) => i.text.trim());
            }
            cur.title = cur.title.trim();
            if (isEmptyNote(cur)) state.notes = state.notes.filter((n) => n !== cur);
            cur = null;
        }
        $("#ed-menu").hidden = true;
        flushSave();
        render();
        onModalClosed();
    });

    /* ===================== Mandhari ===================== */
    function applyTheme() {
        const t = state.settings.theme;
        if (t === "auto") document.documentElement.removeAttribute("data-theme");
        else document.documentElement.setAttribute("data-theme", t);
        requestAnimationFrame(() => {
            const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
            const meta = $('meta[name="theme-color"]');
            if (meta && bg) meta.setAttribute("content", bg);
        });
    }
    function applyFont() {
        const scale = { s: 0.9, m: 1, l: 1.15 }[state.settings.fontSize] || 1;
        document.documentElement.style.setProperty("--ts", String(scale));
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

    /* ===================== Mipangilio ===================== */
    const settingsDlg = $("#settings");

    function syncSettingsUI() {
        $$("#seg-theme button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.val === state.settings.theme)));
        $$("#seg-sort button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.val === state.settings.sort)));
        $$("#seg-font button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.val === state.settings.fontSize)));
        const has = !!state.settings.pinHash;
        $("#pin-state").textContent = has ? "PIN imewashwa" : "PIN haijawekwa";
        $("#pin-set").lastChild.textContent = has ? "Badilisha PIN" : "Weka PIN";
        $("#pin-remove").hidden = !has;
    }

    $("#settings-btn").addEventListener("click", () => { syncSettingsUI(); openModal(settingsDlg); });
    $("#settings-close").addEventListener("click", () => closeModal(settingsDlg));
    settingsDlg.addEventListener("close", onModalClosed);
    settingsDlg.addEventListener("click", (e) => { if (e.target === settingsDlg) closeModal(settingsDlg); });

    $("#seg-theme").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        state.settings.theme = b.dataset.val;
        saveSettings(); applyTheme(); syncSettingsUI();
    });
    $("#seg-sort").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        state.settings.sort = b.dataset.val;
        saveSettings(); syncSettingsUI(); render();
    });
    $("#seg-font").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        state.settings.fontSize = b.dataset.val;
        saveSettings(); applyFont(); syncSettingsUI();
    });
    $("#view-btn").addEventListener("click", () => {
        state.settings.view = state.settings.view === "grid" ? "list" : "grid";
        saveSettings(); render();
    });

    // Nakala (backup), pamoja na picha
    $("#export-btn").addEventListener("click", async () => {
        try {
            const ids = new Set();
            state.notes.forEach((n) => {
                n.images.forEach((i) => ids.add(i.id));
                if (n.bg && n.bg[0] === "u") ids.add(n.bg.slice(2));
            });
            if (ids.size) toast("Inatayarisha nakala...");
            const images = {};
            for (const id of ids) {
                const rec = await Media.get(id);
                if (rec && rec.blob) images[id] = { w: rec.w || 0, h: rec.h || 0, data: await Media.blobToDataURL(rec.blob) };
            }
            const data = { app: "daftari-langu", version: 2, exportedAt: new Date().toISOString(), notes: state.notes, images };
            downloadBlob(new Blob([JSON.stringify(data, null, ids.size ? 0 : 2)], { type: "application/json" }), `daftari-langu-${new Date().toISOString().slice(0, 10)}.json`);
            toast("Nakala imepakuliwa");
        } catch (err) {
            toast("Imeshindwa kutengeneza nakala");
        }
    });
    $("#import-btn").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        try {
            const data = JSON.parse(await file.text());
            const list = Array.isArray(data) ? data : data && Array.isArray(data.notes) ? data.notes : null;
            if (!list) throw new Error("format");
            const imgs = data && !Array.isArray(data) && data.images && typeof data.images === "object" ? data.images : {};
            for (const [id, rec] of Object.entries(imgs)) {
                if (!/^[\w-]{1,64}$/.test(id) || !rec || typeof rec.data !== "string") continue;
                if (await Media.get(id)) continue;
                const blob = Media.dataURLToBlob(rec.data);
                if (blob) await Media.put({ id, blob, w: num(rec.w, 0), h: num(rec.h, 0) });
            }
            let added = 0;
            let updated = 0;
            list.map(sanitizeNote).filter(Boolean).forEach((n) => {
                const i = state.notes.findIndex((x) => x.id === n.id);
                if (i === -1) { state.notes.push(n); added++; }
                else if (n.updatedAt > state.notes[i].updatedAt) { state.notes[i] = n; updated++; }
            });
            commit();
            toast(`Zimeletwa: ${added} mpya, ${updated} zimesasishwa`);
        } catch (err) {
            toast("Faili si sahihi. Tumia nakala iliyopakuliwa kutoka Daftari Langu.");
        }
    });

    $("#wipe-btn").addEventListener("click", async () => {
        if (!(await confirmDialog("Futa notes zote na mipangilio? Huwezi kurejesha isipokuwa una nakala.", "Futa yote"))) return;
        wipeAll();
        closeModal(settingsDlg);
        toast("Data yote imefutwa");
    });

    function wipeAll() {
        state.notes = [];
        state.settings = { theme: "auto", view: "grid", sort: "updated", pinHash: null, pinSalt: null, seeded: true, fontSize: "m" };
        state.filter = "all";
        state.query = "";
        $("#search").value = "";
        state.sel.clear();
        Media.clear();
        saveSettings();
        flushSave();
        applyTheme();
        applyFont();
        render();
    }

    // Kusakinisha app
    let deferredInstall = null;
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstall = e;
        $("#install-row").hidden = false;
    });
    window.addEventListener("appinstalled", () => {
        deferredInstall = null;
        $("#install-row").hidden = true;
        toast("App imesakinishwa");
    });
    $("#install-btn").addEventListener("click", async () => {
        if (!deferredInstall) return;
        deferredInstall.prompt();
        try { await deferredInstall.userChoice; } catch (e) { /* hakuna */ }
        deferredInstall = null;
        $("#install-row").hidden = true;
    });

    /* ===================== PIN ===================== */
    const lock = $("#lock");
    let pinBuf = "";
    let pinResolve = null;

    function buildPad() {
        const pad = $("#lock-pad");
        const key = (label, fn, cls) => h("button", { type: "button", class: cls || "", onclick: fn, "aria-label": /\d/.test(label) ? label : "Futa tarakimu" }, label);
        for (let d = 1; d <= 9; d++) pad.append(key(String(d), () => pinKey(String(d))));
        pad.append(h("button", { type: "button", class: "ghost", tabindex: "-1", "aria-hidden": "true" }));
        pad.append(key("0", () => pinKey("0")));
        pad.append(key("⌫", pinBack, "ghost"));
    }

    function updateDots() {
        $$("#lock-dots i").forEach((d, i) => d.classList.toggle("on", i < pinBuf.length));
    }
    function pinKey(d) {
        if (!pinResolve || pinBuf.length >= 4) return;
        pinBuf += d;
        updateDots();
        if (pinBuf.length === 4) {
            const value = pinBuf;
            const resolve = pinResolve;
            pinResolve = null;
            setTimeout(() => resolve(value), 120);
        }
    }
    function pinBack() {
        pinBuf = pinBuf.slice(0, -1);
        updateDots();
    }
    function askPin(title, opts = {}) {
        return new Promise((resolve) => {
            pinBuf = "";
            pinResolve = resolve;
            $("#lock-title").textContent = title;
            $("#lock-msg").textContent = opts.message || "";
            $("#lock-cancel").hidden = !opts.cancel;
            $("#lock-forgot").hidden = !opts.forgot;
            lock.hidden = false;
            updateDots();
        });
    }
    function closePin() {
        lock.hidden = true;
        pinBuf = "";
        pinResolve = null;
    }
    function pinError(message) {
        const dots = $("#lock-dots");
        dots.classList.remove("shake");
        void dots.offsetWidth;
        dots.classList.add("shake");
        return message;
    }

    $("#lock-cancel").addEventListener("click", () => {
        const resolve = pinResolve;
        closePin();
        if (resolve) resolve(null);
    });
    $("#lock-forgot").addEventListener("click", async () => {
        if (!(await confirmDialog("Ukisahau PIN, notes zote na PIN vitafutwa ili uanze upya. Endelea?", "Futa na uanze upya"))) return;
        const resolve = pinResolve;
        wipeAll();
        closePin();
        if (resolve) resolve("__reset__");
    });
    document.addEventListener("keydown", (e) => {
        if (lock.hidden) return;
        if (/^\d$/.test(e.key)) pinKey(e.key);
        else if (e.key === "Backspace") pinBack();
        else if (e.key === "Escape" && !$("#lock-cancel").hidden) $("#lock-cancel").click();
    });

    const cryptoOk = !!(window.crypto && crypto.subtle);
    async function hashPin(pin, salt) {
        const bytes = new TextEncoder().encode(salt + ":" + pin);
        const buf = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    async function checkPin(pin) {
        return (await hashPin(pin, state.settings.pinSalt)) === state.settings.pinHash;
    }

    async function unlockFlow() {
        document.body.classList.add("locked");
        let message = "";
        for (;;) {
            const p = await askPin("Weka PIN yako", { forgot: true, message });
            if (p === "__reset__") break;
            if (p && (await checkPin(p))) break;
            message = pinError("PIN si sahihi, jaribu tena");
        }
        closePin();
        document.body.classList.remove("locked");
    }

    async function setPinFlow() {
        if (!cryptoOk) return toast("PIN inahitaji muunganisho salama (https)");
        if (state.settings.pinHash) {
            let msg = "";
            for (;;) {
                const old = await askPin("Weka PIN ya sasa", { cancel: true, message: msg });
                if (old === null) return;
                if (await checkPin(old)) break;
                msg = pinError("PIN si sahihi");
            }
        }
        const a = await askPin("Weka PIN mpya (tarakimu 4)", { cancel: true });
        if (a === null) return;
        let b = await askPin("Rudia PIN mpya", { cancel: true });
        while (b !== null && b !== a) {
            b = await askPin("Rudia PIN mpya", { cancel: true, message: pinError("PIN hazifanani") });
        }
        if (b === null) return;
        const salt = uid();
        state.settings.pinSalt = salt;
        state.settings.pinHash = await hashPin(a, salt);
        saveSettings();
        closePin();
        syncSettingsUI();
        toast("PIN imewekwa");
    }

    async function removePinFlow() {
        let msg = "";
        for (;;) {
            const p = await askPin("Weka PIN ili kuiondoa", { cancel: true, message: msg });
            if (p === null) return;
            if (await checkPin(p)) break;
            msg = pinError("PIN si sahihi");
        }
        state.settings.pinHash = null;
        state.settings.pinSalt = null;
        saveSettings();
        closePin();
        syncSettingsUI();
        toast("PIN imeondolewa");
    }

    $("#pin-set").addEventListener("click", setPinFlow);
    $("#pin-remove").addEventListener("click", removePinFlow);

    // Funga tena app ikikaa nyuma kwa zaidi ya dakika moja.
    let hiddenAt = 0;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            hiddenAt = now();
            flushSave();
        } else if (state.settings.pinHash && hiddenAt && now() - hiddenAt > 60000 && lock.hidden) {
            $$("dialog[open]").forEach((d) => d.close());
            unlockFlow();
        }
    });
    window.addEventListener("pagehide", flushSave);

    /* ===================== Kitufe cha kuongeza, kutafuta, njia za mkato ===================== */
    const fab = $("#fab");
    function toggleFab(open) {
        const show = open === undefined ? $("#fab-menu").hidden : open;
        $("#fab-menu").hidden = !show;
        fab.setAttribute("aria-expanded", String(show));
    }
    fab.addEventListener("click", (e) => { e.stopPropagation(); toggleFab(); });
    $("#new-text").addEventListener("click", () => { toggleFab(false); createNote("text"); });
    $("#new-list").addEventListener("click", () => { toggleFab(false); createNote("list"); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".fab-wrap")) toggleFab(false); });

    let searchTimer = null;
    $("#search").addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => { state.query = e.target.value; render(); }, 120);
    });
    $("#search").addEventListener("keydown", (e) => {
        if (e.key === "Escape") { e.target.value = ""; state.query = ""; render(); e.target.blur(); }
    });

    document.addEventListener("keydown", (e) => {
        if (!lock.hidden || $("dialog[open]")) return;
        const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#search").focus(); }
        else if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (e.key === "/") { e.preventDefault(); $("#search").focus(); }
            else if (e.key === "n") { e.preventDefault(); createNote("text"); }
            else if (e.key === "l") { e.preventDefault(); createNote("list"); }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && state.sel.size && lock.hidden && !$("dialog[open]")) { state.sel.clear(); render(); }
    });

    /* ===================== Anza ===================== */
    function handleLaunchParams() {
        const type = new URLSearchParams(location.search).get("new");
        if (type === "text" || type === "list") {
            try { history.replaceState(null, "", location.pathname); } catch (e) { /* hakuna */ }
            createNote(type);
        }
    }

    // Futa picha ambazo hakuna note inayezitumia tena
    function gcMedia() {
        if (cur) return;
        const keep = new Set();
        state.notes.forEach((n) => {
            n.images.forEach((i) => keep.add(i.id));
            if (n.bg && n.bg[0] === "u") keep.add(n.bg.slice(2));
        });
        Media.gc(keep).catch(() => {});
    }

    async function start() {
        hydrateIcons();
        buildPad();
        loadAll();
        applyTheme();
        applyFont();
        render();
        setTimeout(gcMedia, 3000);
        if (state.settings.pinHash && cryptoOk) await unlockFlow();
        handleLaunchParams();
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").catch(() => { /* si lazima */ });
        });
    }

    start();

    /* ---- Kibodi ya simu: weka kihariri juu ya kibodi ---- */
    (function keyboardFit() {
        const vv = window.visualViewport;
        if (!vv) return;
        const ed = $("#editor");
        const fit = () => {
            if (!ed.open || window.innerWidth > 700) {
                ed.style.height = ""; ed.style.transform = ""; ed.classList.remove("kb-open");
                return;
            }
            const kb = window.innerHeight - vv.height - vv.offsetTop > 120 || vv.height < window.innerHeight * 0.8;
            ed.classList.toggle("kb-open", kb);
            ed.style.height = vv.height + "px";
            ed.style.transform = vv.offsetTop ? `translateY(${vv.offsetTop}px)` : "";
        };
        vv.addEventListener("resize", fit);
        vv.addEventListener("scroll", fit);
        ed.addEventListener("close", fit);
        ed.addEventListener("focusin", () => setTimeout(fit, 120));
    })();
})();

