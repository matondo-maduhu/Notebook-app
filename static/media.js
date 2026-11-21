/* Hifadhi ya picha za Daftari Langu (IndexedDB) na kusafisha picha kabla ya kuhifadhi.
   Picha hazihifadhiwi kwenye localStorage kwa sababu ni ndogo mno (takriban 5MB). */
(function () {
    "use strict";

    const DB_NAME = "daftari-media";
    const STORE = "blobs";
    const mem = new Map(); // id -> { id, blob, w, h }
    const urls = new Map(); // id -> objectURL
    let dbPromise = null;

    const uid = () =>
        window.crypto && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

    function openDb() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            try {
                const req = indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
                req.onblocked = () => reject(new Error("blocked"));
            } catch (e) {
                reject(e);
            }
        });
        return dbPromise;
    }

    function run(mode, fn) {
        return openDb().then(
            (db) =>
                new Promise((resolve, reject) => {
                    const tx = db.transaction(STORE, mode);
                    const req = fn(tx.objectStore(STORE));
                    tx.oncomplete = () => resolve(req ? req.result : undefined);
                    tx.onerror = () => reject(tx.error);
                    tx.onabort = () => reject(tx.error);
                })
        );
    }

    async function put(rec) {
        mem.set(rec.id, rec);
        try {
            await run("readwrite", (s) => s.put(rec));
            return true;
        } catch (e) {
            return false; // inabaki kwenye kumbukumbu ya kipindi hiki tu
        }
    }

    async function get(id) {
        if (mem.has(id)) return mem.get(id);
        try {
            const rec = await run("readonly", (s) => s.get(id));
            if (rec) mem.set(id, rec);
            return rec || null;
        } catch (e) {
            return null;
        }
    }

    function revoke(id) {
        const u = urls.get(id);
        if (u) {
            try { URL.revokeObjectURL(u); } catch (e) { /* hakuna */ }
            urls.delete(id);
        }
    }

    async function del(id) {
        mem.delete(id);
        revoke(id);
        try { await run("readwrite", (s) => s.delete(id)); } catch (e) { /* hakuna */ }
    }

    async function ids() {
        const set = new Set(mem.keys());
        try {
            const keys = await run("readonly", (s) => s.getAllKeys());
            (keys || []).forEach((k) => set.add(k));
        } catch (e) { /* hakuna */ }
        return [...set];
    }

    async function clear() {
        [...urls.keys()].forEach(revoke);
        mem.clear();
        try { await run("readwrite", (s) => s.clear()); } catch (e) { /* hakuna */ }
    }

    // Anwani ya picha ya kuonyeshwa. Inahifadhiwa ili isitengenezwe mara nyingi.
    async function url(id) {
        if (urls.has(id)) return urls.get(id);
        const rec = await get(id);
        if (!rec || !rec.blob) return "";
        const u = URL.createObjectURL(rec.blob);
        urls.set(id, u);
        return u;
    }
    const urlSync = (id) => urls.get(id) || "";

    // Futa picha zisizotumika tena (keep = seti ya id zinazotumika).
    async function gc(keep) {
        const all = await ids();
        for (const id of all) if (!keep.has(id)) await del(id);
    }

    function persist() {
        try {
            if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
        } catch (e) { /* hakuna */ }
    }

    // ---- Kusafisha picha ----
    async function decode(file) {
        if (window.createImageBitmap) {
            try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch (e) { /* jaribu njia nyingine */ }
        }
        return new Promise((resolve, reject) => {
            const u = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => { URL.revokeObjectURL(u); resolve(img); };
            img.onerror = () => { URL.revokeObjectURL(u); reject(new Error("decode")); };
            img.src = u;
        });
    }

    // Inapunguza ukubwa (max px upande mrefu), inabadilisha kuwa JPEG, na kupima mwangaza wa picha.
    async function processImage(file, opts) {
        const max = (opts && opts.max) || 1600;
        const quality = (opts && opts.quality) || 0.82;
        if (!file || !/^image\//.test(file.type || "image/")) throw new Error("type");
        const src = await decode(file);
        const sw = src.width || src.naturalWidth;
        const sh = src.height || src.naturalHeight;
        if (!sw || !sh) throw new Error("size");
        const scale = Math.min(1, max / Math.max(sw, sh));
        const w = Math.max(1, Math.round(sw * scale));
        const h = Math.max(1, Math.round(sh * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(src, 0, 0, w, h);
        if (src.close) src.close();

        const tiny = document.createElement("canvas");
        tiny.width = 24;
        tiny.height = 24;
        const tctx = tiny.getContext("2d");
        tctx.drawImage(canvas, 0, 0, 24, 24);
        const px = tctx.getImageData(0, 0, 24, 24).data;
        let sum = 0;
        for (let i = 0; i < px.length; i += 4) sum += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
        const lum = sum / (px.length / 4) / 255;

        const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
        if (!blob) throw new Error("encode");
        return { id: uid(), blob, w, h, tone: lum < 0.5 ? "dark" : "light" };
    }

    // ---- Kubadilisha kwa ajili ya nakala (backup) ----
    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => reject(r.error);
            r.readAsDataURL(blob);
        });
    }
    function dataURLToBlob(dataUrl) {
        const m = /^data:(image\/(?:jpeg|png|webp|gif));(base64),(.*)$/s.exec(dataUrl || "");
        if (!m) return null;
        const bin = atob(m[3]);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: m[1] });
    }

    window.DaftariMedia = { put, get, del, ids, clear, url, urlSync, gc, persist, processImage, blobToDataURL, dataURLToBlob };
})();
