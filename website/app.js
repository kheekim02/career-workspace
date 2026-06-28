/* ============================================================
   Kunhee (Geoffrey) Kim — portfolio
   Enhanced knowledge graph: filters, clustering, particles, 2D/3D
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

/* ---------- 2. Degree + graph state ---------- */
const DEGREE = {};
NODES.forEach(n => { DEGREE[n.id] = 0; });
LINKS.forEach(([s, t]) => { DEGREE[s]++; DEGREE[t]++; });

function nodeSize(node) {
  const d = DEGREE[node.id] || 1;
  if (node.id === "me") return 22 + d * 1.2;
  return 8 + d * 2.2;
}

const canvasEl = document.getElementById("graph-canvas");
const modeBtn = document.getElementById("graph-mode");
let Graph = null;
let is3D = false;
let hoverNode = null;
let highlightNodes = new Set();
let highlightLinks = new Set();
let activeGroups = new Set(["person", "org", "project", "skill"]);
let userInteracting = false;
let idleTimer = null;
let motionRaf = null;
let cameraAngle = 0;
let introDone = false;

function nodeVisible(node) {
  return activeGroups.has(node.group);
}

function linkVisible(link) {
  const s = link.source.id || link.source;
  const t = link.target.id || link.target;
  const sn = NODES.find(n => n.id === s);
  const tn = NODES.find(n => n.id === t);
  return sn && tn && nodeVisible(sn) && nodeVisible(tn);
}

function buildGraphData() {
  const nodes = NODES.filter(nodeVisible).map(n => ({
    ...n,
    val: nodeSize(n),
    degree: DEGREE[n.id],
  }));
  const ids = new Set(nodes.map(n => n.id));
  const links = LINKS
    .filter(([s, t]) => ids.has(s) && ids.has(t))
    .map(([source, target]) => ({ source, target }));
  return { nodes, links };
}

function neighbors(node) {
  const data = Graph ? Graph.graphData() : buildGraphData();
  const ns = new Set([node.id]);
  const ls = new Set();
  data.links.forEach(l => {
    const s = l.source.id || l.source;
    const t = l.target.id || l.target;
    if (s === node.id) { ns.add(t); ls.add(l); }
    if (t === node.id) { ns.add(s); ls.add(l); }
  });
  return { ns, ls };
}

function particleCount(link) {
  if (!linkVisible(link)) return 0;
  if (highlightLinks.has(link)) return 5;
  return 1;
}

function linkColor(link) {
  if (!linkVisible(link)) return "rgba(0,0,0,0)";
  if (highlightLinks.has(link)) return "rgba(94,234,212,0.65)";
  return "rgba(120,135,160,0.22)";
}

function linkWidth(link) {
  if (!linkVisible(link)) return 0;
  return highlightLinks.has(link) ? 2.5 : 1;
}

function nodeColor(node, dim) {
  const c = COLORS[node.group] || "#888";
  if (dim) return c + "44";
  return c;
}

function markInteraction() {
  userInteracting = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { userInteracting = false; }, 4000);
}

function stopMotion() {
  if (motionRaf) cancelAnimationFrame(motionRaf);
  motionRaf = null;
}

function startIdleMotion() {
  stopMotion();
  function tick() {
    if (!Graph || userInteracting) {
      motionRaf = requestAnimationFrame(tick);
      return;
    }
    if (is3D) {
      cameraAngle += 0.0035;
      const dist = 320;
      Graph.cameraPosition(
        { x: dist * Math.sin(cameraAngle), y: 40, z: dist * Math.cos(cameraAngle) },
        { x: 0, y: 0, z: 0 },
        0
      );
    } else {
      cameraAngle += 0.0018;
      Graph.centerAt(Math.cos(cameraAngle) * 18, Math.sin(cameraAngle) * 12, 0);
    }
    motionRaf = requestAnimationFrame(tick);
  }
  motionRaf = requestAnimationFrame(tick);
}

function applyClusterForces(g) {
  const data = g.graphData();
  const forceX = g.d3Force("x");
  const forceY = g.d3Force("y");
  if (!forceX || !forceY) return;

  forceX.strength(n => (GROUP_ANCHORS[n.group] ? 0.06 : 0));
  forceX.x(n => (GROUP_ANCHORS[n.group] || { x: 0 }).x);

  forceY.strength(n => (GROUP_ANCHORS[n.group] ? 0.06 : 0));
  forceY.y(n => (GROUP_ANCHORS[n.group] || { y: 0 }).y);
  g.d3ReheatSimulation();
}

function runIntroAnimation(g) {
  const data = g.graphData();
  data.nodes.forEach(n => {
    n.x = (Math.random() - 0.5) * 8;
    n.y = (Math.random() - 0.5) * 8;
    if (is3D) n.z = (Math.random() - 0.5) * 8;
  });
  g.graphData(data);
  g.d3ReheatSimulation();

  setTimeout(() => {
    if (is3D) {
      g.cameraPosition({ x: 0, y: 0, z: 380 }, { x: 0, y: 0, z: 0 }, 1200);
    } else {
      g.zoomToFit(1200, 70);
    }
    introDone = true;
    startIdleMotion();
  }, 1400);
}

