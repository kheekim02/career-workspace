# Kunhee (Geoffrey) Kim

kunheekim02@gmail.com | (510) 365-8688 | Berkeley / Bay Area, CA | linkedin.com/in/kk02 | github.com/kheekim02

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

- Saved the firm from deploying a losing trading strategy by exposing lookahead bias in a legacy sentiment model through rigorous out-of-sample backtesting — a perceived +2.39% edge collapsed to negative returns under realistic transaction costs.
- Replaced a fragile CSV-based SEC scraper with a resilient threaded PostgreSQL pipeline, enabling the team to ingest and query the full universe of public filings without file-size limits or data loss on restarts (28,000+ entities).
- Designed a modular PostgreSQL warehouse schema and tuned storage so analysts could run complex cross-filing queries without performance bottlenecks on tens of millions of records.
- Automated daily market-data ingestion from a remote Windows host to a Linux Spark cluster, removing the firm's exposure to vendor IP bans and eliminating hours of manual alignment each week.
- Engineered an unattended NLP pipeline that converts raw filing text into structured corporate-relationship graphs in Neo4j, giving researchers queryable supplier/customer/acquirer edges without manual review.

## Projects

### Alpha Signals — Quantitative SEC Event Research Pipeline
*Python, Polars, PostgreSQL, Neo4j, Ollama, Graph Neural Networks · github.com/kheekim02*

- Designed an autonomous daily pipeline (signals → simulated trades → GNN predictions by 04:30 PDT) that lets researchers test whether SEC-filing corporate events predict stock returns — fully hands-off end to end.
- Modeled discrete corporate events as a Neo4j knowledge graph, enabling a Graph Neural Network to surface mispricings that flat text-sentiment models missed.

### PathWise — Intelligent iOS Running App (Spring 2026)
*Swift (SwiftUI, MapKit, ActivityKit), FastAPI, PostgreSQL + PostGIS, GraphHopper, Docker · github.com/kheekim02*

- Built a routing engine combining GraphHopper with PostGIS to generate safe, scenic running loops with native turn-by-turn voice navigation, achieving sub-2-second route generation.
- Designed a database-agnostic fallback that kept routing available during outages, and presented the app at Berkeley's startup pitch competition.

## Leadership & Research

### Student Researcher, UC Berkeley — Prof. Jill Berrick (FamiliesNotFees)
*2024 – 2025*

- Used statistical modeling on national child-welfare data to show how charging low-income parents for foster care keeps children in the system longer, equipping state lawmakers with evidence to change the policy.
- Built Tableau dashboards and rebuilt the project website, growing reach to 4,000+ views and 1,000+ unique visitors.

### Course Coordinator, ENGIN 270B — UC Berkeley Fung Institute
*Summer 2025*

- Built automated Excel tracking systems for a 100+ student graduate cohort, giving faculty actionable metrics to improve the curriculum.

## Education

**University of California, Berkeley — B.A. Data Science** | May 2026
GPA 3.81 · Completed in 3 years · Berkeley Changemaker & Entrepreneurship & Technology (SCET) Certificates · 2-yr military service, Korea (2022–24)
