/* ============================================================
   Kunhee (Geoffrey) Kim — portfolio
   2D knowledge graph: filters, clustering, particles, degree sizing
   ============================================================ */

/* ---------- 1. Graph data model ---------- */
const COLORS = {
  person:  "#f4c542",
  org:     "#7c9cff",
  project: "#5eead4",
  skill:   "#c084fc",
};

const GROUP_ANCHORS = {
  person:  { x: 0,   y: 0   },
  org:     { x: -90, y: -70 },
  project: { x: 90,  y: -50 },
  skill:   { x: 0,   y: 95  },
};

const NODES = [
  { id: "me", group: "person", label: "Geoffrey Kim",
    desc: "Data engineer & UC Berkeley Data Science graduate. I build production pipelines, data lakes/warehouses, and ML/NLP systems.",
    desc_ko: "데이터 엔지니어이자 UC 버클리 데이터 사이언스 졸업생. 프로덕션 파이프라인, 데이터 레이크/웨어하우스, ML/NLP 시스템을 구축합니다.",
    meta: ["Python", "SQL", "Spark", "Bilingual EN/KR"] },
  { id: "gka", group: "org", label: "Global Key Advisors",
    desc: "Financial Data Analyst (Jan 2026–Present). Built SEC data pipelines, a PostgreSQL research warehouse, and NLP/graph systems for quant research.",
    desc_ko: "재무 데이터 분석가 (2026년 1월–현재). SEC 데이터 파이프라인, PostgreSQL 연구 웨어하우스, 퀀트 리서치용 NLP/그래프 시스템을 구축했습니다.",
    meta: ["Jan 2026 – Present", "Data Engineering", "Quant Research"] },
  { id: "berkeley", group: "org", label: "UC Berkeley",
    desc: "B.A. Data Science, May 2026. GPA 3.81, completed in 3 years. Changemaker & Entrepreneurship & Technology (SCET) certificates.",
    desc_ko: "데이터 사이언스 학사, 2026년 5월. GPA 3.81, 3년 만에 졸업. Changemaker 및 기업가정신·기술(SCET) 수료증 취득.",
    meta: ["B.A. Data Science", "GPA 3.81", "2026"] },
  { id: "alpha", group: "project", label: "Alpha Signals",
    desc: "Quant SEC-event research pipeline. Tests whether corporate events in filings predict returns — from text sentiment to a GNN over a Neo4j knowledge graph, fully autonomous daily.",
    desc_ko: "퀀트 SEC 이벤트 리서치 파이프라인. 공시의 기업 이벤트가 수익률을 예측하는지 검증 — 텍스트 감성 분석에서 Neo4j 지식 그래프 기반 GNN까지, 완전 자동화된 일일 실행.",
    meta: ["Python", "Neo4j", "GNN", "PostgreSQL"], link: "https://github.com/kheekim02" },
  { id: "pathwise", group: "project", label: "PathWise",
    desc: "Intelligent iOS running app generating elevation-controlled, geofenced routing loops with native turn-by-turn navigation. Sub-2-second route generation. Presented at Berkeley's startup pitch competition.",
    desc_ko: "고도 제어 및 지오펜스 기반 러닝 루트를 생성하는 지능형 iOS 러닝 앱. 네이티브 턴바이턴 내비게이션, 2초 미만 경로 생성. 버클리 스타트업 피치 대회에서 발표.",
    meta: ["Swift", "FastAPI", "PostGIS", "GraphHopper"], link: "https://github.com/kheekim02" },
  { id: "fnf", group: "project", label: "FamiliesNotFees",
    desc: "Research with Prof. Jill Berrick: statistical modeling on national child-welfare data to inform foster-care policy. Built Tableau dashboards & the site (4,000+ views).",
    desc_ko: "Jill Berrick 교수와의 연구: 위탁 양육 정책 개선을 위한 전국 아동 복지 데이터 통계 모델링. Tableau 대시보드 및 웹사이트 구축 (4,000+ 조회수).",
    meta: ["Statistics", "Tableau", "Policy"] },
  { id: "python",   group: "skill", label: "Python",     desc: "Primary language: Pandas, Polars, FastAPI, concurrent pipelines.", desc_ko: "주력 언어: Pandas, Polars, FastAPI, 동시성 파이프라인.", meta: ["Pandas","Polars","FastAPI"] },
  { id: "sql",      group: "skill", label: "SQL",        desc: "Advanced SQL, schema design, query-planner diagnostics, performance tuning.", desc_ko: "고급 SQL, 스키마 설계, 쿼리 플래너 진단, 성능 튜닝.", meta: ["Schema design","Tuning"] },
  { id: "postgres", group: "skill", label: "PostgreSQL", desc: "Research warehouse: 33M+ records, TOAST tuning, modular schemas.", desc_ko: "연구 웨어하우스: 3,300만+ 레코드, TOAST 튜닝, 모듈식 스키마.", meta: ["Warehouse","TOAST"] },
  { id: "neo4j",    group: "skill", label: "Neo4j",      desc: "Knowledge graphs of corporate relationships extracted from filings.", desc_ko: "공시에서 추출한 기업 관계 지식 그래프.", meta: ["Knowledge graph"] },
  { id: "spark",    group: "skill", label: "Spark",      desc: "Distributed processing on a Linux analytics cluster.", desc_ko: "리눅스 분석 클러스터에서의 분산 처리.", meta: ["Distributed"] },
  { id: "ml",       group: "skill", label: "ML / NLP",   desc: "Local LLM inference (Ollama), Graph Neural Networks, entity resolution, backtesting.", desc_ko: "로컬 LLM 추론 (Ollama), 그래프 신경망, 엔티티 해상도, 백테스팅.", meta: ["LLM","GNN"] },
  { id: "infra",    group: "skill", label: "Infra / DevOps", desc: "Linux, cron/systemd, SSH tunneling, Docker, multi-host orchestration.", desc_ko: "리눅스, cron/systemd, SSH 터널링, Docker, 멀티 호스트 오케스트레이션.", meta: ["Linux","Docker"] },
  { id: "swift",    group: "skill", label: "Swift / iOS", desc: "SwiftUI, MapKit, ActivityKit, AVFoundation native development.", desc_ko: "SwiftUI, MapKit, ActivityKit, AVFoundation 네이티브 개발.", meta: ["SwiftUI","MapKit"] },
  { id: "tableau",  group: "skill", label: "Tableau",    desc: "Interactive dashboards for research & decision support.", desc_ko: "리서치 및 의사결정 지원을 위한 인터랙티브 대시보드.", meta: ["Dashboards"] },
];

