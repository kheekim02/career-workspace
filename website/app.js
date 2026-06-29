/* ============================================================
   Kunhee (Geoffrey) Kim — portfolio
   2D knowledge graph: filters, clustering, particles, degree sizing
   ============================================================ */

/* ---------- 1. Graph data model ---------- */
const COLORS = {
  person:  "#c9a227",   /* muted gold */
  org:     "#6889d4",   /* muted periwinkle */
  project: "#45b5a8",   /* muted teal */
  skill:   "#9a72c4",   /* muted violet */
};

const GROUP_ANCHORS = {
  person:  { x: 0,    y: 0    },
  org:     { x: -160, y: -120 },
  project: { x: 170,  y: -80  },
  skill:   { x: 0,    y: 150  },
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
  { id: "football", group: "project", label: "Football Analysis",
    desc: "AI/ML football analytics platform that extracts real-time performance data from video. Computer-vision pipelines for player detection, multi-object tracking, and camera perspective transformation for spatial-temporal modeling.",
    desc_ko: "영상에서 실시간 경기 데이터를 추출하는 AI/ML 축구 분석 플랫폼. 선수 감지, 다중 객체 추적, 카메라 원근 변환을 위한 컴퓨터 비전 파이프라인으로 시공간 모델링 수행.",
    meta: ["YOLO", "OpenCV", "Tracking"] },
  { id: "harmony", group: "project", label: "HarmonyAI",
    desc: "100% offline macOS app that auto-generates musically-correct vocal harmonies. Detects key & pitch contour, computes diatonic shifts (3rds/5ths/octaves) via PSOLA, with a real-time waveform/mixing GUI.",
    desc_ko: "음악적으로 정확한 보컬 화음을 자동 생성하는 100% 오프라인 macOS 앱. 키와 피치 컨투어를 감지하고 PSOLA로 다이어토닉 시프트(3도/5도/옥타브)를 계산하며, 실시간 파형/믹싱 GUI 제공.",
    meta: ["librosa", "PSOLA", "PySide6"] },
  { id: "python",   group: "skill", label: "Python",     desc: "Primary language: Pandas, Polars, FastAPI, concurrent pipelines.", desc_ko: "주력 언어: Pandas, Polars, FastAPI, 동시성 파이프라인.", meta: ["Pandas","Polars","FastAPI"] },
  { id: "sql",      group: "skill", label: "SQL",        desc: "Advanced SQL, schema design, query-planner diagnostics, performance tuning.", desc_ko: "고급 SQL, 스키마 설계, 쿼리 플래너 진단, 성능 튜닝.", meta: ["Schema design","Tuning"] },
  { id: "postgres", group: "skill", label: "PostgreSQL", desc: "Research warehouse: 33M+ records, TOAST tuning, modular schemas.", desc_ko: "연구 웨어하우스: 3,300만+ 레코드, TOAST 튜닝, 모듈식 스키마.", meta: ["Warehouse","TOAST"] },
  { id: "neo4j",    group: "skill", label: "Neo4j",      desc: "Knowledge graphs of corporate relationships extracted from filings.", desc_ko: "공시에서 추출한 기업 관계 지식 그래프.", meta: ["Knowledge graph"] },
  { id: "spark",    group: "skill", label: "Spark",      desc: "Distributed processing on a Linux analytics cluster.", desc_ko: "리눅스 분석 클러스터에서의 분산 처리.", meta: ["Distributed"] },
  { id: "ml",       group: "skill", label: "ML / NLP",   desc: "Local LLM inference (Ollama), Graph Neural Networks, entity resolution, backtesting.", desc_ko: "로컬 LLM 추론 (Ollama), 그래프 신경망, 엔티티 해상도, 백테스팅.", meta: ["LLM","GNN"] },
  { id: "infra",    group: "skill", label: "Infra / DevOps", desc: "Linux, cron/systemd, SSH tunneling, Docker, multi-host orchestration.", desc_ko: "리눅스, cron/systemd, SSH 터널링, Docker, 멀티 호스트 오케스트레이션.", meta: ["Linux","Docker"] },
  { id: "swift",    group: "skill", label: "Swift / iOS", desc: "SwiftUI, MapKit, ActivityKit, AVFoundation native development.", desc_ko: "SwiftUI, MapKit, ActivityKit, AVFoundation 네이티브 개발.", meta: ["SwiftUI","MapKit"] },
  { id: "tableau",  group: "skill", label: "Tableau",    desc: "Interactive dashboards for research & decision support.", desc_ko: "리서치 및 의사결정 지원을 위한 인터랙티브 대시보드.", meta: ["Dashboards"] },
  { id: "cv",       group: "skill", label: "Computer Vision", desc: "Real-time video analysis: YOLO detection, multi-object tracking, perspective transforms with OpenCV.", desc_ko: "실시간 영상 분석: YOLO 감지, 다중 객체 추적, OpenCV 기반 원근 변환.", meta: ["YOLO","OpenCV","Tracking"] },
  { id: "dsp",      group: "skill", label: "Audio DSP",   desc: "Digital signal processing: pitch detection (pYIN), key estimation, and PSOLA harmony synthesis.", desc_ko: "디지털 신호 처리: 피치 감지(pYIN), 키 추정, PSOLA 화음 합성.", meta: ["librosa","PSOLA","pYIN"] },
];

