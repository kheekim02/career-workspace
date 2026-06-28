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

const LINK_DEFS = [
  ["me","gka","works at"], ["me","berkeley","studied at"],
  ["me","alpha","built"], ["me","pathwise","built"], ["me","fnf","researched"],
  ["gka","alpha","powers"], ["berkeley","fnf","hosts"], ["berkeley","pathwise","incubated"],
  ["alpha","python","uses"], ["alpha","postgres","uses"], ["alpha","neo4j","uses"],
  ["alpha","ml","uses"], ["alpha","spark","uses"], ["alpha","infra","uses"],
  ["pathwise","swift","uses"], ["pathwise","python","uses"], ["pathwise","postgres","uses"], ["pathwise","infra","uses"],
  ["fnf","tableau","uses"], ["fnf","sql","uses"], ["fnf","ml","uses"],
  ["me","python","skills"], ["me","sql","skills"],
];

/* Per-node glyph drawn inside the sphere (Rec 2) */
const NODE_GLYPHS = {
  me: "◎", gka: "⌂", berkeley: "▣",
  alpha: "◈", pathwise: "◉", fnf: "◆",
  python: "Py", sql: "SQL", postgres: "PG", neo4j: "N4",
  spark: "Sp", ml: "ML", infra: "Dev", swift: "Sw", tableau: "Tb",
};
const GROUP_GLYPHS = { person: "◎", org: "◇", project: "◈", skill: "◆" };

/* ---------- 2. Degree + state ---------- */
const DEGREE = {};
NODES.forEach(n => { DEGREE[n.id] = 0; });
LINK_DEFS.forEach(([s, t]) => { DEGREE[s]++; DEGREE[t]++; });

function nodeSize(node) {
  const d = DEGREE[node.id] || 1;
  if (node.id === "me") return 22 + d * 1.2;
  return 8 + d * 2.2;
}

// Single persistent dataset — nodes keep their positions across filtering.
const graphData = {
  nodes: NODES.map(n => ({ ...n, val: nodeSize(n), degree: DEGREE[n.id] })),
  links: LINK_DEFS.map(([source, target, rel]) => ({ source, target, rel })),
};

const canvasEl = document.getElementById("graph-canvas");
const viewportEl = document.getElementById("graph-viewport");
const bgCanvas = document.getElementById("graph-bg");
let Graph = null;
let hoverNode = null;
let highlightNodes = new Set();
let highlightLinks = new Set();
let activeGroups = new Set(["person", "org", "project", "skill"]);
let baseZoom = 1;
let focusNode = null;

/* ---- Shared render state (Phases 0–7) ---- */
let effectsTime = 0;
let effectsRaf = null;
let useFullRenderer = !/[?&]renderer=safe/.test(location.search);
let bgParticles = [];
const BG_PARTICLE_COUNT = 28;

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

