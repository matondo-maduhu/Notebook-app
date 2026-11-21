/* Mandharinyuma 12 zilizobuniwa kwa SVG kwa ajili ya notes.
   Kila moja inatengenezwa mara mbili: ya wima (kihariri na kichagua) na ya mlalo (kadi). */
(function () {
    "use strict";

    const r1 = (n) => Math.round(n * 10) / 10;

    function rng(seed) {
        let s = seed >>> 0;
        return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
    }

    function ridgeY(W, base, amp, wl, ph, x) {
        return (
            base +
            amp * (0.6 * Math.sin((2 * Math.PI * x) / (W * wl) + ph) + 0.4 * Math.sin((2 * Math.PI * x) / (W * wl * 0.43) + ph * 2.1))
        );
    }
    // Kilima kilichojazwa hadi chini
    function ridge(W, H, base, amp, wl, ph) {
        const steps = 120;
        let d = "M0 " + H;
        for (let i = 0; i <= steps; i++) {
            const x = (W * i) / steps;
            d += "L" + r1(x) + " " + r1(ridgeY(W, base, amp, wl, ph, x));
        }
        return d + "L" + W + " " + H + "Z";
    }
    // Mstari wa juu wa kilima tu (kwa povu la mawimbi)
    function ridgeLine(W, base, amp, wl, ph) {
        const steps = 120;
        let d = "";
        for (let i = 0; i <= steps; i++) {
            const x = (W * i) / steps;
            d += (i ? "L" : "M") + r1(x) + " " + r1(ridgeY(W, base, amp, wl, ph, x));
        }
        return d;
    }

    const wrap = (W, H, defs, body) =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;

    const stops = (list) =>
        list.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("");
    const lgrad = (id, list, x1, y1, x2, y2) =>
        `<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${stops(list)}</linearGradient>`;
    const rgrad = (id, cx, cy, r, list) =>
        `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}">${stops(list)}</radialGradient>`;

    function starField(W, H, count, seed, maxY) {
        const rnd = rng(seed);
        let s = "";
        for (let i = 0; i < count; i++) {
            const x = rnd() * W;
            const y = rnd() * maxY;
            const r = rnd() * 1.3 + 0.35;
            s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#fff" opacity="${r1(0.25 + rnd() * 0.65)}"/>`;
        }
        return s;
    }

    function pine(x, y, h, color) {
        const hw = h * 0.2;
        let d = "";
        for (let t = 0; t < 3; t++) {
            const top = y - h + t * h * 0.27;
            const bot = top + h * 0.46;
            const w = hw * (0.55 + t * 0.35);
            d += `M${r1(x)} ${r1(top)}L${r1(x + w)} ${r1(bot)}L${r1(x - w)} ${r1(bot)}Z`;
        }
        d += `M${r1(x - h * 0.02)} ${r1(y - h * 0.08)}h${r1(h * 0.04)}v${r1(h * 0.1)}h${r1(-h * 0.04)}Z`;
        return `<path d="${d}" fill="${color}"/>`;
    }

    function acacia(x, y, s, color) {
        const sw = (k) => r1(s * k);
        return (
            `<g stroke="${color}" stroke-linecap="round" fill="none">` +
            `<path d="M${r1(x)} ${r1(y)}L${r1(x + s * 0.02)} ${r1(y - s * 0.3)}" stroke-width="${sw(0.05)}"/>` +
            `<path d="M${r1(x + s * 0.02)} ${r1(y - s * 0.3)}L${r1(x - s * 0.22)} ${r1(y - s * 0.52)}" stroke-width="${sw(0.034)}"/>` +
            `<path d="M${r1(x + s * 0.02)} ${r1(y - s * 0.3)}L${r1(x + s * 0.3)} ${r1(y - s * 0.55)}" stroke-width="${sw(0.034)}"/>` +
            `</g>` +
            `<g fill="${color}">` +
            `<ellipse cx="${r1(x - s * 0.2)}" cy="${r1(y - s * 0.56)}" rx="${sw(0.34)}" ry="${sw(0.07)}"/>` +
            `<ellipse cx="${r1(x + s * 0.28)}" cy="${r1(y - s * 0.59)}" rx="${sw(0.38)}" ry="${sw(0.075)}"/>` +
            `<ellipse cx="${r1(x + s * 0.04)}" cy="${r1(y - s * 0.67)}" rx="${sw(0.3)}" ry="${sw(0.06)}"/>` +
            `</g>`
        );
    }

    function cloud(cx, cy, s, op) {
        return (
            `<g fill="#fff" opacity="${op}">` +
            `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(s)}" ry="${r1(s * 0.28)}"/>` +
            `<ellipse cx="${r1(cx - s * 0.35)}" cy="${r1(cy - s * 0.12)}" rx="${r1(s * 0.45)}" ry="${r1(s * 0.26)}"/>` +
            `<ellipse cx="${r1(cx + s * 0.3)}" cy="${r1(cy - s * 0.16)}" rx="${r1(s * 0.5)}" ry="${r1(s * 0.3)}"/>` +
            `</g>`
        );
    }

    /* ---------- 1. Alfajiri ---------- */
    function dawn(W, H) {
        const m = Math.min(W, H);
        const hz = H * 0.64;
        const defs =
            lgrad("s", [[0, "#2a2468"], [0.38, "#8b3f9d"], [0.62, "#ee5f7f"], [0.8, "#ffa66b"], [1, "#ffd98c"]]) +
            rgrad("g", W / 2, hz, m * 0.55, [[0, "#fff1c4", 0.95], [0.35, "#ffd08a", 0.5], [1, "#ffa66b", 0]]);
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>` +
                starField(W, H, 42, 7, hz * 0.55) +
                `<circle cx="${W / 2}" cy="${r1(hz)}" r="${r1(m * 0.55)}" fill="url(#g)"/>` +
                `<circle cx="${W / 2}" cy="${r1(hz - m * 0.01)}" r="${r1(m * 0.085)}" fill="#fff4cf"/>` +
                `<path d="${ridge(W, H, H * 0.7, H * 0.03, 0.9, 0.5)}" fill="#7d3a86"/>` +
                `<path d="${ridge(W, H, H * 0.78, H * 0.035, 0.7, 2.2)}" fill="#55296f"/>` +
                `<path d="${ridge(W, H, H * 0.87, H * 0.03, 0.55, 4.1)}" fill="#331a52"/>`
        );
    }

    /* ---------- 2. Bahari ---------- */
    function ocean(W, H) {
        const defs =
            lgrad("s", [[0, "#062e4a"], [0.45, "#0a5a7a"], [1, "#14a3a8"]]) +
            rgrad("l", W * 0.5, H * 0.1, Math.max(W, H) * 0.7, [[0, "#7fe3e0", 0.35], [1, "#7fe3e0", 0]]);
        let waves = "";
        const n = 8;
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const base = H * (0.3 + t * 0.66);
            const amp = H * (0.01 + t * 0.022);
            const wl = 0.55 - t * 0.28;
            const ph = i * 1.7;
            waves += `<path d="${ridge(W, H, base, amp, wl, ph)}" fill="${i % 2 ? "rgba(255,255,255,0.07)" : "rgba(0,18,40,0.14)"}"/>`;
            waves += `<path d="${ridgeLine(W, base, amp, wl, ph)}" fill="none" stroke="rgba(255,255,255,${r1(0.18 + t * 0.2)})" stroke-width="${r1(1 + t * 1.2)}"/>`;
        }
        return wrap(W, H, defs, `<rect width="${W}" height="${H}" fill="url(#s)"/><rect width="${W}" height="${H}" fill="url(#l)"/>${waves}`);
    }

    /* ---------- 3. Msitu ---------- */
    function forest(W, H) {
        const rnd = rng(21);
        const defs =
            lgrad("s", [[0, "#0d2b25"], [0.5, "#1b5640"], [1, "#2f8a5d"]]) +
            lgrad("ray", [[0, "#d6ffe0", 0.16], [1, "#d6ffe0", 0]]);
        let rays = "";
        [0.18, 0.34, 0.5].forEach((p, i) => {
            const x = W * p;
            rays += `<path d="M${r1(x)} 0L${r1(x + W * 0.1)} 0L${r1(x + W * 0.3 + i * 20)} ${r1(H * 0.75)}L${r1(x + W * 0.12)} ${r1(H * 0.75)}Z" fill="url(#ray)"/>`;
        });
        function layer(base, amp, wl, ph, fill, tfill, th) {
            let s = `<path d="${ridge(W, H, base, amp, wl, ph)}" fill="${fill}"/>`;
            const step = th * 0.42;
            for (let x = -th * 0.2; x < W + th * 0.2; x += step * (0.8 + rnd() * 0.5)) {
                const y = ridgeY(W, base, amp, wl, ph, Math.max(0, Math.min(W, x))) + th * 0.06;
                s += pine(x, y, th * (0.8 + rnd() * 0.4), tfill);
            }
            return s;
        }
        let flies = "";
        for (let i = 0; i < 20; i++) {
            const x = rnd() * W;
            const y = H * (0.45 + rnd() * 0.45);
            flies += `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="#ffe58a" opacity="0.14"/><circle cx="${r1(x)}" cy="${r1(y)}" r="1.7" fill="#ffe58a" opacity="0.85"/>`;
        }
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>${rays}` +
                layer(H * 0.56, H * 0.02, 0.8, 0.4, "#2a7352", "#226145", H * 0.1) +
                layer(H * 0.68, H * 0.025, 0.6, 2.0, "#1c5539", "#174a32", H * 0.15) +
                layer(H * 0.8, H * 0.02, 0.5, 3.6, "#123b29", "#0e3123", H * 0.22) +
                `<path d="${ridge(W, H, H * 0.93, H * 0.012, 0.4, 1)}" fill="#0a2519"/>${flies}`
        );
    }

    /* ---------- 4. Savanna ---------- */
    function savanna(W, H) {
        const m = Math.min(W, H);
        const hz = H * 0.7;
        const defs =
            lgrad("s", [[0, "#3a2459"], [0.35, "#a23a6e"], [0.6, "#f2654f"], [0.82, "#ffb04d"], [1, "#ffe08a"]]) +
            rgrad("g", W * 0.3, hz, m * 0.6, [[0, "#fff2c0", 0.95], [0.3, "#ffd27a", 0.5], [1, "#ffb04d", 0]]);
        const bird = (x, y, k) =>
            `<path d="M${r1(x)} ${r1(y)}q${r1(6 * k)} ${r1(-6 * k)} ${r1(12 * k)} 0q${r1(6 * k)} ${r1(-6 * k)} ${r1(12 * k)} 0" fill="none" stroke="#2a1420" stroke-width="1.6" stroke-linecap="round"/>`;
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>` +
                starField(W, H, 18, 3, hz * 0.35) +
                `<circle cx="${r1(W * 0.3)}" cy="${r1(hz)}" r="${r1(m * 0.6)}" fill="url(#g)"/>` +
                `<circle cx="${r1(W * 0.3)}" cy="${r1(hz - m * 0.01)}" r="${r1(m * 0.11)}" fill="#fff0b8"/>` +
                bird(W * 0.58, H * 0.3, m / 600 + 0.5) + bird(W * 0.66, H * 0.26, (m / 600 + 0.5) * 0.8) + bird(W * 0.5, H * 0.35, (m / 600 + 0.5) * 0.7) +
                `<path d="${ridge(W, H, H * 0.76, H * 0.012, 0.9, 1.1)}" fill="#6a2a3e" opacity="0.85"/>` +
                `<path d="${ridge(W, H, H * 0.82, H * 0.01, 0.7, 3.3)}" fill="#2a1420"/>` +
                acacia(W * 0.68, H * 0.835, m * 0.62, "#1b0d17") +
                acacia(W * 0.9, H * 0.83, m * 0.3, "#1b0d17") +
                `<path d="${ridge(W, H, H * 0.92, H * 0.008, 0.5, 0.2)}" fill="#1b0d17"/>`
        );
    }

    /* ---------- 5. Kilimanjaro ---------- */
    function kili(W, H) {
        const p = (fx, fy) => `${r1(W * fx)} ${r1(H * fy)}`;
        const defs = lgrad("s", [[0, "#4f9fdc"], [0.6, "#bfe3f5"], [1, "#f4fbff"]]);
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>` +
                cloud(W * 0.2, H * 0.22, Math.min(W, H) * 0.2, 0.9) +
                cloud(W * 0.86, H * 0.16, Math.min(W, H) * 0.16, 0.8) +
                `<path d="M${p(-0.1, 0.8)}L${p(0.28, 0.5)}L${p(0.4, 0.44)}L${p(0.56, 0.33)}L${p(0.7, 0.42)}L${p(0.8, 0.5)}L${p(1.1, 0.8)}Z" fill="#6e7fa6"/>` +
                `<path d="M${p(0.56, 0.33)}L${p(0.7, 0.42)}L${p(0.8, 0.5)}L${p(1.1, 0.8)}L${p(0.62, 0.8)}Z" fill="#53628d" opacity="0.7"/>` +
                `<path d="M${p(0.56, 0.33)}L${p(0.66, 0.394)}L${p(0.625, 0.4)}L${p(0.6, 0.385)}L${p(0.575, 0.41)}L${p(0.54, 0.385)}L${p(0.51, 0.41)}L${p(0.47, 0.392)}Z" fill="#fff"/>` +
                cloud(W * 0.45, H * 0.47, Math.min(W, H) * 0.22, 0.85) +
                `<path d="${ridge(W, H, H * 0.78, H * 0.015, 0.8, 0.8)}" fill="#a6d48e"/>` +
                `<path d="${ridge(W, H, H * 0.87, H * 0.014, 0.6, 2.5)}" fill="#78b86a"/>` +
                acacia(W * 0.22, H * 0.9, Math.min(W, H) * 0.3, "#3a6b3e") +
                `<path d="${ridge(W, H, H * 0.96, H * 0.008, 0.5, 4)}" fill="#4f9150"/>`
        );
    }

    /* ---------- 6. Usiku ---------- */
    function night(W, H) {
        const m = Math.min(W, H);
        const mx = W * 0.72;
        const my = H * 0.2;
        const mr = m * 0.075;
        const defs =
            lgrad("s", [[0, "#04061a"], [0.6, "#141a4a"], [1, "#2a2466"]]) +
            rgrad("g", mx, my, m * 0.4, [[0, "#cfd6ff", 0.45], [1, "#cfd6ff", 0]]) +
            lgrad("t", [[0, "#fff", 0], [1, "#fff", 0.95]]) +
            `<mask id="c"><rect width="${W}" height="${H}" fill="#fff"/><circle cx="${r1(mx + mr * 0.42)}" cy="${r1(my - mr * 0.12)}" r="${r1(mr * 0.88)}" fill="#000"/></mask>`;
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>` +
                starField(W, H, 150, 11, H * 0.8) +
                `<circle cx="${r1(mx)}" cy="${r1(my)}" r="${r1(m * 0.4)}" fill="url(#g)"/>` +
                `<g mask="url(#c)"><circle cx="${r1(mx)}" cy="${r1(my)}" r="${r1(mr)}" fill="#f4efd3"/></g>` +
                `<path d="M${r1(W * 0.16)} ${r1(H * 0.1)}L${r1(W * 0.36)} ${r1(H * 0.2)}" stroke="url(#t)" stroke-width="1.6" stroke-linecap="round" fill="none"/>` +
                `<path d="${ridge(W, H, H * 0.84, H * 0.05, 0.7, 0.9)}" fill="#0b0e2a"/>` +
                `<path d="${ridge(W, H, H * 0.93, H * 0.03, 0.5, 3)}" fill="#060818"/>`
        );
    }

    /* ---------- 7. Kanga ---------- */
    function kanga(W, H) {
        const defs =
            `<pattern id="p" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">` +
            `<rect width="120" height="120" fill="#fbefd5"/>` +
            `<circle cx="60" cy="60" r="38" fill="#c8372d"/><circle cx="60" cy="60" r="29" fill="#fbefd5"/>` +
            `<circle cx="60" cy="60" r="20" fill="#1c3f78"/><circle cx="60" cy="60" r="9" fill="#f2b632"/>` +
            `<path d="M0 0h18L0 18zM120 0h-18l18 18zM0 120h18L0 102zM120 120h-18l18-18z" fill="#1c3f78"/>` +
            `<circle cx="60" cy="9" r="4" fill="#c8372d"/><circle cx="60" cy="111" r="4" fill="#c8372d"/>` +
            `<circle cx="9" cy="60" r="4" fill="#c8372d"/><circle cx="111" cy="60" r="4" fill="#c8372d"/>` +
            `<path d="M34 34l6 6M86 34l-6 6M34 86l6-6M86 86l-6-6" stroke="#f2b632" stroke-width="3" stroke-linecap="round"/>` +
            `</pattern>`;
        return wrap(W, H, defs, `<rect width="${W}" height="${H}" fill="url(#p)"/>`);
    }

    /* ---------- 8. Karatasi ---------- */
    function paper(W, H) {
        let lines = "";
        for (let y = 64; y < H; y += 34) lines += `<path d="M0 ${y}H${W}" stroke="#bcd3ee" stroke-width="1.3"/>`;
        const defs = lgrad("s", [[0, "#fffdf4"], [1, "#fbf5e2"]]);
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>${lines}` +
                `<path d="M${r1(Math.min(72, W * 0.12))} 0V${H}" stroke="#ef9a9a" stroke-width="1.6"/>`
        );
    }

    /* ---------- 9. Zumaridi ---------- */
    function aurora(W, H) {
        const m = Math.max(W, H);
        const blob = (id, x, y, r, c, a) => rgrad(id, x, y, r, [[0, c, a], [1, c, 0]]);
        const defs =
            blob("a", W * 0.2, H * 0.25, m * 0.6, "#2ee6a6", 0.9) +
            blob("b", W * 0.88, H * 0.2, m * 0.55, "#7a5cff", 0.9) +
            blob("c", W * 0.6, H * 0.9, m * 0.55, "#ff5fa8", 0.85) +
            blob("d", W * 0.08, H * 0.92, m * 0.45, "#1aa6ff", 0.8);
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="#071a2b"/>` +
                [["a", W * 0.2, H * 0.25, m * 0.6], ["b", W * 0.88, H * 0.2, m * 0.55], ["c", W * 0.6, H * 0.9, m * 0.55], ["d", W * 0.08, H * 0.92, m * 0.45]]
                    .map(([id, x, y, r]) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="url(#${id})"/>`)
                    .join("")
        );
    }

    /* ---------- 10. Lavenda ---------- */
    function lavender(W, H) {
        const m = Math.max(W, H);
        const defs =
            lgrad("s", [[0, "#f0e5ff"], [1, "#c6e1ff"]], 0, 0, 1, 1) +
            rgrad("a", W * 0.2, H * 0.2, m * 0.5, [[0, "#ffffff", 0.85], [1, "#ffffff", 0]]) +
            rgrad("b", W * 0.85, H * 0.8, m * 0.5, [[0, "#ffd3ec", 0.8], [1, "#ffd3ec", 0]]) +
            rgrad("c", W * 0.8, H * 0.15, m * 0.35, [[0, "#b9a8ff", 0.5], [1, "#b9a8ff", 0]]);
        return wrap(
            W, H, defs,
            `<rect width="${W}" height="${H}" fill="url(#s)"/>` +
                `<circle cx="${r1(W * 0.2)}" cy="${r1(H * 0.2)}" r="${r1(m * 0.5)}" fill="url(#a)"/>` +
                `<circle cx="${r1(W * 0.85)}" cy="${r1(H * 0.8)}" r="${r1(m * 0.5)}" fill="url(#b)"/>` +
                `<circle cx="${r1(W * 0.8)}" cy="${r1(H * 0.15)}" r="${r1(m * 0.35)}" fill="url(#c)"/>`
        );
    }

    /* ---------- 11. Maua ---------- */
    function flowerSvg(cx, cy, r, petal, center, rot) {
        let s = "";
        for (let k = 0; k < 5; k++) {
            s += `<ellipse cx="${cx}" cy="${r1(cy - r * 0.6)}" rx="${r1(r * 0.38)}" ry="${r1(r * 0.6)}" transform="rotate(${rot + k * 72} ${cx} ${cy})" fill="${petal}"/>`;
        }
        return s + `<circle cx="${cx}" cy="${cy}" r="${r1(r * 0.3)}" fill="${center}"/>`;
    }
    function flowers(W, H) {
        const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4.5" transform="rotate(${rot} ${x} ${y})" fill="#a6dcb9"/>`;
        const defs =
            `<pattern id="p" width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">` +
            `<rect width="140" height="140" fill="#ffe9f0"/>` +
            leaf(58, 56, 30) + leaf(14, 54, -20) + leaf(126, 112, 60) + leaf(46, 126, 10) +
            flowerSvg(35, 38, 18, "#ffb3c7", "#ffdf6e", 10) +
            flowerSvg(100, 95, 22, "#ffd3a8", "#f9a8c9", 35) +
            flowerSvg(108, 24, 10, "#c9b6ff", "#fff1a8", 0) +
            flowerSvg(28, 108, 10, "#ffffff", "#ffcf70", 20) +
            `</pattern>`;
        return wrap(W, H, defs, `<rect width="${W}" height="${H}" fill="url(#p)"/>`);
    }

    /* ---------- 12. Mawimbi (seigaiha) ---------- */
    function waves(W, H) {
        const R = 36;
        const fills = ["#173a63", "#1f4e82", "#173a63", "#1f4e82", "#173a63"];
        const radii = [R, R * 0.78, R * 0.56, R * 0.34, R * 0.14];
        const scale = (cx, cy) =>
            radii.map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r1(r)}" fill="${fills[i]}" stroke="#8fc0ea" stroke-width="1.2"/>`).join("");
        const rows = [
            [-18, [36]], [0, [0, 72]], [18, [36]], [36, [0, 72]], [54, [36]],
        ];
        let tile = `<rect width="72" height="36" fill="#12304f"/>`;
        rows.forEach(([y, xs]) => xs.forEach((x) => (tile += scale(x, y))));
        const defs = `<pattern id="p" width="72" height="36" patternUnits="userSpaceOnUse" patternTransform="scale(1.6)">${tile}</pattern>`;
        return wrap(W, H, defs, `<rect width="${W}" height="${H}" fill="url(#p)"/>`);
    }

    const PRESETS = [
        { id: "alfajiri", name: "Alfajiri", tone: "dark", scrim: "rgba(0,0,0,0.22)", art: dawn },
        { id: "bahari", name: "Bahari", tone: "dark", scrim: "rgba(0,0,0,0.2)", art: ocean },
        { id: "msitu", name: "Msitu", tone: "dark", scrim: "rgba(0,0,0,0.16)", art: forest },
        { id: "savanna", name: "Savanna", tone: "dark", scrim: "rgba(0,0,0,0.3)", art: savanna },
        { id: "kilimanjaro", name: "Kilimanjaro", tone: "light", scrim: "rgba(255,255,255,0.3)", art: kili },
        { id: "usiku", name: "Usiku", tone: "dark", scrim: "rgba(0,0,0,0.1)", art: night },
        { id: "kanga", name: "Kanga", tone: "light", scrim: "rgba(255,250,240,0.74)", art: kanga },
        { id: "karatasi", name: "Karatasi", tone: "light", scrim: null, art: paper },
        { id: "zumaridi", name: "Zumaridi", tone: "dark", scrim: "rgba(0,0,0,0.2)", art: aurora },
        { id: "lavenda", name: "Lavenda", tone: "light", scrim: null, art: lavender },
        { id: "maua", name: "Maua", tone: "light", scrim: "rgba(255,250,250,0.5)", art: flowers },
        { id: "mawimbi", name: "Mawimbi", tone: "dark", scrim: "rgba(0,0,0,0.3)", art: waves },
    ];
    const byId = (id) => PRESETS.find((p) => p.id === id) || null;

    const SCRIM = { dark: "rgba(0,0,0,0.32)", light: "rgba(255,255,255,0.4)" };
    const done = new Set();

    // Ongeza CSS ya mandharinyuma kwa mara ya kwanza inapohitajika
    function ensure(id) {
        const p = byId(id);
        if (!p || done.has(id)) return p;
        done.add(id);
        const enc = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
        const layer = (art) => (p.scrim ? `linear-gradient(${p.scrim},${p.scrim}),` : "") + enc(art);
        let tag = document.getElementById("bg-presets");
        if (!tag) {
            tag = document.createElement("style");
            tag.id = "bg-presets";
            document.head.append(tag);
        }
        tag.append(
            document.createTextNode(
                `.has-bg.bgp-${id}{background-image:${layer(p.art(600, 900))}}` +
                    `.has-bg.bgc-${id}{background-image:${layer(p.art(900, 420))}}`
            )
        );
        return p;
    }

    window.DaftariBg = { PRESETS, byId, ensure, SCRIM };
})();
