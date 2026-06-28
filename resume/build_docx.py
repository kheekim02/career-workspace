#!/usr/bin/env python3
"""
Generate an ATS-optimized DOCX resume for Kunhee (Geoffrey) Kim.

Design choices follow 2026 ATS parser research:
- Single column, no tables/text boxes/images (parsers read top-to-bottom).
- Contact info in the document body, not the Word header/footer.
- Standard section headings (Summary, Experience, Skills, Education).
- Full-month dates ("January 2026 – Present") for reliable date-range parsing.
- Native bullet list style; standard font (Calibri).
"""

from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

ACCENT = RGBColor(0x1F, 0x3A, 0x5F)
INK = RGBColor(0x1A, 0x1A, 0x1A)
MUTED = RGBColor(0x55, 0x55, 0x55)
FONT = "Calibri"


def set_margins(doc, inches=0.5):
    for s in doc.sections:
        s.top_margin = s.bottom_margin = Pt(inches * 72)
        s.left_margin = s.right_margin = Pt(inches * 72)


def space(p, before=0, after=0, line=1.0):
    pf = p.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line


def run(p, text, size=10, bold=False, italic=False, color=INK):
    r = p.add_run(text)
    r.font.name = FONT
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    return r


def heading(doc, text):
    p = doc.add_paragraph()
    space(p, before=8, after=2, line=1.0)
    r = run(p, text.upper(), size=10.5, bold=True, color=ACCENT)
    # bottom border
    pPr = p._p.get_or_add_pPr()
    pbdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "1F3A5F")
    pbdr.append(bottom)
    pPr.append(pbdr)
    return p


def bullet(doc, segments):
    """segments: list of (text, bold) tuples."""
    p = doc.add_paragraph(style="List Bullet")
    space(p, before=0, after=2, line=1.05)
    for text, bold in segments:
        run(p, text, size=10, bold=bold)
    return p