const LINK_DEFS = [
  ["me","gka","works at"], ["me","berkeley","studied at"],
  ["me","alpha","built"], ["me","pathwise","built"], ["me","fnf","researched"],
  ["me","football","built"], ["me","harmony","built"],
  ["gka","alpha","powers"], ["berkeley","fnf","hosts"], ["berkeley","pathwise","incubated"],
  ["alpha","python","uses"], ["alpha","postgres","uses"], ["alpha","neo4j","uses"],
  ["alpha","ml","uses"], ["alpha","spark","uses"], ["alpha","infra","uses"],
  ["pathwise","swift","uses"], ["pathwise","python","uses"], ["pathwise","postgres","uses"], ["pathwise","infra","uses"],
  ["fnf","tableau","uses"], ["fnf","sql","uses"], ["fnf","ml","uses"],
  ["football","python","uses"], ["football","ml","uses"], ["football","cv","uses"],
  ["harmony","python","uses"], ["harmony","dsp","uses"],
  ["me","python","skills"], ["me","sql","skills"],
];

/* Per-node glyph drawn inside the sphere (Rec 2) */
const NODE_GLYPHS = {
  me: "◎", gka: "⌂", berkeley: "▣",
  alpha: "◈", pathwise: "◉", fnf: "◆", football: "◐", harmony: "◑",
  python: "Py", sql: "SQL", postgres: "PG", neo4j: "N4",
  spark: "Sp", ml: "ML", infra: "Dev", swift: "Sw", tableau: "Tb",
  cv: "CV", dsp: "DSP",
};
const GROUP_GLYPHS = { person: "◎", org: "◇", project: "◈", skill: "◆" };

/* ---------- 2. Degree + state ---------- */
const DEGREE = {};
NODES.forEach(n => { DEGREE[n.id] = 0; });
LINK_DEFS.forEach(([s, t]) => { DEGREE[s]++; DEGREE[t]++; });