/* ---- Color helpers ---- */
function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function lightenHex(hex, amt) {
  const [r, g, b] = hexRgb(hex);
  return `rgb(${Math.min(255, r + amt)},${Math.min(255, g + amt)},${Math.min(255, b + amt)})`;
}
function darkenHex(hex, amt) {
  const [r, g, b] = hexRgb(hex);
  return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`;
}

/* ---- Central visual state (Rec 5 + shared by all draw passes) ---- */
function getNodeVisualState(node) {
  const inSubgraph = highlightNodes.size === 0 || highlightNodes.has(node.id);
  const cinematic = highlightNodes.size > 0 || focusNode != null;
  const dim = highlightNodes.size > 0 && !highlightNodes.has(node.id);
  const opacity = dim ? (cinematic ? 0.10 : 0.28) : 1;
  const scale = dim && cinematic ? 0.82 : 1;
  const isFocusCenter = focusNode && focusNode.id === node.id;
  const isHub = node.id === "me";
  const pulse = isHub || isFocusCenter;
  const glowIntensity = 0.10 + Math.min((DEGREE[node.id] || 1) * 0.035, 0.22);
  const zoom = Graph && Graph.zoom ? Graph.zoom() : 1;
  const showLabel = isHub || inSubgraph || zoom > 1.85;
  return {
    opacity, scale, pulse, glowIntensity, showLabel,
    color: COLORS[node.group] || "#888",
    ringBoost: isFocusCenter || isHub,
  };
}

function setFocusVignette(on) {
  if (viewportEl) viewportEl.classList.toggle("is-focused", !!on);
}

/* ---- Rec 7: ambient background particles ---- */
function initBgParticles(w, h) {
  bgParticles = Array.from({ length: BG_PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.4 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    a: 0.08 + Math.random() * 0.18,
  }));
}

function drawBgParticles() {
  if (!bgCanvas) return;
  const w = bgCanvas.clientWidth || canvasEl.clientWidth;
  const h = bgCanvas.clientHeight || canvasEl.clientHeight;
  if (w < 2 || h < 2) return;
  const dpr = window.devicePixelRatio || 1;
  if (bgCanvas.width !== Math.round(w * dpr)) {
    bgCanvas.width = Math.round(w * dpr);
    bgCanvas.height = Math.round(h * dpr);
    if (bgParticles.length === 0) initBgParticles(w, h);
  }
  const ctx = bgCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  bgParticles.forEach(p => {
    p.x = (p.x + p.vx + w) % w;
    p.y = (p.y + p.vy + h) % h;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(94,234,212,${p.a})`;
    ctx.fill();
  });
}

function startEffectsLoop() {
  if (effectsRaf) return;
  function tick(now) {
    effectsTime = now / 1000;
    drawBgParticles();
    effectsRaf = requestAnimationFrame(tick);
  }
  effectsRaf = requestAnimationFrame(tick);
}

/* ---- Node radius (shared) ---- */
function nodeRadius(node) {
  return Math.sqrt(Math.max(node.val, 1)) * 4;
}

