"""Daftari Langu: seva ndogo tu ya kutuma kurasa na faili za PWA.

Notes zote zinahifadhiwa kwenye simu ya mtumiaji (kivinjari), si kwenye seva.
Kwa hiyo hakuna database, na inafanya kazi vizuri kwenye Vercel, Render n.k.
"""
import os

from flask import Flask, make_response, render_template, send_from_directory

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/sw.js")
def service_worker():
    # Service worker lazima itoke mzizi wa tovuti (/) ili ifunike app nzima.
    resp = make_response(send_from_directory(app.static_folder, "sw.js"))
    resp.headers["Content-Type"] = "application/javascript; charset=utf-8"
    resp.headers["Service-Worker-Allowed"] = "/"
    resp.headers["Cache-Control"] = "no-cache"
    return resp


@app.route("/manifest.webmanifest")
def manifest():
    resp = make_response(send_from_directory(app.static_folder, "manifest.webmanifest"))
    resp.headers["Content-Type"] = "application/manifest+json; charset=utf-8"
    resp.headers["Cache-Control"] = "no-cache"
    return resp


@app.route("/.well-known/assetlinks.json")
def asset_links():
    # Inatumika baadaye kuunganisha app ya Play Store na tovuti hii (TWA).
    path = os.path.join(app.static_folder, "assetlinks.json")
    if not os.path.exists(path):
        return ("[]", 200, {"Content-Type": "application/json"})
    return send_from_directory(app.static_folder, "assetlinks.json", mimetype="application/json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