function drawNode2D(node, ctx, scale) {
  const r = Math.sqrt(node.val) * 1.55;
  const dim = highlightNodes.size > 0 && !highlightNodes.has(node.id);
  const color = COLORS[node.group] || "#888";
  const t = Date.now() / 1000;

  if (highlightNodes.has(node.id)) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 7, 0, 2 * Math.PI);
    ctx.fillStyle = color + "28";
    ctx.fill();
  }

  if (node.id === "me") {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 6 + pulse * 5, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(244,197,66,${0.15 + pulse * 0.2})`;
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
  }

  const grad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
  grad.addColorStop(0, dim ? color + "55" : color);
  grad.addColorStop(1, dim ? color + "22" : color + "cc");
  ctx.beginPath();
  ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  if (node.id === "me") {
    ctx.lineWidth = 2 / scale;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }

  const abbrev = node.group === "skill" ? node.label.slice(0, 2).toUpperCase() : "";
  if (abbrev && r > 8) {
    ctx.font = `600 ${Math.max(8 / scale, 2.5)}px Inter, sans-serif`;
    ctx.fillStyle = dim ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.45)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(abbrev, node.x, node.y);
  }

  const fontSize = Math.max(10 / scale, 3);
  ctx.font = `${node.id === "me" ? 700 : 500} ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = dim ? "rgba(230,237,243,0.22)" : "#e6edf3";
  ctx.fillText(node.label, node.x, node.y + r + 3);
}

function bindSharedHandlers(g) {
  g.onNodeHover(node => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      const { ns, ls } = neighbors(node);
      highlightNodes = ns;
      highlightLinks = ls;
      canvasEl.style.cursor = "pointer";
      hoverNode = node;
    } else {
      canvasEl.style.cursor = is3D ? "move" : "grab";
      hoverNode = null;
    }
    g.linkDirectionalParticles(particleCount);
  });

  g.onNodeClick(node => {
    markInteraction();
    showPanel(node);
    if (is3D) {
      const dist = 140;
      g.cameraPosition(
        { x: node.x + dist * 0.4, y: node.y + dist * 0.3, z: node.z + dist },
        node,
        800
      );
    } else {
      g.centerAt(node.x, node.y, 600);
      g.zoom(2.3, 600);
    }
  });

  g.onBackgroundClick(() => {
    markInteraction();
    resetPanel();
  });
}

function initGraph2D() {
  is3D = false;
  canvasEl.classList.remove("mode-3d");
  canvasEl.innerHTML = "";
  introDone = false;

  const data = buildGraphData();
  Graph = ForceGraph()(canvasEl)
    .graphData(data)
    .backgroundColor("rgba(0,0,0,0)")
    .nodeRelSize(4)
    .nodeVal("val")
    .warmupTicks(80)
    .cooldownTime(3000)
    .linkColor(linkColor)
    .linkWidth(linkWidth)
    .linkDirectionalParticles(particleCount)
    .linkDirectionalParticleWidth(l => highlightLinks.has(l) ? 2.5 : 1.2)
    .linkDirectionalParticleSpeed(l => highlightLinks.has(l) ? 0.008 : 0.003)
    .linkDirectionalParticleColor(l => highlightLinks.has(l) ? "#5eead4" : "rgba(94,234,212,0.35)")
    .nodeCanvasObject((node, ctx, scale) => drawNode2D(node, ctx, scale))
    .nodeCanvasObjectMode(() => "replace")
    .nodePointerAreaPaint((node, color, ctx) => {
      const r = Math.sqrt(node.val) * 1.55 + 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fill();
    })
    .onZoom(() => markInteraction())
    .onNodeDrag(() => markInteraction());

  bindSharedHandlers(Graph);
  Graph.d3Force("charge").strength(-280);
  Graph.d3Force("link").distance(l => {
    const sg = l.source.group || "";
    const tg = l.target.group || "";
    return (sg === "skill" || tg === "skill") ? 50 : 85;
  });
  applyClusterForces(Graph);
  sizeGraph();
  runIntroAnimation(Graph);
  updateModeButton();
}

