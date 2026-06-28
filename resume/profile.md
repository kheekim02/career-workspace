# Kunhee (Geoffrey) Kim

**Email:** kunheekim02@gmail.com
**LinkedIn:** https://www.linkedin.com/in/kk02/
**GitHub:** https://github.com/kheekim02
**Location:** Berkeley / Bay Area, CA

---

## Summary

Data engineer and UC Berkeley Data Science graduate (May 2026) specializing in building and
scaling production data pipelines, research databases, and ML/NLP systems. Experienced
architecting multi-terabyte data lakes and warehouses (PostgreSQL, Neo4j, Spark), engineering
robust ETL with strict data-integrity guarantees, and operating split-host Linux/Windows
infrastructure. Bilingual in English and Korean.

---

## Education

**University of California, Berkeley** — B.A. Data Science
*Graduated May 2026 · GPA 3.81 · Completed degree in 3 years*

Served a 2-year mandatory military service in Korea (2022–2024), away from studies.

**Certificates**
- Berkeley Changemaker Certificate — UC Berkeley
- Certificate in Entrepreneurship & Technology — Sutardja Center for Entrepreneurship and Technology (SCET), UC Berkeley

---

## Skills

**Languages:** Python, SQL, Swift, Bash/Shell, PowerShell
**Data Engineering:** ETL/ELT pipeline design, data lake & warehouse architecture, schema design,
idempotent ingestion, deduplication, point-in-time data alignment, web scraping
**Big Data & Databases:** PostgreSQL (TOAST tuning, query planner diagnostics, performance tuning),
Neo4j (knowledge graphs), Apache Spark, PostGIS, SQLite
**Python Stack:** Pandas, Polars, concurrent.futures, BeautifulSoup, requests, psycopg3/pg8000,
SQLAlchemy, FastAPI, Pydantic
**ML / NLP:** Local LLM inference (Ollama, vLLM, gpt-oss:20b), prompt engineering, Graph Neural
Networks (GNN), FinBERT, entity resolution, backtesting, event studies
**DevOps / Infra:** Linux administration, cron/systemd, SSH tunneling, nohup background loops,
pg_dump/pg_restore, scp/rsync, Docker, Render, GPU resource management
**Full Stack / Mobile:** SwiftUI, MapKit, CoreLocation, ActivityKit, AVFoundation, REST APIs
**BI / Visualization:** Tableau, dashboard design, technical writing
**Spoken Languages:** English (fluent), Korean (fluent)

---

## Experience

### Global Key Advisors — Financial Data Analyst
*January 2026 – Present · Bay Area, CA*

Quantitative intelligence work spanning data engineering, database administration, NLP/ML,
research, and DevOps.

**Data Engineering & Pipelines**
- Re-architected SEC EDGAR web-scraping pipelines (8-K, 10-K, 10-Q, Form 15/25 delisting filings)
  from a memory-constrained local CSV approach to a threaded PostgreSQL integration, expanding the
  data lake to 2.05M+ text filings and 3.3M+ financial records across 28,000+ entities without
  hitting legacy 1 GB file limits.
- Automated daily ingestion of a 1.12 GB split-adjusted historical price panel from a remote
  Windows host (Zeus) to a Linux Spark cluster, deprecating a fragile Yahoo Finance pipeline,
  eliminating SEC IP-ban risk, and saving hours of manual data alignment per week.
- Built robust data-alignment logic — CIK-aligned joins, point-in-time identifier mapping, and
  strict vendor deduplication (Tiingo vs. Yahoo Finance) — to prevent silent data corruption.
- Implemented strict SEC rate-limiting (<10 req/s) and idempotent upserts (ON CONFLICT DO NOTHING)
  so pipelines safely resume after network interruptions.
- *Tools: Python, Pandas, Polars, concurrent.futures, BeautifulSoup, requests, REST APIs.*

**SQL & Database Management**
- Administered a PostgreSQL research database (sec_data) holding 2M+ text filings and 33M+
  historical financial records.
- Architected modular schemas (edgar, reference, market_data, graph, facts) and debugged query
  planner inaccuracies using system catalog views (pg_stat_user_tables) and ANALYZE statistics.
- Diagnosed and optimized storage behavior, tuning PostgreSQL's TOAST strategy for 42 GB of
  oversized variable-length text payloads.
- *Tools: PostgreSQL, psycopg3/pg8000, schema design, performance tuning, advanced/diagnostic SQL.*

**NLP, ML & Knowledge Graphs**
- Maintained NLP extraction pipelines using local LLMs (Ollama, gpt-oss:20b) to parse unstructured
  filing text into directed corporate relationship edges (supplier, customer, acquirer) stored in a
  Neo4j knowledge graph.
- Designed entity-resolution algorithms combining exact alias matches, ticker lookups, point-in-time
  identifiers, and SHA-256 fallback hashing.
- Automated structured extraction of atomic events and risk factors (Item 1 / 1A) using Pydantic
  schemas, strict confidence floors, and verbatim quote verification.
- Engineered an asynchronous NLP pipeline processing ~480 filings/hour continuously with no manual
  intervention.
- Transitioned prediction strategy from legacy 1D text sentiment (FinBERT) toward Graph Neural
  Networks based on rigorous out-of-sample backtesting and slippage analysis.
- *Tools: Ollama/vLLM, prompt engineering, Pydantic, regex, Neo4j, GNN, backtesting.*