// Meaningful sizing: clear tier by role, refined by how connected the node is.
//   me (hub) > projects & orgs (anchors) > skills (leaves)
function nodeSize(node) {
  const d = DEGREE[node.id] || 1;
  if (node.id === "me") return 40;
  if (node.group === "project") return 22 + d * 1.4;
  if (node.group === "org") return 18 + d * 1.2;
  return 11 + d * 1.2; // skills
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
let activeGroups = new Set(["person", "org", "project"]);
let baseZoom = 1;
let focusNode = null;

/* Progressive disclosure: skills stay hidden until the visitor hovers/clicks a
   node they belong to (keeps the default view uncluttered). The legend "Skills
   & Tech" toggle pins them all on. */
let revealedSkills = new Set();
function skillsPinned() { return activeGroups.has("skill"); }
function byId(id) { return graphData.nodes.find(n => n.id === id); }
function updateRevealedSkills() {
  revealedSkills.clear();
  if (!skillsPinned()) {
    const src = hoverNode || focusNode;
    if (src) {
      neighbors(src).ns.forEach(id => {
        const n = byId(id);
        if (n && n.group === "skill") revealedSkills.add(id);
      });
    }
  }
  startRevealLoop();
}

/* ---- Shared render state ---- */
let useFullRenderer = !/[?&]renderer=safe/.test(location.search);

/* ---------- 3. Visibility-based filtering helpers ---------- */
function isNodeVisible(node) {
  if (activeGroups.has(node.group)) return true;
  if (node.group === "skill") {
    // Visible while targeted OR still fading out (alpha not yet zero).
    return revealedSkills.has(node.id) || (skillReveal.get(node.id) ?? 0) > 0.01;
  }
  return false;
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
  return highlightLinks.has(link) ? 4 : 0;
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
  const f = v => Math.round(v + (255 - v) * amt);
  return `${f(r)},${f(g)},${f(b)}`;
}

/* ---- Reveal animation: skills fade + scale in/out smoothly ---- */
const skillReveal = new Map();   // id -> linear progress 0..1
let revealRaf = null;
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function revealAlpha(node) {
  if (node.group !== "skill") return 1;
  return easeOutCubic(skillReveal.get(node.id) ?? 0);
}
function revealTarget(id) {
  return (skillsPinned() || revealedSkills.has(id)) ? 1 : 0;
}
function startRevealLoop() {
  if (!revealRaf) revealRaf = requestAnimationFrame(tickReveal);
}
function tickReveal() {
  revealRaf = null;
  let animating = false;
  let visibilityChanged = false;
  graphData.nodes.forEach(n => {
    if (n.group !== "skill") return;
    const tgt = revealTarget(n.id);
    let cur = skillReveal.get(n.id) ?? 0;
    const before = cur > 0.01;
    const step = 0.11;
    if (cur < tgt) cur = Math.min(tgt, cur + step);
    else if (cur > tgt) cur = Math.max(tgt, cur - step);
    skillReveal.set(n.id, cur);
    if (Math.abs(cur - tgt) > 0.001) animating = true;
    if ((cur > 0.01) !== before) visibilityChanged = true;
  });
  // When a node crosses the visibility threshold, refresh the accessor so
  // force-graph starts/stops rendering it (and its links).
  if (visibilityChanged) applyVisibility();
  if (animating) revealRaf = requestAnimationFrame(tickReveal);
}
/* ---- Visual state: calm at rest, rich on hover / focus ---- */
function getNodeVisualState(node) {
  const inSubgraph = highlightNodes.size === 0 || highlightNodes.has(node.id);
  const interacting = highlightNodes.size > 0 || focusNode != null;
  const dim = highlightNodes.size > 0 && !highlightNodes.has(node.id);
  const isFocusCenter = focusNode && focusNode.id === node.id;
  const isHub = node.id === "me";
  const isHovered = hoverNode && hoverNode.id === node.id;
  const ra = revealAlpha(node);   // 1 for non-skills; 0..1 fade for skills

  return {
    opacity: (dim ? (interacting ? 0.18 : 1) : 1) * ra,
    scale: (dim && interacting ? 0.9 : 1) * (node.group === "skill" ? 0.62 + 0.38 * ra : 1),
    showGlow: isHub || isFocusCenter || isHovered,
    glowAlpha: isFocusCenter ? 0.16 : isHovered ? 0.12 : isHub ? 0.05 : 0,
    showRing: isFocusCenter,
    showGlyph: interacting && inSubgraph,
    // Structural nodes always labeled; skill labels appear only on interaction.
    showLabel: node.group === "skill" ? (interacting && inSubgraph) : true,
    labelBright: !interacting || inSubgraph,
    color: COLORS[node.group] || "#888",
  };
}

function setFocusVignette(on) {
  if (viewportEl) viewportEl.classList.toggle("is-focused", !!on);
}

/* ---- Node radius (shared) ---- */
function nodeRadius(node) {
  return Math.sqrt(Math.max(node.val, 1)) * 4;
}

/* Label with a subtle dark backing plate for legibility over links/nodes */
function drawLabelPlain(node, ctx, scale, r, vs) {
  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
  scale = safeScale(scale);
  const isHub = node.id === "me";
  const fontSize = Math.max((isHub ? 11 : 9.5) / scale, 3.4);
  ctx.font = `${isHub ? 700 : 500} ${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const text = node.label;
  const tw = ctx.measureText(text).width;
  const padX = 4 / scale;
  const padY = 2 / scale;
  const top = node.y + r + 4 / scale;
  const op = vs.opacity;

  // Backing plate — keeps text readable against lines and dimmed nodes
  ctx.fillStyle = `rgba(8,12,18,${(vs.labelBright ? 0.72 : 0.45) * op})`;
  roundRect(ctx, node.x - tw / 2 - padX, top - padY, tw + padX * 2, fontSize + padY * 2, 3 / scale);
  ctx.fill();

  ctx.fillStyle = vs.labelBright
    ? `rgba(236,242,248,${0.96 * op})`
    : `rgba(170,182,198,${0.7 * op})`;
  ctx.fillText(text, node.x, top);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const LINK_CURVE = 0.06;

/* Built-in circle = flat base color. "After" pass adds interaction-only polish. */
function nodeColor(node) {
  const vs = getNodeVisualState(node);
  const [r, g, b] = hexRgb(vs.color);
  return `rgba(${r},${g},${b},${vs.opacity})`;
}

function safeScale(scale) {
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

function drawNodeDecor(node, ctx, scale) {
  scale = safeScale(scale);
  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

  const vs = getNodeVisualState(node);
  const R = Math.max(nodeRadius(node) * vs.scale, 2);
  const { x, y } = node;
  const [cr, cg, cb] = hexRgb(vs.color);

  ctx.save();
  ctx.globalAlpha = vs.opacity;

  // Subtle glow — hub at rest, stronger on hover / focus only
  if (useFullRenderer && vs.showGlow && vs.glowAlpha > 0) {
    ctx.globalCompositeOperation = "destination-over";
    ctx.beginPath();
    ctx.arc(x, y, R * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${vs.glowAlpha})`;
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  // Tasteful depth on top of the flat base circle: light from above + a soft
  // edge vignette read as a raised token, not a glossy sphere. Scale the effect
  // down on small nodes so skill dots stay clean.
  if (useFullRenderer && R > 2) {
    const d = Math.max(0.45, Math.min(1, (R - 4) / 10));   // depth intensity by size
    const op = vs.opacity * d;
    // Top sheen
    const sy = y - R * 0.32;
    const sheen = ctx.createRadialGradient(x, sy, R * 0.08, x, sy, R * 1.05);
    sheen.addColorStop(0, `rgba(255,255,255,${0.18 * op})`);
    sheen.addColorStop(0.55, `rgba(255,255,255,${0.05 * op})`);
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = sheen; ctx.fill();
    // Edge vignette
    const vig = ctx.createRadialGradient(x, y, R * 0.6, x, y, R);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, `rgba(0,0,0,${0.2 * op})`);
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = vig; ctx.fill();
    // Crisp lighter rim for definition against the dark background
    ctx.beginPath(); ctx.arc(x, y, Math.max(R - 0.5 / scale, 1), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${lightenHex(vs.color, 0.4)},${0.4 * vs.opacity})`;
    ctx.lineWidth = 1 / scale;
    ctx.stroke();
  }

  // Selection ring — focused node only
  if (useFullRenderer && vs.showRing) {
    ctx.beginPath();
    ctx.arc(x, y, R + 4 / scale, 0, Math.PI * 2);
    ctx.strokeStyle = vs.color;
    ctx.lineWidth = 1.5 / scale;
    ctx.stroke();
  }

  // Glyph — visible in active subgraph only
  if (useFullRenderer && vs.showGlyph) {
    const glyph = NODE_GLYPHS[node.id] || GROUP_GLYPHS[node.group] || "";
    if (glyph) {
      const gSize = Math.max(R * (glyph.length > 2 ? 0.36 : 0.48), 4 / scale);
      ctx.font = `600 ${gSize}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(10,14,20,0.82)";
      ctx.fillText(glyph, x, y);
    }
  }

  if (vs.showLabel) drawLabelPlain(node, ctx, scale, R, vs);

  ctx.restore();
}