const LINKS = [
  ["me","gka"], ["me","berkeley"], ["me","alpha"], ["me","pathwise"], ["me","fnf"],
  ["gka","alpha"], ["berkeley","fnf"], ["berkeley","pathwise"],
  ["alpha","python"], ["alpha","postgres"], ["alpha","neo4j"], ["alpha","ml"], ["alpha","spark"], ["alpha","infra"],
  ["pathwise","swift"], ["pathwise","python"], ["pathwise","postgres"], ["pathwise","infra"],
  ["fnf","tableau"], ["fnf","sql"], ["fnf","ml"],
  ["me","python"], ["me","sql"],
];

/* ---------- 2. Degree + state ---------- */
const DEGREE = {};
NODES.forEach(n => { DEGREE[n.id] = 0; });
LINKS.forEach(([s, t]) => { DEGREE[s]++; DEGREE[t]++; });

function nodeSize(node) {
  const d = DEGREE[node.id] || 1;
  if (node.id === "me") return 22 + d * 1.2;
  return 8 + d * 2.2;
}

// Single persistent dataset — nodes keep their positions across filtering.
const graphData = {
  nodes: NODES.map(n => ({ ...n, val: nodeSize(n), degree: DEGREE[n.id] })),
  links: LINKS.map(([source, target]) => ({ source, target })),
};

