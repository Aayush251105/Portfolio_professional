"""
Render certificate PDFs in public/certs to preview images for the in-page viewer.

    pip install pymupdf
    python scripts/render-certs.py

Writes public/certs/previews/<name>.jpg (1600px wide) for every public/certs/<name>.pdf.
Re-run after adding or replacing a certificate PDF.
"""
import pathlib
import pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public" / "certs"
OUT = ROOT / "previews"
OUT.mkdir(exist_ok=True)

for pdf in sorted(ROOT.glob("*.pdf")):
    doc = pymupdf.open(pdf)
    page = doc[0]
    zoom = 1600 / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    target = OUT / f"{pdf.stem}.jpg"
    pix.save(target, jpg_quality=86)
    print(f"{pdf.name} -> previews/{target.name} ({pix.width}x{pix.height}, {target.stat().st_size // 1024} KB)")