**Dashboards, Reports & Research**
- Supported "SEC Event Radar" workflows, converting unstructured filing notes into actionable
  corporate event and listing/uplisting candidates for downstream users.
- Evaluated predictive power of SEC filing items against historical returns with rigorous holdout
  discipline and event-study parameters.
- Authored executive walk-throughs, technical runbooks, and AI-assisted documentation on what
  filing-derived signals can and cannot statistically prove.
- *Tools: data analysis, event studies, technical writing, dashboard design.*

**Operations & DevOps**
- Managed a split-brain architecture between a Windows warehouse host and a remote Linux analytics
  node (spark-f029), maintaining environmental parity.
- Orchestrated daily cron jobs, systemd timers, and nohup background loops coordinating data pushes,
  paper-trading engines, and ML inference batches.
- Authored and executed database restore runbooks using pg_dump/pg_restore, scp, and rsync for
  multi-gigabyte warehouse transfers.
- Troubleshot infra failures including SSH tunnel socket collisions, stale PostgreSQL statistics,
  and GPU VRAM contention.
- *Tools: Bash/shell, Linux admin, cron/systemd, SSH tunneling, Windows PowerShell.*

**Key Wins**
- Prevented deployment of a flawed strategy: out-of-sample backtesting exposed lookahead bias in a
  legacy FinBERT sentiment model, proving a perceived +2.39% mean return collapsed to negative under
  a realistic 30-bps transaction penalty — saving the firm from a losing strategy.

---

## Projects

### Alpha Signals — Quantitative SEC Event Research Pipeline
*Python, Polars, PostgreSQL, Neo4j, Ollama (gpt-oss:20b), Graph Neural Networks*

Flagship research pipeline built as Financial Data Analyst at Global Key Advisors, evaluating
whether corporate events in SEC filings (8-Ks, 10-Ks) predict subsequent stock returns — evolving
from 1D text sentiment to a Graph Neural Network over a Neo4j knowledge graph of discrete corporate
events. Built reproducible Python pipelines joining filing text to historical returns, an autonomous
daily orchestration loop (signals → simulated trades → GNN predictions by 04:30 PDT), and
out-of-sample backtests that flagged lookahead bias in a legacy sentiment model. *(See Global Key
Advisors role above for production details.)*

### PathWise — Intelligent iOS Running App
*Swift (SwiftUI, MapKit, CoreLocation, ActivityKit, AVFoundation), Python (FastAPI, SQLAlchemy),
Docker, Render, PostgreSQL + PostGIS, GraphHopper, Open-Meteo, Overpass (OSM), Socrata/511*

An iOS running app that dynamically generates elevation-controlled, geofenced routing loops and
guides runners with native turn-by-turn audio navigation and Live Activities. **Role: Full-Stack
Architect & Lead Developer.** *(Spring 2026)*

- Architected a custom pathfinding orchestrator integrating GraphHopper with PostGIS to inject
  real-time safety geofences, road closures, and scenic modifiers into generated routes.
- Built a native iOS client from scratch with custom turn-by-turn voice navigation (AVFoundation
  audio ducking) and interactive elevation previews.
- Integrated ActivityKit to push live heads-up navigation to the lock screen and Dynamic Island.
- Engineered an asynchronous backend pipeline that autonomously ingests, grids, and scores
  municipal crime and traffic data every 30 minutes to update routing parameters.
- **Impact:** Sub-2-second route generation via parallelized spatial queries and environmental API
  fetches; eliminated the "route spiking" failure common in competing loop generators via strict
  geographic bounding; designed a database-agnostic fallback (SQLite memory bypass) ensuring 100%
  routing uptime during DB migrations/outages. Presented at Berkeley's startup pitch competition.

---

## Research & Additional Experience

### Student Researcher — UC Berkeley (Prof. Jill Berrick, *FamiliesNotFees*)
- Applied statistical modeling and machine learning to national child-welfare datasets to deliver
  actionable insights for state lawmakers and policy advocates.
- Built interactive Tableau dashboards as decision-support tools and developed the project website
  from scratch (HTML/CSS, built with Cursor + Claude).
- Migrated the platform from Weebly to WordPress and optimized digital presence, growing reach to
  4,000+ views and 1,000+ unique visitors.

### Course Coordinator — ENGIN 270B, UC Berkeley (Summer 2025)
- Managed operations for a graduate leadership course (Prof. Bulent Erbilgin) serving 100+ students
  across three sections; ran bCourses management and technical support for faculty and guest
  speakers.
- Tracked attendance/participation each session and gave direct feedback; built automated Excel
  tracking systems with advanced formulas to streamline grading and surface data-driven metrics for
  curriculum improvement.

### Berkeley Data Discovery — AI & Education Analytics
*A Meta-Analysis of National Transfer Metrics*
- Conducted a meta-analysis of national transfer metrics using AI-driven education analytics to
  identify trends for improving student credit-transfer pathways and outcomes.
- Leveraged machine learning on large-scale education datasets and built interactive business
  dashboards to support strategic decision-making in higher education.

---

## Keywords to emphasize (DE / DA roles)

data lake, data warehouse, ETL/ELT, pipeline, PostgreSQL, SQL, Spark, Python, Pandas, Polars,
Neo4j, knowledge graph, schema design, performance tuning, deduplication, idempotent, ingestion,
Tableau, dashboards, FastAPI, PostGIS, Docker, Linux, cron, orchestration, backtesting, NLP, LLM,
GNN, entity resolution
