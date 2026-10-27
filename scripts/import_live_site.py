#!/usr/bin/env python3
"""Import the website's public static assets from the owner's deployed demo.

Requires no pip dependencies. Refuses to save unexpected HTML in place of assets.
Run from the repository root: python scripts/import_live_site.py
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
import os
import sys
import time

BASE = os.environ.get("MOSTAR_SITE_URL", "https://mostar-city-sooty.vercel.app").rstrip("/")
FILES = [
    "index.html", "styles.css", "script.js", "gallery.css", "gallery.js",
    "assets/ogg-medium.woff2",
    *[f"assets/scene-{i}.webp" for i in range(1, 11)],
    "assets/photos/credits.json",
    *[f"assets/photos/{name}.webp" for name in (
        "bazaar", "bazaar-960", "halebija", "halebija-960",
        "kajtaz", "kajtaz-960", "mosque", "mosque-960",
        "panorama", "panorama-960",
        "user-bazaar", "user-bridge", "user-mosque"
    )],
]

def download(path):
    url = BASE + "/" + quote(path, safe="/")
    request = Request(url, headers={"User-Agent": "MostarCityRepositoryImport/1.0", "Accept": "*/*"})
    with urlopen(request, timeout=40) as response:
        data = response.read()
        ctype = response.headers.get("Content-Type", "").lower()
    if not data or data.lstrip().lower().startswith((b"<!doctype html", b"<html")) and not path.endswith(".html"):
        raise ValueError("Empty asset or an HTML error page returned")
    if path.endswith(".webp") and not data.startswith(b"RIFF"):
        raise ValueError("Image is not a WebP file")
    if path.endswith(".woff2") and not data.startswith(b"wOF2"):
        raise ValueError("Font is not a WOFF2 file")
    if path.endswith((".js", ".css", ".json")) and ("text/html" in ctype or data.startswith(b"<!doctype")):
        raise ValueError("Unexpected HTML response")
    dest = Path(path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    print(f"Downloaded {path} ({len(data):,} bytes)")

failed = []
for path in FILES:
    try:
        download(path)
    except Exception as exc:
        print(f"ERROR {path}: {exc}", file=sys.stderr)
        failed.append(path)
if failed:
    print(f"Import incomplete: {len(failed)} file(s) could not be fetched", file=sys.stderr)
    sys.exit(1)
print(f"Imported {len(FILES)} files from {BASE}")
