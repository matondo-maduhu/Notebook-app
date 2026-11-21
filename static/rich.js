/* Maandishi yenye umbizo: nzito, italiki, kichwa, orodha na viungo.
   Kila HTML inayoingia (kutoka kwenye kihariri, hifadhi au faili la nakala) hupitishwa
   kwenye kichujio hiki. Vitu visivyo kwenye orodha ya vinavyoruhusiwa vinaondolewa. */
(function () {
    "use strict";

    const DROP = new Set([
        "SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "LINK", "META", "TEMPLATE", "NOSCRIPT",
        "SVG", "MATH", "FORM", "INPUT", "BUTTON", "TEXTAREA", "SELECT", "IMG", "VIDEO", "AUDIO",
        "CANVAS", "TITLE", "HEAD",
    ]);
    const MAX_HTML = 200000;
    const MAX_DEPTH = 30;

    function safeHref(raw) {
        const s = String(raw || "").trim();
        if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s.slice(0, 2000);
        if (/^www\./i.test(s)) return ("https://" + s).slice(0, 2000);
        return null;
    }

    function textOf(node) {
        return node.textContent || "";
    }

    function clean(src, out, depth) {
        src.childNodes.forEach((n) => {
            if (n.nodeType === 3) {
                out.append(document.createTextNode(n.nodeValue));
                return;
            }
            if (n.nodeType !== 1) return;
            const tag = n.tagName.toUpperCase();
            if (DROP.has(tag)) return;
            if (depth > MAX_DEPTH) {
                out.append(document.createTextNode(textOf(n)));
                return;
            }
            let el = null;
            switch (tag) {
                case "B": case "STRONG": el = document.createElement("b"); break;
                case "I": case "EM": el = document.createElement("i"); break;
                case "U": el = document.createElement("u"); break;
                case "H1": case "H2": case "H3": case "H4": case "H5": case "H6": el = document.createElement("h2"); break;
                case "UL": el = document.createElement("ul"); break;
                case "OL": el = document.createElement("ol"); break;
                case "LI": el = document.createElement("li"); break;
                case "P": case "DIV": case "BLOCKQUOTE": el = document.createElement("div"); break;
                case "BR": out.append(document.createElement("br")); return;
                case "A": {
                    const href = safeHref(n.getAttribute("href"));
                    if (href) {
                        el = document.createElement("a");
                        el.setAttribute("href", href);
                    }
                    break;
                }
                case "SPAN": {
                    // Baadhi ya vivinjari huweka umbizo kwa style badala ya b/i/u.
                    const st = (n.getAttribute("style") || "").toLowerCase();
                    const bold = /font-weight:\s*(bold|[6-9]00)/.test(st);
                    const ital = /font-style:\s*italic/.test(st);
                    const under = /text-decoration[^;]*underline/.test(st);
                    let cur = out;
                    const wrap = (t) => { const w = document.createElement(t); cur.append(w); cur = w; };
                    if (bold) wrap("b");
                    if (ital) wrap("i");
                    if (under) wrap("u");
                    clean(n, cur, depth + 1);
                    return;
                }
                default: break; // vitambulisho vingine: weka maudhui tu
            }
            if (el) {
                clean(n, el, depth + 1);
                out.append(el);
            } else {
                clean(n, out, depth + 1);
            }
        });
    }

    function sanitize(html) {
        const t = document.createElement("template");
        t.innerHTML = String(html == null ? "" : html).slice(0, MAX_HTML);
        const out = document.createElement("div");
        clean(t.content, out, 0);
        return out.innerHTML;
    }

    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Maandishi ya kawaida -> HTML ya kihariri (kila mstari ni kizuizi)
    function fromPlain(text) {
        const lines = String(text == null ? "" : text).split("\n");
        return lines.map((l) => (l ? "<div>" + esc(l) + "</div>" : "<div><br></div>")).join("");
    }

    // HTML -> maandishi ya kawaida (kwa kutafuta, kushiriki na kuhesabu maneno)
    function toPlain(html) {
        const t = document.createElement("template");
        t.innerHTML = String(html == null ? "" : html);
        let s = "";
        const endsNl = () => s === "" || s.endsWith("\n");
        function walk(node) {
            node.childNodes.forEach((c) => {
                if (c.nodeType === 3) { s += c.nodeValue; return; }
                if (c.nodeType !== 1) return;
                const tag = c.tagName;
                if (tag === "BR") { s += "\n"; return; }
                const block = tag === "DIV" || tag === "H2" || tag === "UL" || tag === "OL" || tag === "LI";
                if (block && !endsNl()) s += "\n";
                if (tag === "LI") {
                    const parent = c.parentNode;
                    const idx = Array.prototype.indexOf.call(parent.children, c) + 1;
                    s += parent.tagName === "OL" ? idx + ". " : "• ";
                }
                walk(c);
                if (block && !endsNl()) s += "\n";
            });
        }
        walk(t.content);
        return s.replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "");
    }

    const URL_RE = /((?:https?:\/\/|www\.)[^\s<>"']*[^\s<>"'.,;:!?)\]}])/gi;

    // Badilisha anwani za mtandao kwenye maandishi kuwa viungo (ndani ya mti wa DOM uliopo)
    function linkify(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                for (let p = node.parentNode; p && p !== root; p = p.parentNode) if (p.nodeName === "A") return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            URL_RE.lastIndex = 0;
            if (!URL_RE.test(text)) return;
            URL_RE.lastIndex = 0;
            const frag = document.createDocumentFragment();
            let last = 0;
            let m;
            while ((m = URL_RE.exec(text))) {
                const href = safeHref(m[1]);
                if (m.index > last) frag.append(text.slice(last, m.index));
                if (href) {
                    const a = document.createElement("a");
                    a.setAttribute("href", href);
                    a.textContent = m[1];
                    frag.append(a);
                } else {
                    frag.append(m[1]);
                }
                last = m.index + m[1].length;
            }
            if (last < text.length) frag.append(text.slice(last));
            node.parentNode.replaceChild(frag, node);
        });
    }

    // Angazia maneno yaliyotafutwa ndani ya mti wa DOM
    function markText(root, query) {
        const q = String(query || "").trim().toLowerCase();
        if (!q) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            const lower = text.toLowerCase();
            let i = lower.indexOf(q);
            if (i === -1) return;
            const frag = document.createDocumentFragment();
            let last = 0;
            while (i !== -1) {
                if (i > last) frag.append(text.slice(last, i));
                const mk = document.createElement("mark");
                mk.textContent = text.slice(i, i + q.length);
                frag.append(mk);
                last = i + q.length;
                i = lower.indexOf(q, last);
            }
            if (last < text.length) frag.append(text.slice(last));
            node.parentNode.replaceChild(frag, node);
        });
    }

    // Kwa kadi za notes: viungo havibonyezeki (kadi nzima hufungua note)
    function render(html, query) {
        const t = document.createElement("template");
        t.innerHTML = sanitize(html);
        const box = document.createElement("div");
        box.append(t.content);
        linkify(box);
        box.querySelectorAll("a").forEach((a) => {
            const s = document.createElement("span");
            s.className = "lnk";
            while (a.firstChild) s.append(a.firstChild);
            a.replaceWith(s);
        });
        markText(box, query);
        return box;
    }

    const isEmpty = (html) => !String(html || "").replace(/<[^>]*>/g, "").trim();

    window.DaftariRich = { sanitize, fromPlain, toPlain, linkify, markText, render, safeHref, isEmpty };
})();