function initGraph3D() {
  if (!window.ForceGraph3D) {
    alert("3D library still loading — try again in a moment.");
    return;
  }
  is3D = true;
  canvasEl.classList.add("mode-3d");
  canvasEl.innerHTML = "";
  introDone = false;

  const data = buildGraphData();
  Graph = ForceGraph3D()(canvasEl)
    .graphData(data)
    .backgroundColor("rgba(0,0,0,0)")
    .showNavInfo(false)
    .nodeVal("val")
    .nodeLabel(n => `<span style="color:${COLORS[n.group]}">${n.label}</span>`)
    .nodeColor(n => {
      const dim = highlightNodes.size > 0 && !highlightNodes.has(n.id);
      return nodeColor(n, dim);
    })
    .nodeOpacity(0.95)
    .nodeResolution(16)
    .linkColor(linkColor)
    .linkWidth(linkWidth)
    .linkOpacity(0.55)
    .linkDirectionalParticles(particleCount)
    .linkDirectionalParticleWidth(l => highlightLinks.has(l) ? 2.5 : 1)
    .linkDirectionalParticleSpeed(l => highlightLinks.has(l) ? 0.01 : 0.004)
    .linkDirectionalParticleColor(l => highlightLinks.has(l) ? "#5eead4" : "rgba(94,234,212,0.4)")
    .warmupTicks(100)
    .cooldownTime(3500)
    .onNodeDrag(() => markInteraction());

  bindSharedHandlers(Graph);
  Graph.d3Force("charge").strength(-180);
  Graph.d3Force("link").distance(70);
  applyClusterForces(Graph);
  sizeGraph();
  runIntroAnimation(Graph);
  updateModeButton();
}

function destroyGraph() {
  stopMotion();
  if (Graph && Graph._destructor) Graph._destructor();
  Graph = null;
  canvasEl.innerHTML = "";
}

function switchGraphMode() {
  markInteraction();
  resetPanel();
  highlightNodes.clear();
  highlightLinks.clear();
  if (is3D) {
    destroyGraph();
    initGraph2D();
  } else {
    destroyGraph();
    initGraph3D();
  }
}

function refreshGraphData() {
  if (!Graph) return;
  const data = buildGraphData();
  Graph.graphData(data);
  applyClusterForces(Graph);
  highlightNodes.clear();
  highlightLinks.clear();
  Graph.linkDirectionalParticles(particleCount);
}

function updateModeButton() {
  const key = is3D ? "graph_3d" : "graph_2d";
  modeBtn.textContent = I18N[key][currentLang === "ko" ? 1 : 0];
  modeBtn.dataset.mode = is3D ? "3d" : "2d";
}

function sizeGraph() {
  if (!Graph) return;
  Graph.width(canvasEl.clientWidth).height(canvasEl.clientHeight);
}
window.addEventListener("resize", sizeGraph);

canvasEl.addEventListener("mousedown", markInteraction);
canvasEl.addEventListener("wheel", markInteraction, { passive: true });

/* ---------- 3. Legend filters ---------- */
document.querySelectorAll(".legend-item").forEach(item => {
  const toggle = () => {
    const group = item.dataset.group;
    if (activeGroups.has(group)) {
      if (activeGroups.size === 1) return;
      activeGroups.delete(group);
      item.classList.remove("active");
    } else {
      activeGroups.add(group);
      item.classList.add("active");
    }
    markInteraction();
    refreshGraphData();
  };
  item.addEventListener("click", toggle);
  item.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});

/* ---------- 4. Detail panel ---------- */
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
  markInteraction();
  resetPanel();
  highlightNodes.clear();
  highlightLinks.clear();
  if (is3D) {
    Graph.cameraPosition({ x: 0, y: 0, z: 380 }, { x: 0, y: 0, z: 0 }, 800);
  } else {
    Graph.zoomToFit(600, 70);
  }
});

modeBtn.addEventListener("click", switchGraphMode);

/* ---------- 5. i18n ---------- */
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
    "My career as a graph — the way I build my systems. Drag nodes, hover to trace connections, click to filter by type, and toggle 3D for the full view.",
    "그래프로 표현한 제 커리어 — 제가 시스템을 만드는 방식 그대로. 노드를 드래그하고, 호버해 연결을 추적하고, 범례로 유형을 필터링하고, 3D로 전환해 전체를 보세요."
  ],
  panel_hint: ["◍ Click a node to inspect", "◍ 노드를 클릭해 살펴보세요"],
  legend_filter: ["Filter by type — click to toggle", "유형별 필터 — 클릭하여 전환"],
  legend_me: ["Me", "나"],
  legend_org: ["Organizations", "소속"],
  legend_project: ["Projects", "프로젝트"],
  legend_skill: ["Skills & Tech", "기술"],
  graph_reset: ["⟳ Reset view", "⟳ 보기 초기화"],
  graph_2d: ["Switch to 3D", "3D로 전환"],
  graph_3d: ["Switch to 2D", "2D로 전환"],
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
  updateModeButton();
  if (!panelDetail.hidden && hoverNode) showPanel(hoverNode);
}
document.getElementById("lang-toggle").addEventListener("click", () => {
  applyLang(currentLang === "en" ? "ko" : "en");
});

/* ---------- 6. Animated stat counters ---------- */
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

/* ---------- 7. Boot ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
window.addEventListener("load", () => {
  if (window.ForceGraph) initGraph2D();
  animateCounters();
});