/* ---- Rec 6: label pill ---- */
function drawLabelPill(node, ctx, scale, r, vs) {
  const fontSize = Math.max(10 / scale, 3.5);
  const fontWeight = node.id === "me" ? 700 : 500;
  ctx.font = `${fontWeight} ${fontSize}px Inter, Arial, sans-serif`;
  const text = node.label;
  const tw = ctx.measureText(text).width;
  const padX = 5 / scale;
  const padY = 2 / scale;
  const pillW = tw + padX * 2;
  const pillH = fontSize + padY * 2;
  const px = node.x - pillW / 2;
  const py = node.y + r + 4 / scale;
  const [cr, cg, cb] = hexRgb(vs.color);
  ctx.fillStyle = `rgba(10,14,20,${0.78 * vs.opacity})`;
  roundRect(ctx, px, py, pillW, pillH, 4 / scale);
  ctx.fill();
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.45 * vs.opacity})`;
  ctx.lineWidth = 0.8 / scale;
  ctx.stroke();
  ctx.fillStyle = `rgba(230,237,243,${0.92 * vs.opacity})`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, node.x, py + pillH / 2);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const LINK_CURVE = 0.14;

/* ---- Node color: drawn by force-graph's RELIABLE built-in renderer ----
   The built-in circle is the guaranteed-visible base. All gloss/glow/glyph
   decoration is layered on top in "after" mode (also reliable on this GPU).
   We previously used a full custom "replace" renderer, which silently fails
   to paint on some Chrome/GPU setups → black screen. */
function nodeColor(node) {
  const vs = getNodeVisualState(node);
  const [r, g, b] = hexRgb(vs.color);
  return `rgba(${r},${g},${b},${vs.opacity})`;
}

/* ---- Rec 1+2+3+5+6: decoration drawn in "after" mode over the base circle ---- */
function drawNodeDecor(node, ctx, scale) {
  if (!useFullRenderer) {            // safe mode: just the label
    const vsl = getNodeVisualState(node);
    if (vsl.showLabel) drawLabelPill(node, ctx, scale, nodeRadius(node), vsl);
    return;
  }
  const vs = getNodeVisualState(node);
  const pulseMul = vs.pulse ? 1 + Math.sin(effectsTime * 2.1) * 0.06 : 1;
  const R = nodeRadius(node) * pulseMul;
  const { x, y } = node;
  const [cr, cg, cb] = hexRgb(vs.color);

  ctx.save();

  // Rec 1 — outer glow halo, tucked BEHIND existing pixels (incl. base circle)
  ctx.globalCompositeOperation = "destination-over";
  ctx.globalAlpha = vs.opacity;
  ctx.beginPath();
  ctx.arc(x, y, R * 1.9, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${cr},${cg},${cb},${vs.glowIntensity})`;
  ctx.fill();

  // Back to normal compositing for everything drawn on top of the base circle
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = vs.opacity;

  // Rec 1 — glossy sphere overlay (covers the flat built-in circle exactly)
  const grad = ctx.createRadialGradient(
    x - R * 0.32, y - R * 0.32, R * 0.08,
    x, y, R
  );
  grad.addColorStop(0, lightenHex(vs.color, 60));
  grad.addColorStop(0.55, vs.color);
  grad.addColorStop(1, darkenHex(vs.color, 38));
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Specular highlight
  ctx.beginPath();
  ctx.arc(x - R * 0.28, y - R * 0.32, R * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.24)";
  ctx.fill();

  // Rec 3 — degree ring
  const ringW = (1.2 + (DEGREE[node.id] || 1) * 0.3) / scale;
  ctx.beginPath();
  ctx.arc(x, y, R + 3 / scale, 0, Math.PI * 2);
  ctx.strokeStyle = vs.ringBoost ? vs.color : `rgba(${cr},${cg},${cb},0.42)`;
  ctx.lineWidth = ringW;
  ctx.stroke();

  // Rec 2 — type glyph
  const glyph = NODE_GLYPHS[node.id] || GROUP_GLYPHS[node.group] || "";
  if (glyph) {
    const gSize = Math.max(R * (glyph.length > 2 ? 0.38 : 0.52), 4 / scale);
    ctx.font = `700 ${gSize}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = vs.opacity > 0.4 ? "rgba(10,14,20,0.88)" : "rgba(230,237,243,0.25)";
    ctx.fillText(glyph, x, y);
  }

  // Rec 6 — smart label pill
  if (vs.showLabel) drawLabelPill(node, ctx, scale, R, vs);

  ctx.restore();
}

/* ---- Rec 4: curved gradient links via built-in curvature + custom paint ----
   Built-in renderer draws nothing (transparent); we paint the curved gradient
   stroke + relationship label in "after" mode, matching force-graph's own
   quadratic control point so the curve aligns with particle flow. */
function linkColorTransparent() { return "rgba(0,0,0,0)"; }

function drawLinkDecor(link, ctx, scale) {
  if (!isLinkVisible(link)) return;
  const s = link.source, t = link.target;
  if (s.x == null || t.x == null) return;
  const highlighted = highlightLinks.has(link);
  const cinematic = highlightNodes.size > 0 || focusNode != null;

  // Match force-graph's built-in curvature control point
  const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
  const dx = t.x - s.x, dy = t.y - s.y;
  const dist = Math.hypot(dx, dy) || 1;
  const cpx = mx + (dy) * LINK_CURVE * (dist / dist);
  const cpy = my - (dx) * LINK_CURVE * (dist / dist);
  const sc = COLORS[s.group] || "#7887a0";
  const tc = COLORS[t.group] || "#7887a0";

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.quadraticCurveTo(cpx, cpy, t.x, t.y);
  if (highlighted) {
    const grad = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
    grad.addColorStop(0, sc);
    grad.addColorStop(1, tc);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.4 / scale;
    ctx.globalAlpha = 0.9;
  } else {
    ctx.strokeStyle = cinematic ? "rgba(120,135,160,0.12)" : "rgba(120,135,160,0.4)";
    ctx.lineWidth = 1 / scale;
  }
  ctx.stroke();

  if (highlighted && link.rel) {
    const lx = 0.25 * s.x + 0.5 * cpx + 0.25 * t.x;
    const ly = 0.25 * s.y + 0.5 * cpy + 0.25 * t.y;
    const fs = Math.max(8 / scale, 3);
    ctx.globalAlpha = 1;
    ctx.font = `500 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
    const tw = ctx.measureText(link.rel).width;
    const pad = 3 / scale;
    ctx.fillStyle = "rgba(10,14,20,0.85)";
    roundRect(ctx, lx - tw / 2 - pad, ly - fs / 2 - pad, tw + pad * 2, fs + pad * 2, 3 / scale);
    ctx.fill();
    ctx.fillStyle = "#5eead4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(link.rel, lx, ly);
  }
  ctx.restore();
}