function linkColorTransparent() { return "rgba(0,0,0,0)"; }

function drawLinkDecor(link, ctx, scale) {
  scale = safeScale(scale);
  if (!isLinkVisible(link)) return;
  const s = link.source, t = link.target;
  if (!Number.isFinite(s.x) || !Number.isFinite(s.y) ||
      !Number.isFinite(t.x) || !Number.isFinite(t.y)) return;

  const highlighted = highlightLinks.has(link);
  const interacting = highlightNodes.size > 0 || focusNode != null;
  // Fade links in/out with the reveal of any skill endpoint.
  const la = Math.min(revealAlpha(s), revealAlpha(t));
  if (la <= 0.01) return;
  const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
  const dx = t.x - s.x, dy = t.y - s.y;
  const cpx = mx + dy * LINK_CURVE;
  const cpy = my - dx * LINK_CURVE;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.quadraticCurveTo(cpx, cpy, t.x, t.y);
  if (highlighted) {
    ctx.strokeStyle = `rgba(110,240,220,${0.9 * la})`;
    ctx.lineWidth = 2.2 / scale;
  } else {
    ctx.strokeStyle = interacting
      ? `rgba(140,155,180,${0.16 * la})`
      : `rgba(150,165,190,${0.55 * la})`;
    ctx.lineWidth = 1.4 / scale;
  }
  ctx.stroke();

  if (highlighted && link.rel) {
    const lx = 0.25 * s.x + 0.5 * cpx + 0.25 * t.x;
    const ly = 0.25 * s.y + 0.5 * cpy + 0.25 * t.y;
    const fs = Math.max(8 / scale, 3.2);
    ctx.font = `500 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
    const tw = ctx.measureText(link.rel).width;
    const pad = 3 / scale;
    ctx.fillStyle = "rgba(8,12,18,0.82)";
    roundRect(ctx, lx - tw / 2 - pad, ly - fs / 2 - pad, tw + pad * 2, fs + pad * 2, 3 / scale);
    ctx.fill();
    ctx.fillStyle = "rgba(120,245,225,0.95)";
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
  if (fx) { fx.strength(0.09).x(n => (GROUP_ANCHORS[n.group] || { x: 0 }).x); }
  if (fy) { fy.strength(0.09).y(n => (GROUP_ANCHORS[n.group] || { y: 0 }).y); }
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
    .linkDirectionalParticleWidth(l => highlightLinks.has(l) ? 2 : 0)
    .linkDirectionalParticleSpeed(l => highlightLinks.has(l) ? 0.006 : 0)
    .linkDirectionalParticleColor(l => highlightLinks.has(l) ? "rgba(94,234,212,0.6)" : "rgba(0,0,0,0)")
    .onNodeHover(node => {
      highlightNodes.clear();
      highlightLinks.clear();
      if (node) {
        const { ns, ls } = neighbors(node);
        highlightNodes = ns;
        highlightLinks = ls;
        canvasEl.style.cursor = "pointer";
        hoverNode = node;
      } else {
        canvasEl.style.cursor = "grab";
        hoverNode = null;
      }
      updateRevealedSkills();
      applyVisibility();
      if (Graph) {
        Graph.nodeColor(nodeColor);
        Graph.linkDirectionalParticles(particleCount);
      }
    })
    .onNodeClick(node => {
      showPanel(node);
      updateRevealedSkills();
      applyVisibility();
      focusOnNode(node);
    })
    .onBackgroundClick(() => {
      resetPanel();
      unfocus();
      updateRevealedSkills();
      applyVisibility();
    });

  applyRendererMode();
  // autoPauseRedraw=true halts drawing once the engine cools.
  if (Graph.autoPauseRedraw) Graph.autoPauseRedraw(false);
  Graph.resumeAnimation();

  Graph.d3Force("charge").strength(-460);
  Graph.d3Force("link").distance(l => {
    const sg = l.source.group || "";
    const tg = l.target.group || "";
    return (sg === "skill" || tg === "skill") ? 76 : 116;
  });
  applyClusterForces(Graph);

  sizeGraph();
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
function applyVisibility() {
  if (!Graph) return;
  Graph.nodeVisibility(isNodeVisible);
  Graph.linkVisibility(isLinkVisible);
  Graph.linkDirectionalParticles(particleCount);
}

function refreshVisibility() {
  if (!Graph) return;
  updateRevealedSkills();
  applyVisibility();
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
  panel_eyebrow: ["THE GRAPH", "그래프 소개"],
  panel_intro: [
    "A live map of my career — how I connect to the organizations I've worked with, the projects I've built, and the tools I use. Larger nodes are more central; color marks the type. Hover to trace a connection, click to focus a node and reorganize the graph around it.",
    "제 커리어를 실시간으로 보여주는 지도 — 함께한 조직, 직접 만든 프로젝트, 사용하는 기술의 연결 관계입니다. 노드가 클수록 더 중심적이며, 색은 유형을 나타냅니다. 호버하면 연결을 추적하고, 클릭하면 해당 노드를 중심으로 그래프가 재배치됩니다."
  ],
  panel_readkey: ["Node size = how connected · Color = type · Hover a project to reveal its tools", "노드 크기 = 연결 정도 · 색 = 유형 · 프로젝트에 호버하면 사용 기술이 나타납니다"],
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
