(() => {
    "use strict";

    const $ = (sel) => document.querySelector(sel);

    const els = {
        layout: $(".layout"),
        list: $("#notes-list"),
        count: $("#count"),
        empty: $("#empty"),
        search: $("#search"),
        newBtn: $("#new-btn"),
        backBtn: $("#back-btn"),
        editor: $("#editor"),
        editorEmpty: $("#editor-empty"),
        title: $("#title"),
        content: $("#content"),
        colors: $("#colors"),
        status: $("#status"),
        pinBtn: $("#pin-btn"),
        deleteBtn: $("#delete-btn"),
        themeBtn: $("#theme-toggle"),
        toast: $("#toast"),
    };

    const state = {
        notes: [],
        current: null, // note iliyofunguliwa
        query: "",
    };

    let saveTimer = null;
    let searchTimer = null;
    let toastTimer = null;

    // ---------- API ----------
    async function api(path, options = {}) {
        const res = await fetch(path, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        if (!res.ok) throw new Error("Hitilafu ya seva");
        return res.json();
    }

    async function loadNotes() {
        const q = encodeURIComponent(state.query);
        state.notes = await api(`/api/notes?q=${q}`);
        renderList();
    }

    // ---------- Render ----------
    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleString("sw-TZ", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function renderList() {
        els.list.innerHTML = "";
        els.count.textContent = `${state.notes.length} notes`;
        els.empty.hidden = state.notes.length !== 0;

        for (const note of state.notes) {
            const li = document.createElement("li");
            li.className = "note-item";
            li.dataset.color = note.color;
            li.dataset.id = note.id;
            if (state.current && state.current.id === note.id) {
                li.classList.add("selected");
            }

            const h3 = document.createElement("h3");
            h3.textContent = (note.pinned ? "📌 " : "") + (note.title || "Bila kichwa");

            const p = document.createElement("p");
            p.textContent = note.content || "Hakuna maandishi";

            const time = document.createElement("time");
            time.textContent = formatDate(note.updated_at);

            li.append(h3, p, time);
            li.addEventListener("click", () => openNote(note.id));
            els.list.appendChild(li);
        }
    }

    function showEditor(note) {
        state.current = note;
        els.editorEmpty.hidden = true;
        els.editor.hidden = false;
        els.layout.classList.add("editing");

        els.title.value = note.title;
        els.content.value = note.content;
        applyColor(note.color);
        applyPinned(note.pinned);
        setStatus("Imehifadhiwa");
        renderList();
    }

    function closeEditor() {
        state.current = null;
        els.editor.hidden = true;
        els.editorEmpty.hidden = false;
        els.layout.classList.remove("editing");
        renderList();
    }

    function applyColor(color) {
        els.editor.dataset.color = color;
        els.colors.querySelectorAll(".dot").forEach((d) => {
            d.classList.toggle("active", d.dataset.color === color);
        });
    }

    function applyPinned(pinned) {
        els.pinBtn.classList.toggle("active", pinned);
        els.pinBtn.textContent = pinned ? "📌 Imebandikwa" : "📌 Bandika";
    }

    function setStatus(text) {
        els.status.textContent = text;
    }

    function toast(message) {
        els.toast.textContent = message;
        els.toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => (els.toast.hidden = true), 2200);
    }

    // ---------- Actions ----------
    function openNote(id) {
        const note = state.notes.find((n) => n.id === id);
        if (note) showEditor({ ...note });
    }

    async function createNote() {
        try {
            const note = await api("/api/notes", {
                method: "POST",
                body: JSON.stringify({ title: "", content: "" }),
            });
            state.query = "";
            els.search.value = "";
            await loadNotes();
            showEditor(note);
            els.title.focus();
        } catch (e) {
            toast("Imeshindwa kutengeneza note");
        }
    }

    function scheduleSave() {
        if (!state.current) return;
        setStatus("Inaandika...");
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveCurrent, 500);
    }

    async function saveCurrent() {
        if (!state.current) return;
        const payload = {
            title: els.title.value,
            content: els.content.value,
            color: state.current.color,
            pinned: state.current.pinned,
        };
        try {
            const updated = await api(`/api/notes/${state.current.id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });
            state.current = updated;
            setStatus("Imehifadhiwa ✓");
            await loadNotes();
        } catch (e) {
            setStatus("Haikuhifadhiwa!");
            toast("Imeshindwa kuhifadhi");
        }
    }

    async function deleteCurrent() {
        if (!state.current) return;
        if (!confirm("Una uhakika unataka kufuta note hii?")) return;
        try {
            await api(`/api/notes/${state.current.id}`, { method: "DELETE" });
            clearTimeout(saveTimer);
            closeEditor();
            await loadNotes();
            toast("Note imefutwa");
        } catch (e) {
            toast("Imeshindwa kufuta");
        }
    }

    // ---------- Theme ----------
    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        els.themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
        try { localStorage.setItem("theme", theme); } catch (e) { /* hakuna hifadhi */ }
    }

    function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem("theme"); } catch (e) { /* hakuna hifadhi */ }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(saved || (prefersDark ? "dark" : "light"));
    }

    // ---------- Events ----------
    els.newBtn.addEventListener("click", createNote);
    els.backBtn.addEventListener("click", async () => {
        clearTimeout(saveTimer);
        await saveCurrent();
        closeEditor();
    });

    els.title.addEventListener("input", scheduleSave);
    els.content.addEventListener("input", scheduleSave);

    els.colors.addEventListener("click", (e) => {
        const dot = e.target.closest(".dot");
        if (!dot || !state.current) return;
        state.current.color = dot.dataset.color;
        applyColor(state.current.color);
        scheduleSave();
    });

    els.pinBtn.addEventListener("click", () => {
        if (!state.current) return;
        state.current.pinned = !state.current.pinned;
        applyPinned(state.current.pinned);
        scheduleSave();
    });

    els.deleteBtn.addEventListener("click", deleteCurrent);

    els.search.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            state.query = els.search.value.trim();
            loadNotes();
        }, 250);
    });

    els.themeBtn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        setTheme(next);
    });

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            clearTimeout(saveTimer);
            saveCurrent();
        }
    });

    // ---------- Anza ----------
    initTheme();
    loadNotes().catch(() => toast("Imeshindwa kupakia notes"));
})();
