# Kunhee (Geoffrey) Kim

kunheekim02@gmail.com | Berkeley / Bay Area, CA | linkedin.com/in/kk02 | github.com/kheekim02

## Summary

Data engineer and UC Berkeley Data Science graduate specializing in building and scaling production
data pipelines, multi-terabyte data lakes and warehouses (PostgreSQL, Neo4j, Spark), and ML/NLP
systems. Strong in robust ETL with strict data-integrity guarantees, SQL performance tuning, and
operating split-host Linux/Windows infrastructure. Bilingual in English and Korean.

## Education

**University of California, Berkeley** — B.A. Data Science | May 2026
GPA 3.81 · Completed degree in 3 years · 2-year military service in Korea (2022–2024)

Certificates:
- Berkeley Changemaker Certificate — UC Berkeley
- Certificate in Entrepreneurship & Technology — Sutardja Center for Entrepreneurship & Technology (SCET), UC Berkeley

## Skills

- **Languages:** Python, SQL, Swift, Bash/Shell, PowerShell
- **Data Engineering:** ETL/ELT pipeline design, data lake & warehouse architecture, schema design, idempotent ingestion, deduplication, point-in-time alignment, web scraping
- **Databases & Big Data:** PostgreSQL (TOAST tuning, query-planner diagnostics, performance tuning), Neo4j, Apache Spark, PostGIS, SQLite
- **Python Stack:** Pandas, Polars, concurrent.futures, BeautifulSoup, requests, psycopg3/pg8000, SQLAlchemy, FastAPI, Pydantic
- **ML / NLP:** Local LLM inference (Ollama, vLLM), prompt engineering, Graph Neural Networks, FinBERT, entity resolution, backtesting, event studies
- **DevOps / Infra:** Linux administration, cron/systemd, SSH tunneling, pg_dump/pg_restore, scp/rsync, Docker, Render, GPU resource management
- **BI & Full Stack:** Tableau, dashboard design, technical writing; SwiftUI, MapKit, CoreLocation, ActivityKit, REST APIs
- **Spoken Languages:** English (fluent), Korean (fluent)

## Experience

### Global Key Advisors — Financial Data Analyst
*Jan 2026 – Present · Bay Area, CA*

- Re-architected SEC EDGAR scraping pipelines (8-K, 10-K, 10-Q, Form 15/25) from a memory-constrained CSV approach to a threaded PostgreSQL integration, scaling the data lake to 2.05M+ text filings and 3.3M+ financial records across 28,000+ entities.
- Automated daily ingestion of a 1.12 GB split-adjusted price panel from a remote Windows host to a Linux Spark cluster, deprecating a fragile vendor pipeline, eliminating IP-ban risk and saving hours of manual alignment per week.
- Administered a PostgreSQL research warehouse (sec_data) holding 33M+ records and 42 GB of text payloads; architected modular schemas, tuned TOAST storage, and debugged the query planner via system catalogs and ANALYZE statistics.
- Built data-integrity logic — CIK-aligned joins, point-in-time identifier mapping, strict vendor deduplication, and idempotent upserts (ON CONFLICT) — preventing silent corruption and enabling safe pipeline resume after interruptions.
- Built NLP extraction with local LLMs (Ollama) parsing filings into directed corporate-relationship edges in a Neo4j knowledge graph; engineered an async pipeline processing ~480 filings/hour unattended.
- Migrated prediction strategy from FinBERT sentiment to Graph Neural Networks; out-of-sample backtesting exposed lookahead bias (a perceived +2.39% return collapsed to negative under 30-bps costs), preventing a losing strategy deployment.
- Operated split Windows/Linux infrastructure; orchestrated daily cron/systemd/nohup jobs and authored DB restore runbooks (pg_dump/pg_restore, scp, rsync) for multi-gigabyte transfers.

## Projects

### Alpha Signals — Quantitative SEC Event Research Pipeline
*Python, Polars, PostgreSQL, Neo4j, Ollama, Graph Neural Networks*

- Flagship pipeline evaluating whether corporate events in SEC filings predict stock returns; evolved from text sentiment to a GNN over a Neo4j knowledge graph of discrete corporate events.
- Built an autonomous daily orchestration loop (signals → simulated trades → GNN predictions by 04:30 PDT) and reproducible Python pipelines joining filing text to historical returns.

### PathWise — Intelligent iOS Running App (Spring 2026)
*Swift (SwiftUI, MapKit, ActivityKit, AVFoundation), FastAPI, PostgreSQL + PostGIS, GraphHopper, Docker*

- Full-stack architect: built a custom pathfinding orchestrator integrating GraphHopper with PostGIS to inject real-time geofences, road closures, and scenic modifiers; native iOS client with turn-by-turn voice navigation and Live Activities.
- Achieved sub-2-second route generation via parallelized spatial queries; designed a database-agnostic fallback ensuring 100% routing uptime. Presented at Berkeley's startup pitch competition.

## Research & Leadership

### Student Researcher — UC Berkeley (Prof. Jill Berrick, FamiliesNotFees)
- Applied statistical modeling and ML to national child-welfare datasets; built interactive Tableau dashboards and the project website, growing reach to 4,000+ views and 1,000+ unique visitors.

### Course Coordinator — ENGIN 270B, UC Berkeley (Summer 2025)
- Managed operations for a graduate leadership course serving 100+ students across three sections; built automated Excel tracking systems surfacing data-driven metrics for curriculum improvement.

### Berkeley Data Discovery — AI & Education Analytics
- Conducted a meta-analysis of national transfer metrics using ML on large-scale education datasets; built interactive dashboards to support strategic decision-making in higher education.