def main():
    doc = Document()
    set_margins(doc, 0.5)
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(10)

    # ---- Name ----
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    space(p, after=0, line=1.0)
    run(p, "Kunhee (Geoffrey) Kim", size=20, bold=True, color=ACCENT)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    space(p, after=1, line=1.0)
    run(p, "DATA ENGINEER  ·  DATA ANALYST", size=10, bold=True, color=MUTED)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    space(p, after=2, line=1.0)
    run(p, "kunheekim02@gmail.com | Berkeley / Bay Area, CA | "
            "linkedin.com/in/kk02 | github.com/kheekim02", size=9.5, color=MUTED)

    # ---- Summary ----
    heading(doc, "Summary")
    p = doc.add_paragraph()
    space(p, after=2, line=1.05)
    run(p, "Data Engineer and UC Berkeley Data Science graduate who designs and scales production "
            "ETL/ELT pipelines, multi-terabyte data lakes and warehouses (PostgreSQL, Neo4j, Apache "
            "Spark), and ML/NLP systems. Scaled a research data lake to 2M+ filings and 33M+ records "
            "with strict data-integrity guarantees, relational data modeling, and SQL performance "
            "tuning. Bilingual in English and Korean.", size=10)

    # ---- Experience ----
    heading(doc, "Experience")
    p = doc.add_paragraph()
    space(p, before=2, after=0, line=1.0)
    run(p, "Financial Data Analyst", size=10.5, bold=True)
    run(p, " — Global Key Advisors, Bay Area, CA", size=10.5, bold=False, color=ACCENT)
    p2 = doc.add_paragraph()
    space(p2, after=2, line=1.0)
    run(p2, "January 2026 – Present", size=9.5, italic=True, color=MUTED)

    for seg in [
        [("Re-architected SEC EDGAR extract-transform-load (ETL) scraping pipelines (8-K, 10-K, "
          "10-Q, Form 15/25) from a memory-constrained CSV approach to a threaded PostgreSQL "
          "integration, scaling the data lake to ", False),
         ("2.05M+ text filings and 3.3M+ financial records across 28,000+ entities", True),
         (".", False)],
        [("Administered a PostgreSQL research warehouse (sec_data) holding ", False),
         ("33M+ records and 42 GB of text", True),
         ("; architected modular schemas, tuned TOAST storage, and debugged the query planner via "
          "system catalogs and ANALYZE statistics.", False)],
        [("Automated daily ingestion of a 1.12 GB price panel from a remote Windows host to a Linux "
          "Spark cluster, ", False),
         ("eliminating IP-ban risk and saving hours/week", True),
         ("; built data-integrity logic (CIK joins, point-in-time mapping, vendor dedup, idempotent "
          "upserts) to prevent silent corruption.", False)],
        [("Built NLP extraction with local LLMs (Ollama) parsing filings into corporate-relationship "
          "edges in a ", False),
         ("Neo4j knowledge graph", True),
         (" via an async pipeline processing ", False),
         ("~480 filings/hour", True),
         (" unattended.", False)],
        [("Migrated prediction strategy from FinBERT sentiment to Graph Neural Networks (GNN); "
          "out-of-sample backtesting ", False),
         ("exposed lookahead bias", True),
         (" (a perceived +2.39% return collapsed to negative under 30-bps costs), preventing a "
          "losing strategy deployment.", False)],
    ]:
        bullet(doc, seg)

    # ---- Projects ----
    heading(doc, "Projects")
    p = doc.add_paragraph()
    space(p, before=2, after=0, line=1.0)
    run(p, "Alpha Signals — Quantitative SEC Event Research Pipeline", size=10.5, bold=True)
    run(p, "  (Global Key Advisors)", size=9.5, color=MUTED)
    p = doc.add_paragraph()
    space(p, after=1, line=1.0)
    run(p, "Python, Polars, PostgreSQL, Neo4j, Ollama, Graph Neural Networks", size=9, italic=True, color=MUTED)
    bullet(doc, [("Flagship pipeline testing whether corporate events in SEC filings predict stock "
                  "returns; built an autonomous daily loop (signals -> simulated trades -> GNN "
                  "predictions by 04:30 PDT) over a Neo4j knowledge graph of discrete corporate "
                  "events.", False)])

    p = doc.add_paragraph()
    space(p, before=3, after=0, line=1.0)
    run(p, "PathWise — Intelligent iOS Running App", size=10.5, bold=True)
    run(p, "  (2026)", size=9.5, color=MUTED)
    p = doc.add_paragraph()
    space(p, after=1, line=1.0)
    run(p, "Swift (SwiftUI, MapKit, ActivityKit), FastAPI, PostgreSQL + PostGIS, GraphHopper, Docker",
        size=9, italic=True, color=MUTED)
    bullet(doc, [("Full-stack architect: built a pathfinding orchestrator integrating GraphHopper "
                  "with PostGIS for real-time geofenced routing and a native iOS client with "
                  "turn-by-turn voice navigation; achieved ", False),
                 ("sub-2-second route generation", True),
                 (". Presented at Berkeley's startup pitch competition.", False)])

    # ---- Technical Skills ----
    heading(doc, "Technical Skills")
    skills = [
        ("Languages:", " Python, SQL, Swift, Bash/Shell"),
        ("Data Engineering:", " ETL/ELT pipeline design, data lake & warehouse architecture, "
         "relational data modeling, schema design, idempotent ingestion, data quality & validation, "
         "deduplication, web scraping"),
        ("Databases & Big Data:", " PostgreSQL (performance tuning, query optimization), Neo4j, "
         "Apache Spark (PySpark), PostGIS, SQLite"),
        ("Python & Backend:", " Pandas, Polars, FastAPI, SQLAlchemy, Pydantic, concurrent.futures, "
         "BeautifulSoup, REST APIs"),
        ("ML / NLP:", " Local LLM inference (Ollama), Graph Neural Networks (GNN), entity "
         "resolution, backtesting, event studies"),
        ("Tools & Workflow:", " Docker, Linux, Git, cron/systemd orchestration, pg_dump/pg_restore, "
         "Tableau   |   Spoken: English & Korean (fluent)"),
    ]
    for k, v in skills:
        p = doc.add_paragraph()
        space(p, after=1, line=1.05)
        run(p, k, size=10, bold=True, color=ACCENT)
        run(p, v, size=10)

    # ---- Education ----
    heading(doc, "Education")
    p = doc.add_paragraph()
    space(p, before=2, after=0, line=1.0)
    run(p, "University of California, Berkeley — B.A. Data Science", size=10.5, bold=True)
    run(p, "   May 2026", size=9.5, italic=True, color=MUTED)
    p = doc.add_paragraph()
    space(p, after=0, line=1.05)
    run(p, "GPA 3.81 · Completed in 3 years · 2-year military service in Korea (2022–2024)",
        size=9.5, italic=True, color=MUTED)
    p = doc.add_paragraph()
    space(p, after=2, line=1.05)
    run(p, "Certificates: Berkeley Changemaker; Entrepreneurship & Technology "
            "(Sutardja Center / SCET, UC Berkeley)", size=10)

    # ---- Research & Leadership ----
    heading(doc, "Research & Leadership")
    bullet(doc, [("Student Researcher, UC Berkeley", True),
                 (" (Prof. Jill Berrick, FamiliesNotFees) — Applied statistical modeling and ML to "
                  "national child-welfare data; built Tableau dashboards and the project website, "
                  "growing reach to 4,000+ views / 1,000+ unique visitors.", False)])
    bullet(doc, [("Course Coordinator, ENGIN 270B", True),
                 (" (2025) — Ran operations for a graduate course of 100+ students; built automated "
                  "Excel tracking surfacing data-driven metrics for curriculum improvement.", False)])
    bullet(doc, [("Berkeley Data Discovery", True),
                 (" — Meta-analysis of national transfer metrics using ML on large-scale education "
                  "datasets, with interactive dashboards for strategic decision-making.", False)])

    out = "Kunhee_Kim_Resume.docx"
    doc.save(out)
    print(f"Saved {out}")


if __name__ == "__main__":
    main()