const canvasEl = document.getElementById("graph-canvas");
let Graph = null;
let hoverNode = null;
let highlightNodes = new Set();
let highlightLinks = new Set();
let activeGroups = new Set(["person", "org", "project", "skill"]);
let userInteracting = false;
let idleTimer = null;
let motionRaf = null;
let driftAngle = 0;
let hoverCenter = null;   // transient: node under the cursor
let centeredNode = null;  // sticky: node selected via click
let camZoom = null;
let baseZoom = 1;

/* ---------- 3. Visibility-based filtering helpers ---------- */
function isNodeVisible(node) {
  return activeGroups.has(node.group);
}
function isLinkVisible(link) {
  const s = typeof link.source === "object" ? link.source : graphData.nodes.find(n => n.id === link.source);
  const t = typeof link.target === "object" ? link.target : graphData.nodes.find(n => n.id === link.target);
  return s && t && isNodeVisible(s) && isNodeVisible(t);
}

function neighbors(node) {
  const ns = new Set([node.id]);
  const ls = new Set();
  graphData.links.forEach(l => {
    const s = l.source.id || l.source;
    const t = l.target.id || l.target;
    if (s === node.id) { ns.add(t); ls.add(l); }
    if (t === node.id) { ns.add(s); ls.add(l); }
  });
  return { ns, ls };
}

function particleCount(link) {
  if (!isLinkVisible(link)) return 0;
  return highlightLinks.has(link) ? 5 : 1;
}
function linkColor(link) {
  if (!isLinkVisible(link)) return "rgba(0,0,0,0)";
  return highlightLinks.has(link) ? "rgba(94,234,212,0.75)" : "rgba(120,135,160,0.45)";
}
function linkWidth(link) {
  return highlightLinks.has(link) ? 2.5 : 1;
}

/* ---------- 4. Camera loop (idle drift + hover-to-center) ----------
   force-graph halts its own render loop after cooldown, which freezes any
   animated centerAt(). So we run our own rAF and pan with instant
   centerAt(...,0), easing toward a target each frame. */
function markInteraction() {
  userInteracting = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { userInteracting = false; }, 4000);
}
function startCameraLoop() {
  if (motionRaf) cancelAnimationFrame(motionRaf);
  function tick() {
    if (Graph) {
      const cur = Graph.centerAt();
      const focus = hoverCenter || centeredNode;
      let tx = cur.x, ty = cur.y;
      if (focus) {
        tx = focus.x;
        ty = focus.y;
      } else if (!userInteracting) {
        driftAngle += 0.0016;
        tx = Math.cos(driftAngle) * 14;
        ty = Math.sin(driftAngle) * 10;
      }
      const nx = cur.x + (tx - cur.x) * 0.12;
      const ny = cur.y + (ty - cur.y) * 0.12;
      if (Math.abs(nx - cur.x) > 0.01 || Math.abs(ny - cur.y) > 0.01) {
        Graph.centerAt(nx, ny, 0);
      }
      if (camZoom != null) {
        const cz = Graph.zoom();
        const nz = cz + (camZoom - cz) * 0.12;
        if (Math.abs(nz - cz) > 0.002) Graph.zoom(nz, 0);
        else { Graph.zoom(camZoom, 0); camZoom = null; }
      }
    }
    motionRaf = requestAnimationFrame(tick);
  }
  motionRaf = requestAnimationFrame(tick);
}

/* ---------- 5. Cluster forces ---------- */
function applyClusterForces(g) {
  const fx = g.d3Force("x");
  const fy = g.d3Force("y");
  if (fx) { fx.strength(0.06).x(n => (GROUP_ANCHORS[n.group] || { x: 0 }).x); }
  if (fy) { fy.strength(0.06).y(n => (GROUP_ANCHORS[n.group] || { y: 0 }).y); }
}

// The camera loop eases the view so the hovered node reaches the viewport
// center; every other node slides accordingly.
function centerOnNode(node) {
  hoverCenter = node;
}

// On unhover, the camera loop eases back to the selected node (if any) or
// the overall centered view.
function releaseCenteredNode() {
  hoverCenter = null;
}

/* ---------- 6. Node styling (built-in renderer — reliable across browsers) ---------- */
function nodeColor(node) {
  const dim = highlightNodes.size > 0 && !highlightNodes.has(node.id);
  const c = COLORS[node.group] || "#888";
  return dim ? c + "44" : c;
}

