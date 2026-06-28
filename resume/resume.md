# Kunhee (Geoffrey) Kim
**Data Engineer · Data Analyst**

kunheekim02@gmail.com | Berkeley / Bay Area, CA | linkedin.com/in/kk02 | github.com/kheekim02

## Summary

UC Berkeley Data Science graduate and data engineer who builds and scales production pipelines,
multi-terabyte data lakes and warehouses (PostgreSQL, Neo4j, Spark), and ML/NLP systems. Strong in
robust ETL with strict data-integrity guarantees and SQL performance tuning. Bilingual in English
and Korean.

## Experience

### Global Key Advisors — Financial Data Analyst
*01/2026 – Present · Bay Area, CA*

- Re-architected SEC EDGAR scraping pipelines (8-K, 10-K, 10-Q, Form 15/25) from a memory-constrained CSV approach to a threaded PostgreSQL integration, scaling the data lake to 2.05M+ text filings and 3.3M+ financial records across 28,000+ entities.
- Administered a PostgreSQL research warehouse (sec_data) holding 33M+ records and 42 GB of text; architected modular schemas, tuned TOAST storage, and debugged the query planner via system catalogs and ANALYZE statistics.
- Automated daily ingestion of a 1.12 GB price panel from a remote Windows host to a Linux Spark cluster, eliminating IP-ban risk and saving hours/week; built data-integrity logic (CIK joins, point-in-time mapping, vendor dedup, idempotent upserts) to prevent silent corruption.
- Built NLP extraction with local LLMs (Ollama) parsing filings into corporate-relationship edges in a Neo4j knowledge graph via an async pipeline processing ~480 filings/hour unattended.
- Migrated prediction strategy from FinBERT sentiment to Graph Neural Networks; out-of-sample backtesting exposed lookahead bias (a perceived +2.39% return collapsed to negative under 30-bps costs), preventing a losing strategy deployment.

## Projects

### Alpha Signals — Quantitative SEC Event Research Pipeline (Global Key Advisors)
*Python, Polars, PostgreSQL, Neo4j, Ollama, Graph Neural Networks*

- Flagship pipeline testing whether corporate events in SEC filings predict stock returns; built an autonomous daily loop (signals → simulated trades → GNN predictions by 04:30 PDT) over a Neo4j knowledge graph of discrete corporate events.

### PathWise — Intelligent iOS Running App (Spring 2026)
*Swift (SwiftUI, MapKit, ActivityKit), FastAPI, PostgreSQL + PostGIS, GraphHopper, Docker*

- Full-stack architect: built a pathfinding orchestrator integrating GraphHopper with PostGIS for real-time geofenced routing and a native iOS client with turn-by-turn voice navigation; achieved sub-2-second route generation. Presented at Berkeley's startup pitch competition.

## Technical Skills

- **Languages:** Python, SQL, Swift, Bash/Shell
- **Data Engineering:** ETL/ELT pipeline design, data lake & warehouse architecture, schema design, idempotent ingestion, deduplication, web scraping
- **Databases & Big Data:** PostgreSQL (TOAST & performance tuning), Neo4j, Apache Spark, PostGIS, SQLite
- **Python & Backend:** Pandas, Polars, FastAPI, SQLAlchemy, Pydantic, concurrent.futures, BeautifulSoup
- **ML / NLP:** Local LLM inference (Ollama), Graph Neural Networks, entity resolution, backtesting, event studies
- **Tools & BI:** Docker, Linux, cron/systemd, pg_dump/pg_restore, Git, Tableau · **Spoken:** English & Korean (fluent)

## Education

**University of California, Berkeley** — B.A. Data Science | 05/2026
GPA 3.81 · Completed in 3 years · 2-year military service in Korea (2022–2024)
Certificates: Berkeley Changemaker; Entrepreneurship & Technology (Sutardja Center / SCET, UC Berkeley)

## Research & Leadership

- **Student Researcher, UC Berkeley** (Prof. Jill Berrick, FamiliesNotFees) — Applied statistical modeling and ML to national child-welfare data; built Tableau dashboards and the project website, growing reach to 4,000+ views / 1,000+ unique visitors.
- **Course Coordinator, ENGIN 270B** (Summer 2025) — Ran operations for a graduate course of 100+ students; built automated Excel tracking surfacing data-driven metrics for curriculum improvement.
- **Berkeley Data Discovery** — Meta-analysis of national transfer metrics using ML on large-scale education datasets, with interactive dashboards for strategic decision-making.
