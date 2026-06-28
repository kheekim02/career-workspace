# Kunhee (Geoffrey) Kim

kunheekim02@gmail.com | Berkeley / Bay Area, CA | linkedin.com/in/kk02 | github.com/kheekim02

## Summary

UC Berkeley Data Science graduate and data engineer who builds and scales production data pipelines,
multi-terabyte data lakes and warehouses (PostgreSQL, Neo4j, Spark), and ML/NLP systems. Strong in
robust ETL with strict data-integrity guarantees, SQL performance tuning, and Linux infrastructure.
Bilingual in English and Korean.

## Technical Skills

- **Languages & Data:** Python, SQL, Swift, Bash; PostgreSQL, Neo4j, Apache Spark, PostGIS, SQLite
- **Data Engineering:** ETL/ELT pipeline design, data lake & warehouse architecture, schema design, idempotent ingestion, deduplication, performance tuning, web scraping
- **Python & ML/NLP:** Pandas, Polars, FastAPI, SQLAlchemy, Pydantic; local LLM inference (Ollama), Graph Neural Networks, entity resolution, backtesting
- **Tools & Languages:** Docker, Linux, cron/systemd, Git, Tableau; English (fluent), Korean (fluent)

## Experience

### Global Key Advisors — Financial Data Analyst
*Jan 2026 – Present · Bay Area, CA*

- Re-architected SEC EDGAR scraping pipelines from a memory-constrained CSV approach to a threaded PostgreSQL integration, scaling the data lake to 2.05M+ text filings and 3.3M+ financial records across 28,000+ entities.
- Administered a PostgreSQL research warehouse holding 33M+ records and 42 GB of text payloads; architected modular schemas, tuned TOAST storage, and debugged the query planner via system catalogs and ANALYZE statistics.
- Automated daily ingestion of a 1.12 GB price panel to a Linux Spark cluster with CIK-aligned joins, vendor deduplication, and idempotent upserts, eliminating IP-ban risk and saving hours of manual alignment weekly.
- Built NLP extraction with local LLMs (Ollama) parsing filings into corporate-relationship edges in a Neo4j knowledge graph via an async pipeline processing ~480 filings/hour unattended.
- Migrated the prediction strategy from FinBERT sentiment to Graph Neural Networks; out-of-sample backtesting exposed lookahead bias (a +2.39% return collapsed to negative under 30-bps costs), preventing a losing strategy deployment.

## Projects

### Alpha Signals — Quantitative SEC Event Research Pipeline (Global Key Advisors)
*Python, Polars, PostgreSQL, Neo4j, Ollama, Graph Neural Networks*

- Built an autonomous daily pipeline (signals → simulated trades → GNN predictions by 04:30 PDT) evaluating whether SEC-filing corporate events predict stock returns over a Neo4j knowledge graph.

### PathWise — Intelligent iOS Running App (Spring 2026)
*Swift (SwiftUI, MapKit, ActivityKit), FastAPI, PostgreSQL + PostGIS, GraphHopper, Docker*

- Full-stack architect of a routing app with a GraphHopper + PostGIS orchestrator and native turn-by-turn navigation; achieved sub-2-second route generation and 100% uptime via a database-agnostic fallback. Presented at Berkeley's startup pitch competition.

## Education

**University of California, Berkeley — B.A. Data Science** | May 2026
GPA 3.81 · Completed in 3 years · Berkeley Changemaker & Entrepreneurship & Technology (SCET) Certificates · 2-yr military service, Korea (2022–24)

**Other experience:** Student Researcher (Prof. Berrick, *FamiliesNotFees*) — ML on child-welfare data, Tableau dashboards, site grew to 4,000+ views; Course Coordinator, ENGIN 270B (100+ students); Berkeley Data Discovery — ML meta-analysis of education metrics.
