import os
import sqlite3
from datetime import datetime, timezone

from flask import Flask, g, jsonify, render_template, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Vercel inaruhusu kuandika kwenye /tmp tu (folder ya app ni ya kusoma tu).
# Kumbuka: /tmp hufutika mara kwa mara, kwa hiyo notes ni za muda huko.
if os.environ.get("VERCEL") or not os.access(BASE_DIR, os.W_OK):
    DB_PATH = "/tmp/notes.db"
else:
    DB_PATH = os.path.join(BASE_DIR, "notes.db")
COLORS = {"default", "yellow", "green", "blue", "pink", "purple"}

app = Flask(__name__)


# ---------- Database ----------
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    with sqlite3.connect(DB_PATH) as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL DEFAULT '',
                content TEXT NOT NULL DEFAULT '',
                color TEXT NOT NULL DEFAULT 'default',
                pinned INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def row_to_dict(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "content": row["content"],
        "color": row["color"],
        "pinned": bool(row["pinned"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def clean_color(value):
    return value if value in COLORS else "default"


# ---------- Pages ----------
@app.route("/")
def index():
    return render_template("index.html")


# ---------- API ----------
@app.get("/api/notes")
def list_notes():
    q = request.args.get("q", "").strip()
    db = get_db()
    if q:
        like = f"%{q}%"
        rows = db.execute(
            """
            SELECT * FROM notes
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY pinned DESC, updated_at DESC
            """,
            (like, like),
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC"
        ).fetchall()
    return jsonify([row_to_dict(r) for r in rows])


@app.post("/api/notes")
def create_note():
    data = request.get_json(silent=True) or {}
    ts = now()
    db = get_db()
    cur = db.execute(
        """
        INSERT INTO notes (title, content, color, pinned, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            str(data.get("title", ""))[:200],
            str(data.get("content", "")),
            clean_color(data.get("color")),
            1 if data.get("pinned") else 0,
            ts,
            ts,
        ),
    )
    db.commit()
    row = db.execute("SELECT * FROM notes WHERE id = ?", (cur.lastrowid,)).fetchone()
    return jsonify(row_to_dict(row)), 201


@app.put("/api/notes/<int:note_id>")
def update_note(note_id):
    data = request.get_json(silent=True) or {}
    db = get_db()
    row = db.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Note haipo"}), 404

    title = str(data.get("title", row["title"]))[:200]
    content = str(data.get("content", row["content"]))
    color = clean_color(data.get("color", row["color"]))
    pinned = 1 if data.get("pinned", bool(row["pinned"])) else 0

    db.execute(
        """
        UPDATE notes
        SET title = ?, content = ?, color = ?, pinned = ?, updated_at = ?
        WHERE id = ?
        """,
        (title, content, color, pinned, now(), note_id),
    )
    db.commit()
    row = db.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    return jsonify(row_to_dict(row))


@app.delete("/api/notes/<int:note_id>")
def delete_note(note_id):
    db = get_db()
    cur = db.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    db.commit()
    if cur.rowcount == 0:
        return jsonify({"error": "Note haipo"}), 404
    return jsonify({"ok": True})


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