// Built-in node radius for the given value (nodeRelSize area model).
function nodeRadius(node) {
  return Math.sqrt(Math.max(node.val, 1)) * 4;
}

// Drawn in "after" mode: built-in renderer paints the circle, we add the label.
function drawLabel(node, ctx, scale) {
  const dim = highlightNodes.size > 0 && !highlightNodes.has(node.id);
  const r = nodeRadius(node);
  const fontSize = Math.max(11 / scale, 3.5);
  ctx.font = `${node.id === "me" ? 700 : 500} ${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = dim ? "rgba(230,237,243,0.25)" : "#e6edf3";
  ctx.fillText(node.label, node.x, node.y + r + 2 / scale);
}

/* ---------- 7. Init ---------- */
function initGraph() {
  Graph = ForceGraph()(canvasEl)
    .graphData(graphData)
    .backgroundColor("#0d141e")
    .nodeRelSize(4)
    .nodeVal("val")
    .nodeColor(nodeColor)
    .nodeLabel(() => "")
    .nodeCanvasObject(drawLabel)
    .nodeCanvasObjectMode(() => "after")
    .nodeVisibility(isNodeVisible)
    .linkVisibility(isLinkVisible)
    .warmupTicks(80)
    .cooldownTime(3000)
    .linkColor(linkColor)
    .linkWidth(linkWidth)
    .linkDirectionalParticles(particleCount)
    .linkDirectionalParticleWidth(l => highlightLinks.has(l) ? 2.5 : 1.2)
    .linkDirectionalParticleSpeed(l => highlightLinks.has(l) ? 0.008 : 0.003)
    .linkDirectionalParticleColor(l => highlightLinks.has(l) ? "#5eead4" : "rgba(94,234,212,0.35)")
    .onNodeDrag(markInteraction)
    .onNodeHover(node => {
      highlightNodes.clear();
      highlightLinks.clear();
      if (node) {
        const { ns, ls } = neighbors(node);
        highlightNodes = ns;
        highlightLinks = ls;
        canvasEl.style.cursor = "pointer";
        hoverNode = node;
        centerOnNode(node);
      } else {
        canvasEl.style.cursor = "grab";
        hoverNode = null;
        releaseCenteredNode();
      }
      Graph.nodeColor(nodeColor);
      Graph.linkDirectionalParticles(particleCount);
    })
    .onNodeClick(node => {
      showPanel(node);
      centeredNode = node;
      camZoom = Math.max(baseZoom * 1.6, 2.2);
    })
    .onBackgroundClick(() => {
      resetPanel();
      centeredNode = null;
      camZoom = baseZoom;
      userInteracting = false;
    });

  Graph.d3Force("charge").strength(-280);
  Graph.d3Force("link").distance(l => {
    const sg = l.source.group || "";
    const tg = l.target.group || "";
    return (sg === "skill" || tg === "skill") ? 50 : 85;
  });
  applyClusterForces(Graph);

  sizeGraph();
  // Re-fit several times to survive late layout/font shifts that can leave
  // the canvas mis-sized (and nodes off-screen) on first paint.
  [150, 500, 1000, 1800].forEach(t =>
    setTimeout(() => { sizeGraph(); if (Graph) Graph.zoomToFit(500, 70); }, t)
  );
  setTimeout(() => { if (Graph) baseZoom = Graph.zoom(); }, 2000);
  setTimeout(startCameraLoop, 2200);
  if (/[?&]debug=1/.test(location.search)) {
    window.__G = Graph;
    window.__centerOnNode = centerOnNode;
    window.__releaseCenteredNode = releaseCenteredNode;
  }
  updateDebug();
}

function sizeGraph() {
  if (!Graph) return;
  const w = canvasEl.clientWidth || canvasEl.offsetWidth || 800;
  const h = canvasEl.clientHeight || canvasEl.offsetHeight || 600;
  Graph.width(w).height(h);
  updateDebug();
}
window.addEventListener("resize", sizeGraph);
if (typeof ResizeObserver !== "undefined") {
  new ResizeObserver(() => sizeGraph()).observe(canvasEl);
}
canvasEl.addEventListener("mousedown", markInteraction);
canvasEl.addEventListener("wheel", markInteraction, { passive: true });

/* ---------- 7b. Visible diagnostic (add ?debug=1 to URL) ---------- */
function updateDebug() {
  if (!/[?&]debug=1/.test(location.search)) return;
  let box = document.getElementById("graph-debug");
  if (!box) {
    box = document.createElement("div");
    box.id = "graph-debug";
    box.style.cssText =
      "position:absolute;top:8px;left:8px;z-index:50;font:11px/1.5 monospace;" +
      "background:rgba(0,0,0,0.8);color:#5eead4;padding:8px 10px;border-radius:8px;" +
      "max-width:90%;white-space:pre;pointer-events:none;border:1px solid #5eead4";
    canvasEl.style.position = "relative";
    canvasEl.appendChild(box);
  }
  let n0 = null;
  try { const d = Graph && Graph.graphData(); n0 = d && d.nodes[0]; } catch (e) {}
  box.textContent = [
    "ForceGraph: " + (typeof window.ForceGraph),
    "canvas client: " + canvasEl.clientWidth + " x " + canvasEl.clientHeight,
    "DPR: " + window.devicePixelRatio,
    "nodes: " + (Graph ? Graph.graphData().nodes.length : "n/a"),
    "node0: " + (n0 ? (n0.id + " (" + Math.round(n0.x) + "," + Math.round(n0.y) + ")") : "n/a"),
    "zoom: " + (Graph && Graph.zoom ? Graph.zoom().toFixed(2) : "n/a"),
  ].join("\n");
}

/* ---------- 8. Legend filters (visibility-based) ---------- */
function refreshVisibility() {
  if (!Graph) return;
  // Re-assigning the accessors forces force-graph to re-evaluate visibility.
  Graph.nodeVisibility(isNodeVisible);
  Graph.linkVisibility(isLinkVisible);
  Graph.linkDirectionalParticles(particleCount);
}

document.querySelectorAll(".legend-item").forEach(item => {
  const toggle = () => {
    const group = item.dataset.group;
    if (activeGroups.has(group)) {
      if (activeGroups.size === 1) return; // keep at least one
      activeGroups.delete(group);
      item.classList.remove("active");
    } else {
      activeGroups.add(group);
      item.classList.add("active");
    }
    markInteraction();
    refreshVisibility();
  };
  item.addEventListener("click", toggle);
  item.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});

/* ---------- 9. Detail panel ---------- */
const panelDefault = document.querySelector(".panel-default");
const panelDetail = document.querySelector(".panel-detail");
const GROUP_LABELS = {
  person:  { en: "ME",           ko: "나" },
  org:     { en: "ORGANIZATION", ko: "소속" },
  project: { en: "PROJECT",      ko: "프로젝트" },
  skill:   { en: "SKILL / TECH", ko: "기술" },
};

function showPanel(node) {
  panelDefault.hidden = true;
  panelDetail.hidden = false;
  const tag = document.getElementById("panel-tag");
  tag.textContent = GROUP_LABELS[node.group][currentLang] || node.group;
  tag.style.color = COLORS[node.group];
  tag.style.background = COLORS[node.group] + "1a";
  document.getElementById("panel-title").textContent = node.label;
  document.getElementById("panel-desc").textContent =
    currentLang === "ko" && node.desc_ko ? node.desc_ko : node.desc;
  const meta = [...(node.meta || []), `${DEGREE[node.id]} connections`];
  document.getElementById("panel-meta").innerHTML =
    meta.map(m => `<span>${m}</span>`).join("");
  document.getElementById("panel-links").innerHTML =
    node.link ? `<a href="${node.link}" target="_blank" rel="noopener">↗ ${node.link.replace("https://","")}</a>` : "";
}
function resetPanel() {
  panelDetail.hidden = true;
  panelDefault.hidden = false;
}

document.getElementById("graph-reset").addEventListener("click", () => {
  resetPanel();
  highlightNodes.clear();
  highlightLinks.clear();
  centeredNode = null;
  camZoom = baseZoom;
  userInteracting = false;
  if (Graph) Graph.nodeColor(nodeColor);
});

/* ---------- 10. i18n ---------- */
const I18N = {
  nav_graph: ["Graph", "그래프"],
  nav_experience: ["Experience", "경력"],
  nav_projects: ["Projects", "프로젝트"],
  nav_about: ["About", "소개"],
  nav_contact: ["Contact", "연락처"],
  hero_eyebrow: ["data engineer · uc berkeley data science", "데이터 엔지니어 · uc 버클리 데이터 사이언스"],
  hero_tagline: [
    "I build and scale production data pipelines, multi-terabyte data lakes and warehouses, and ML/NLP systems — from SEC filing graphs to real-time routing engines.",
    "프로덕션 데이터 파이프라인, 멀티 테라바이트 데이터 레이크·웨어하우스, ML/NLP 시스템을 구축하고 확장합니다 — SEC 공시 그래프부터 실시간 라우팅 엔진까지."
  ],
  stat_filings: ["filings ingested", "공시 수집"],
  stat_records: ["records managed", "레코드 관리"],
  stat_entities: ["entities tracked", "기업 추적"],
  hero_explore: ["Explore my work ↓", "내 작업 보기 ↓"],
  hero_contact: ["Get in touch", "연락하기"],
  graph_title: ["Knowledge Graph", "지식 그래프"],
  graph_sub: [
    "My career as a graph — the way I build my systems. Drag nodes, hover to trace connections, and click the legend to filter by type.",
    "그래프로 표현한 제 커리어 — 제가 시스템을 만드는 방식 그대로. 노드를 드래그하고, 호버해 연결을 추적하고, 범례를 클릭해 유형별로 필터링하세요."
  ],
  panel_hint: ["◍ Click a node to inspect", "◍ 노드를 클릭해 살펴보세요"],
  legend_filter: ["Filter by type — click to toggle", "유형별 필터 — 클릭하여 전환"],
  legend_me: ["Me", "나"],
  legend_org: ["Organizations", "소속"],
  legend_project: ["Projects", "프로젝트"],
  legend_skill: ["Skills & Tech", "기술"],
  graph_reset: ["⟳ Reset view", "⟳ 보기 초기화"],
  graph_tip: ["Tip: scroll to zoom · drag to pan · click legend to filter", "팁: 스크롤 확대/축소 · 드래그 이동 · 범례 클릭 필터"],
  exp_title: ["Experience", "경력"],
  exp_role: ["Financial Data Analyst", "재무 데이터 분석가"],
  exp_b1: [
    "Saved the firm from deploying a losing trading strategy by exposing lookahead bias in a legacy sentiment model through rigorous out-of-sample backtesting.",
    "엄격한 표본 외 백테스팅으로 기존 감성 모델의 룩어헤드 편향을 밝혀내, 손실을 낼 트레이딩 전략의 배포를 막았습니다."
  ],
  exp_b2: [
    "Replaced a fragile CSV-based SEC scraper with a resilient threaded PostgreSQL pipeline spanning 28,000+ entities, with no data loss on restarts.",
    "취약한 CSV 기반 SEC 스크래퍼를 28,000개 이상의 기업을 아우르는 견고한 멀티스레드 PostgreSQL 파이프라인으로 교체해, 재시작 시 데이터 손실을 없앴습니다."
  ],
  exp_b3: [
    "Designed a modular PostgreSQL warehouse schema and tuned storage so analysts run complex cross-filing queries without bottlenecks.",
    "모듈식 PostgreSQL 웨어하우스 스키마를 설계하고 스토리지를 튜닝해, 분석가들이 병목 없이 복잡한 교차 공시 쿼리를 실행하도록 했습니다."
  ],
  exp_b4: [
    "Engineered an unattended NLP pipeline converting raw filing text into a Neo4j corporate-relationship knowledge graph.",
    "원시 공시 텍스트를 Neo4j 기업 관계 지식 그래프로 변환하는 무인 NLP 파이프라인을 구축했습니다."
  ],
  proj_title: ["Data Architecture Projects", "데이터 아키텍처 프로젝트"],
  proj_sub: ["The pipelines, not just the products. Each project shown as the system it really is.", "결과물뿐 아니라 파이프라인까지. 각 프로젝트를 실제 시스템 그대로 보여줍니다."],
  proj_alpha: [
    "A quantitative research pipeline testing whether corporate events in SEC filings predict stock returns — evolving from text sentiment to a Graph Neural Network over a Neo4j knowledge graph, with a fully autonomous daily orchestration loop.",
    "SEC 공시의 기업 이벤트가 주가 수익률을 예측하는지 검증하는 퀀트 리서치 파이프라인 — 텍스트 감성 분석에서 Neo4j 지식 그래프 기반 그래프 신경망까지, 완전 자동화된 일일 오케스트레이션."
  ],
  proj_pathwise: [
    "An intelligent iOS running app that generates elevation-controlled, geofenced routing loops with native turn-by-turn navigation — sub-2-second route generation via parallelized spatial queries and a resilient, database-agnostic fallback.",
    "고도 제어 및 지오펜스 러닝 루트를 생성하는 지능형 iOS 러닝 앱 — 병렬 공간 쿼리로 2초 미만 경로 생성, 데이터베이스 비종속 폴백으로 높은 가용성."
  ],
  about_title: ["About", "소개"],
  about_edu: ["Education", "학력"],
  about_degree: ["B.A. Data Science · May 2026", "데이터 사이언스 학사 · 2026년 5월"],
  about_edu_detail: ["GPA 3.81 · Completed in 3 years · Berkeley Changemaker & Entrepreneurship & Technology (SCET) Certificates", "GPA 3.81 · 3년 만에 졸업 · Berkeley Changemaker 및 기업가정신·기술(SCET) 수료증"],
  about_lang: ["Bilingual", "이중 언어"],
  lang_fluent: ["Fluent", "유창함"],
  lang_native: ["Native", "원어민"],
  about_lang_detail: ["2 years lived in Korea during military service (2022–2024). Comfortable working and presenting in both languages.", "군 복무로 한국에서 2년 거주 (2022–2024). 두 언어 모두로 업무와 발표가 가능합니다."],
  contact_title: ["Get in touch", "연락처"],
  contact_sub: ["Open to data engineering & analytics roles. Let's talk.", "데이터 엔지니어링 및 분석 직무에 열려 있습니다. 편하게 연락 주세요."],
  footer_built: ["Built with vanilla JS + force-graph · hosted on Cloudflare Pages", "바닐라 JS + force-graph로 제작 · Cloudflare Pages 호스팅"],
};

let currentLang = "en";
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "ko" ? "ko" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[key]) el.textContent = I18N[key][lang === "ko" ? 1 : 0];
  });
  document.querySelector(".lang-en").classList.toggle("active", lang === "en");
  document.querySelector(".lang-ko").classList.toggle("active", lang === "ko");
  if (!panelDetail.hidden && hoverNode) showPanel(hoverNode);
}
document.getElementById("lang-toggle").addEventListener("click", () => {
  applyLang(currentLang === "en" ? "ko" : "en");
});

/* ---------- 11. Animated stat counters ---------- */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const fmt = n => {
      if (target >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
      if (target >= 1000) return Math.round(n / 1000) + "K";
      return Math.round(n).toString();
    };
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ---------- 12. Boot ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

function showGraphFallback() {
  canvasEl.innerHTML =
    '<div class="graph-fallback">' +
    "<p>The interactive graph couldn't load in this browser.</p>" +
    "<p>Try a hard refresh (Cmd/Ctrl + Shift + R) or a different browser.</p>" +
    "</div>";
}

window.addEventListener("load", () => {
  if (window.ForceGraph) {
    try {
      initGraph();
    } catch (err) {
      console.error("Graph init failed:", err);
      showGraphFallback();
    }
  } else {
    console.error("force-graph library failed to load.");
    showGraphFallback();
  }
  animateCounters();
});