function applyRendererMode() {
  if (!Graph) return;
  // Nodes: reliable built-in circle base + decoration on top ("after").
  Graph.nodeColor(nodeColor)
    .nodeCanvasObject(drawNodeDecor)
    .nodeCanvasObjectMode(() => "after");
  // Links: built-in curvature for particle alignment; we paint the visuals.
  Graph.linkCurvature(LINK_CURVE)
    .linkColor(linkColorTransparent)
    .linkWidth(() => 0)
    .linkCanvasObject(drawLinkDecor)
    .linkCanvasObjectMode(() => "after");
}

/* ---------- 4. Cluster forces (initial organic layout only) ---------- */
function applyClusterForces(g) {
  const fx = g.d3Force("x");
  const fy = g.d3Force("y");
  if (fx) { fx.strength(0.06).x(n => (GROUP_ANCHORS[n.group] || { x: 0 }).x); }
  if (fy) { fy.strength(0.06).y(n => (GROUP_ANCHORS[n.group] || { y: 0 }).y); }
}

/* ---------- 5. Click-to-center with magnetic reorganization ----------
   force-graph's d3 engine won't reliably restart after it cools, so we drive
   the motion ourselves with a per-node spring. The clicked node glides to the
   view center; its neighbors settle on an inner ring and everything else on an
   outer ring, so the whole graph magnetically reorganizes. force-graph's render
   loop is always alive, so mutating node x/y repaints automatically. */
const SPRING_K = 0.045;   // pull toward target (higher = snappier)
const SPRING_D = 0.80;    // velocity damping (lower = more magnetic settle)
const RING_INNER = 78;
const RING_OUTER = 158;
const homePos = new Map();
let layoutTargets = null;
let layoutRaf = null;

function captureHome() {
  graphData.nodes.forEach(n => homePos.set(n.id, { x: n.x, y: n.y }));
}

function buildRadialTargets(focus) {
  const c = Graph.centerAt();
  const visible = graphData.nodes.filter(isNodeVisible);
  const nb = neighbors(focus).ns;
  const neigh = visible.filter(n => n.id !== focus.id && nb.has(n.id));
  const others = visible.filter(n => n.id !== focus.id && !nb.has(n.id));
  const t = new Map();
  t.set(focus.id, { x: c.x, y: c.y });
  const place = (list, radius, offset) => {
    list.forEach((n, i) => {
      const a = -Math.PI / 2 + offset + (i * 2 * Math.PI) / Math.max(list.length, 1);
      t.set(n.id, { x: c.x + Math.cos(a) * radius, y: c.y + Math.sin(a) * radius });
    });
  };
  place(neigh, RING_INNER, 0);
  place(others, RING_OUTER, 0.35);
  return t;
}

function focusOnNode(node) {
  if (!Graph) return;
  if (homePos.size === 0) captureHome();
  if (focusNode === node) { unfocus(); return; }
  focusNode = node;
  layoutTargets = buildRadialTargets(node);
  setFocusVignette(true);
  startLayoutLoop();
}

function unfocus() {
  if (!Graph || !focusNode) return;
  focusNode = null;
  const t = new Map();
  homePos.forEach((p, id) => t.set(id, { x: p.x, y: p.y }));
  layoutTargets = t;
  setFocusVignette(highlightNodes.size > 0);
  startLayoutLoop();
}

function startLayoutLoop() {
  if (!layoutRaf) layoutRaf = requestAnimationFrame(layoutTick);
}

function layoutTick() {
  layoutRaf = null;
  if (!Graph || !layoutTargets) return;
  let moving = false;
  graphData.nodes.forEach(n => {
    const tg = layoutTargets.get(n.id);
    if (!tg) return;
    n.__vx = ((n.__vx || 0) + (tg.x - n.x) * SPRING_K) * SPRING_D;
    n.__vy = ((n.__vy || 0) + (tg.y - n.y) * SPRING_K) * SPRING_D;
    n.x += n.__vx;
    n.y += n.__vy;
    if (Math.abs(tg.x - n.x) > 0.4 || Math.abs(tg.y - n.y) > 0.4 ||
        Math.abs(n.__vx) > 0.4 || Math.abs(n.__vy) > 0.4) moving = true;
  });
  if (moving) {
    layoutRaf = requestAnimationFrame(layoutTick);
  } else {
    layoutTargets.forEach((tg, id) => {
      const n = graphData.nodes.find(x => x.id === id);
      if (n) { n.x = tg.x; n.y = tg.y; n.__vx = 0; n.__vy = 0; }
    });
    if (!focusNode) layoutTargets = null;  // released: free nodes for dragging
  }
}

/* ---------- 7. Init ---------- */
function initGraph() {
  Graph = ForceGraph()(canvasEl)
    .graphData(graphData)
    .backgroundColor("rgba(0,0,0,0)")
    .nodeRelSize(4)
    .nodeVal("val")
    .nodeLabel(() => "")
    .nodeVisibility(isNodeVisible)
    .linkVisibility(isLinkVisible)
    .warmupTicks(80)
    .cooldownTime(3000)
    .linkDirectionalParticles(particleCount)
    .linkDirectionalParticleWidth(l => highlightLinks.has(l) ? 2.5 : 1.2)
    .linkDirectionalParticleSpeed(l => highlightLinks.has(l) ? 0.008 : 0.003)
    .linkDirectionalParticleColor(l => highlightLinks.has(l) ? "#5eead4" : "rgba(94,234,212,0.35)")
    .onNodeHover(node => {
      highlightNodes.clear();
      highlightLinks.clear();
      if (node) {
        const { ns, ls } = neighbors(node);
        highlightNodes = ns;
        highlightLinks = ls;
        canvasEl.style.cursor = "pointer";
        hoverNode = node;
        setFocusVignette(true);
      } else {
        canvasEl.style.cursor = "grab";
        hoverNode = null;
        setFocusVignette(!!focusNode);
      }
      if (Graph) {
        Graph.nodeColor(nodeColor);
        Graph.linkDirectionalParticles(particleCount);
      }
    })
    .onNodeClick(node => {
      showPanel(node);
      focusOnNode(node);
    })
    .onBackgroundClick(() => {
      resetPanel();
      unfocus();
    });

  applyRendererMode();
  // Keep the canvas repainting every frame. force-graph defaults
  // autoPauseRedraw=true, which halts drawing once the engine cools — that
  // froze/blanked the graph and stopped our per-frame pulse + cinematic
  // transitions. Continuous redraw is required for those effects.
  if (Graph.autoPauseRedraw) Graph.autoPauseRedraw(false);
  Graph.resumeAnimation();

  Graph.d3Force("charge").strength(-280);
  Graph.d3Force("link").distance(l => {
    const sg = l.source.group || "";
    const tg = l.target.group || "";
    return (sg === "skill" || tg === "skill") ? 50 : 85;
  });
  applyClusterForces(Graph);

  sizeGraph();
  startEffectsLoop();
  [150, 500, 1000, 1800].forEach(t =>
    setTimeout(() => { sizeGraph(); if (Graph && !focusNode) Graph.zoomToFit(500, 70); }, t)
  );
  setTimeout(() => {
    if (Graph && !focusNode) baseZoom = Graph.zoom();
    captureHome();
  }, 2200);
  if (/[?&]debug=1/.test(location.search)) {
    window.__G = Graph;
    window.__focusOnNode = focusOnNode;
    window.__unfocus = unfocus;
  }
  updateDebug();
}

function sizeGraph() {
  if (!Graph) return;
  const w = canvasEl.clientWidth || canvasEl.offsetWidth || 800;
  const h = canvasEl.clientHeight || canvasEl.offsetHeight || 600;
  Graph.width(w).height(h);
  drawBgParticles();
  updateDebug();
}
window.addEventListener("resize", sizeGraph);
if (typeof ResizeObserver !== "undefined") {
  new ResizeObserver(() => sizeGraph()).observe(canvasEl);
}

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
  Graph.nodeVisibility(isNodeVisible);
  Graph.linkVisibility(isLinkVisible);
  Graph.linkDirectionalParticles(particleCount);
  if (focusNode) {
    if (isNodeVisible(focusNode)) {
      layoutTargets = buildRadialTargets(focusNode);
      startLayoutLoop();
    } else {
      unfocus();
    }
  }
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
  setFocusVignette(false);
  unfocus();
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
    "My career as a graph — the way I build my systems. Click a node to pull it to the center and watch the graph reorganize. Hover to trace connections, and use the legend to filter by type.",
    "그래프로 표현한 제 커리어 — 제가 시스템을 만드는 방식 그대로. 노드를 클릭하면 중앙으로 끌려오며 그래프가 재배치됩니다. 호버해 연결을 추적하고, 범례로 유형을 필터링하세요."
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

/* ---- On-screen diagnostic (visible without DevTools) ----
   Captures JS errors and detects a stalled render loop, then prints the
   findings over the graph so a screenshot is enough to diagnose. */
const __diag = { errors: [], frames: 0, started: Date.now() };
function showDiag(extra) {
  let box = document.getElementById("graph-diag");
  if (!box) {
    box = document.createElement("div");
    box.id = "graph-diag";
    box.style.cssText =
      "position:absolute;left:10px;right:10px;top:10px;z-index:60;" +
      "font:11px/1.5 ui-monospace,Menlo,monospace;background:rgba(20,0,0,0.9);" +
      "color:#ff8a8a;padding:10px 12px;border-radius:8px;white-space:pre-wrap;" +
      "border:1px solid #ff5555;max-height:90%;overflow:auto;";
    canvasEl.style.position = "relative";
    canvasEl.appendChild(box);
  }
  const cvs = canvasEl.querySelector("canvas");
  const lines = [
    "GRAPH DIAGNOSTIC",
    "ForceGraph lib: " + (typeof window.ForceGraph),
    "Graph created: " + !!Graph,
    "renderer: " + (useFullRenderer ? "full" : "safe"),
    "canvas el: " + (cvs ? cvs.width + "x" + cvs.height + " (css " + cvs.style.width + ")" : "MISSING"),
    "client box: " + canvasEl.clientWidth + "x" + canvasEl.clientHeight,
    "DPR: " + window.devicePixelRatio,
    "frames seen: " + __diag.frames,
    "hardware accel: " + detectWebGL(),
    extra || "",
    __diag.errors.length ? "ERRORS:\n" + __diag.errors.join("\n") : "no JS errors captured",
  ];
  box.textContent = lines.filter(Boolean).join("\n");
}
function detectWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return "WebGL UNAVAILABLE";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "WebGL ok";
  } catch (e) { return "WebGL error: " + e.message; }
}
window.addEventListener("error", e => {
  __diag.errors.push((e.message || "error") + (e.filename ? " @ " + e.filename.split("/").pop() + ":" + e.lineno : ""));
  showDiag();
});
window.addEventListener("unhandledrejection", e => {
  __diag.errors.push("promise: " + (e.reason && e.reason.message ? e.reason.message : e.reason));
  showDiag();
});

window.addEventListener("load", () => {
  if (window.ForceGraph) {
    try {
      initGraph();
      if (Graph) Graph.onRenderFramePre(() => { __diag.frames++; });
    } catch (err) {
      console.error("Graph init failed:", err);
      __diag.errors.push("init: " + err.message);
      showDiag("initGraph() threw");
    }
  } else {
    console.error("force-graph library failed to load.");
    showDiag("force-graph library did not load");
  }
  animateCounters();

  // Watchdog: if the graph is in view but no frames have painted, surface it.
  setTimeout(() => {
    if (__diag.frames === 0 && !document.hidden) {
      showDiag("RENDER LOOP STALLED — 0 frames painted");
    }
  }, 4000);
});
